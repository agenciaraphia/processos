<?php
if (!defined('ABSPATH')) exit;
class MSG_Plugin {
 private static $instance; private $db;
 public static function instance(){ if(!self::$instance) self::$instance=new self(); return self::$instance; }
 private function __construct(){ global $wpdb; $this->db=$wpdb; if(get_option('msg_db_version')!==MSG_VERSION) self::activate(); add_action('admin_post_msg_update_campaign',[$this,'update_campaign']); add_action('admin_menu',[$this,'menu']); add_action('admin_enqueue_scripts',[$this,'admin_assets']); add_filter('admin_body_class',[$this,'admin_body_class']); add_action('admin_post_msg_save_campaign',[$this,'save_campaign']); add_action('admin_post_msg_save_prize',[$this,'save_prize']); add_action('admin_post_msg_add_coupons',[$this,'add_coupons']); add_action('admin_post_msg_delete_campaign',[$this,'delete_campaign']); add_action('admin_post_msg_export_leads',[$this,'export_leads']); add_action('admin_post_msg_delete_leads',[$this,'delete_leads']); add_shortcode('mini_salgados',[$this,'shortcode']); add_shortcode('mini_salgados_games',[$this,'shortcode']); add_action('wp_enqueue_scripts',[$this,'register_assets']); add_action('rest_api_init',[$this,'routes']); add_action('elementor/widgets/register',[$this,'elementor_widget']); }
 // dbDelta only diffs a schema written with one column per line, so new columns reach existing installs.
 private static function schema(){ return [
  'campaigns'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','name varchar(190) NOT NULL','slug varchar(190) NOT NULL',"status varchar(20) NOT NULL DEFAULT 'draft'",'start_at datetime NULL','end_at datetime NULL','games text NOT NULL','cooldown_hours int NOT NULL DEFAULT 24','win_chance decimal(5,2) NOT NULL DEFAULT 25.00',"chance_mode varchar(20) NOT NULL DEFAULT 'automatic'",'campaign_goal int NOT NULL DEFAULT 0','expected_plays int NOT NULL DEFAULT 1000','roleta_labels text NULL',"primary_color varchar(20) NOT NULL DEFAULT '#E00025'","secondary_color varchar(20) NOT NULL DEFAULT '#FFCA09'",'logo_url text NULL','intro_text text NULL','win_text text NULL','lose_text text NULL',"font_family varchar(100) NOT NULL DEFAULT 'Montserrat'","heading_font_family varchar(100) NOT NULL DEFAULT 'Fredoka One'",'created_at datetime NOT NULL','PRIMARY KEY  (id)','UNIQUE KEY slug (slug)'],
  'prizes'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','campaign_id bigint unsigned NOT NULL','game varchar(20) NOT NULL','name varchar(190) NOT NULL','weight decimal(8,3) NOT NULL DEFAULT 1',"stock_mode varchar(20) NOT NULL DEFAULT 'unique'",'shared_code varchar(190) NULL','shared_limit int NOT NULL DEFAULT 0','active tinyint NOT NULL DEFAULT 1','created_at datetime NOT NULL','PRIMARY KEY  (id)','KEY campaign_game (campaign_id,game)'],
  'coupons'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','prize_id bigint unsigned NOT NULL','code varchar(190) NOT NULL',"status varchar(20) NOT NULL DEFAULT 'available'",'lead_id bigint unsigned NULL','created_at datetime NOT NULL','assigned_at datetime NULL','PRIMARY KEY  (id)','KEY prize_code (prize_id,code)','KEY status (prize_id,status)'],
  'leads'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','campaign_id bigint unsigned NOT NULL','name varchar(190) NOT NULL','phone varchar(50) NOT NULL','phone_hash char(64) NOT NULL','token_hash char(64) NOT NULL','ip_hash char(64) NULL','marketing_consent tinyint NOT NULL DEFAULT 0','privacy_accepted tinyint NOT NULL DEFAULT 1','created_at datetime NOT NULL','last_seen datetime NOT NULL','PRIMARY KEY  (id)','UNIQUE KEY campaign_phone (campaign_id,phone_hash)','UNIQUE KEY token_hash (token_hash)','KEY campaign_id (campaign_id)'],
  'plays'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','campaign_id bigint unsigned NOT NULL','lead_id bigint unsigned NOT NULL','game varchar(20) NOT NULL','result varchar(20) NOT NULL','prize_id bigint unsigned NULL','coupon_id bigint unsigned NULL','created_at datetime NOT NULL','PRIMARY KEY  (id)','KEY lead_game (lead_id,game)','KEY campaign_game (campaign_id,game)'],
  'audit'=>['id bigint unsigned NOT NULL AUTO_INCREMENT','campaign_id bigint unsigned NOT NULL','admin_id bigint unsigned NOT NULL','event varchar(190) NOT NULL','details text NULL','created_at datetime NOT NULL','PRIMARY KEY  (id)'],
 ]; }
 public static function activate(){ global $wpdb; require_once ABSPATH.'wp-admin/includes/upgrade.php'; $charset=$wpdb->get_charset_collate();
 foreach(self::schema() as $name=>$lines) dbDelta("CREATE TABLE {$wpdb->prefix}msg_{$name} (\n".implode(",\n",$lines)."\n) $charset;"); update_option('msg_db_version',MSG_VERSION); }
 // Repairs tables that are missing or lack columns (older versions could not add columns on upgrade).
 private function ensure_schema(){ foreach(self::schema() as $name=>$lines){ $table=$this->table($name); if($this->db->get_var($this->db->prepare('SHOW TABLES LIKE %s',$table))!==$table){ self::activate(); return; } $cols=(array)$this->db->get_col("SHOW COLUMNS FROM $table"); foreach($lines as $line){ $col=strtok($line,' '); if(!in_array($col,['PRIMARY','UNIQUE','KEY'],true) && !in_array($col,$cols,true)){ self::activate(); return; } } } }
 private function fail_redirect($text,$page){ $error=$this->db->last_error; wp_safe_redirect(add_query_arg(['msg'=>rawurlencode($text.($error?' Erro do banco de dados: '.$error:'')),'msg_type'=>'error'],admin_url('admin.php?page='.$page))); exit; }
 private function table($name){ return $this->db->prefix.'msg_'.$name; }
 public function register_assets(){ wp_register_style('msg-games',MSG_URL.'assets/games.css',[],MSG_VERSION); wp_register_script('msg-games',MSG_URL.'assets/games.js',[],MSG_VERSION,true); }
 public function routes(){ register_rest_route('mini-salgados/v1','/register',['methods'=>'POST','callback'=>[$this,'api_register'],'permission_callback'=>'__return_true']); register_rest_route('mini-salgados/v1','/play',['methods'=>'POST','callback'=>[$this,'api_play'],'permission_callback'=>'__return_true']); }
 private function json_error($message,$status=400){ return new WP_REST_Response(['success'=>false,'message'=>$message],$status); }
 private function campaign($slug){ return $this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('campaigns')} WHERE slug=%s",sanitize_title($slug))); }
 private function hash_value($s){ return hash_hmac('sha256',(string)$s,wp_salt('auth')); }
 private function font_options(){ return [
  'Montserrat'=>'Montserrat','Fredoka One'=>'Fredoka One','Fredoka'=>'Fredoka','Baloo 2'=>'Baloo 2','Lilita One'=>'Lilita One','Chewy'=>'Chewy','DM Sans'=>'DM Sans','Inter'=>'Inter','Manrope'=>'Manrope','Nunito Sans'=>'Nunito Sans','Outfit'=>'Outfit','Plus Jakarta Sans'=>'Plus Jakarta Sans','Urbanist'=>'Urbanist','Rubik'=>'Rubik','Poppins'=>'Poppins','Lato'=>'Lato','Open Sans'=>'Open Sans','Roboto'=>'Roboto','Source Sans 3'=>'Source Sans 3','Work Sans'=>'Work Sans','Figtree'=>'Figtree','Jost'=>'Jost','Barlow'=>'Barlow','Archivo'=>'Archivo','Sora'=>'Sora','Space Grotesk'=>'Space Grotesk','Raleway'=>'Raleway','Mulish'=>'Mulish','Karla'=>'Karla','IBM Plex Sans'=>'IBM Plex Sans','Libre Franklin'=>'Libre Franklin','Roboto Condensed'=>'Roboto Condensed','Oswald'=>'Oswald','Bebas Neue'=>'Bebas Neue','Anton'=>'Anton','Playfair Display'=>'Playfair Display','DM Serif Display'=>'DM Serif Display','Fraunces'=>'Fraunces','Lora'=>'Lora','Merriweather'=>'Merriweather','Cormorant Garamond'=>'Cormorant Garamond','Libre Baskerville'=>'Libre Baskerville','Bodoni Moda'=>'Bodoni Moda','Josefin Sans'=>'Josefin Sans','Quicksand'=>'Quicksand'
 ]; }
 // Families published in a single weight must be requested without a weight axis.
 private function single_weight_fonts(){ return ['Fredoka One','Lilita One','Chewy','Bebas Neue','Anton']; }
 private function safe_font($font,$fallback='Montserrat'){ $font=(string)$font; $options=$this->font_options(); return isset($options[$font])?$font:$fallback; }
 private function font_select_html($name,$selected){ $selected=$this->safe_font($selected,$name==='heading_font_family'?'Fredoka One':'Montserrat'); $html='<select name="'.esc_attr($name).'" class="msg-font-select" data-msg-font="'.esc_attr($name).'">'; foreach($this->font_options() as $font){$html.='<option value="'.esc_attr($font).'" '.selected($selected,$font,false).'>'.esc_html($font).'</option>';} return $html.'</select>'; }
 private function google_fonts_url($fonts){ $families=[]; foreach(array_unique($fonts) as $font){ $family='family='.str_replace('%20','+',rawurlencode($font)); $families[]=in_array($font,$this->single_weight_fonts(),true)?$family:$family.':wght@400;500;600;700;800'; } return 'https://fonts.googleapis.com/css2?'.implode('&',$families).'&display=swap'; }
 private function enqueue_campaign_fonts($slug,$body,$heading){ $body=$this->safe_font($body); $heading=$this->safe_font($heading,'Fredoka One'); wp_enqueue_style('msg-google-fonts-'.sanitize_key($slug),$this->google_fonts_url([$body,$heading]),[],null); }
 // Picks white or near-black text, whichever contrasts more with the campaign colour.
 private function on_color($hex){ $hex=ltrim((string)$hex,'#'); if(strlen($hex)===3) $hex=$hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2]; if(!preg_match('/^[0-9a-f]{6}$/i',$hex)) return '#ffffff'; $lin=function($c){ $c=$c/255; return $c<=0.03928?$c/12.92:pow(($c+0.055)/1.055,2.4); }; $l=0.2126*$lin(hexdec(substr($hex,0,2)))+0.7152*$lin(hexdec(substr($hex,2,2)))+0.0722*$lin(hexdec(substr($hex,4,2))); return (1.05/($l+0.05))>=(($l+0.05)/0.0609)?'#ffffff':'#1f1a17'; }

 private function ip_hash(){ $ip=isset($_SERVER['REMOTE_ADDR'])?sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])):''; return $ip?$this->hash_value($ip):''; }
 public function api_register(WP_REST_Request $r){
  $slug=sanitize_title($r->get_param('campaign')); $c=$this->campaign($slug);
  if(!$c) return $this->json_error('Campanha não encontrada.',404);
  if(!$this->campaign_open($c)) return $this->json_error('Esta campanha não está recebendo participações.');
  $name=sanitize_text_field($r->get_param('name')); $phone=preg_replace('/\D+/','',(string)$r->get_param('phone'));
  $privacy=!empty($r->get_param('privacy'));
  if(!$privacy) return $this->json_error('É necessário aceitar o aviso de privacidade.');
  if(mb_strlen($name)<2 || strlen($phone)<10 || strlen($phone)>15) return $this->json_error('Informe seu nome e um WhatsApp válido.');
  $phone_hash=$this->hash_value($phone); $table=$this->table('leads'); $now=current_time('mysql'); $marketing=!empty($r->get_param('marketing'))?1:0;
  $existing=$this->db->get_row($this->db->prepare("SELECT * FROM $table WHERE campaign_id=%d AND phone_hash=%s",$c->id,$phone_hash));
  $provided_token=sanitize_text_field($r->get_param('token'));
  if($existing){
   $lead_id=(int)$existing->id;
   $token_is_valid=$provided_token!=='' && hash_equals((string)$existing->token_hash,$this->hash_value($provided_token));
   if($token_is_valid){ $token=$provided_token; $token_hash=$existing->token_hash; }
   else { $token=wp_generate_password(48,false,false); $token_hash=$this->hash_value($token); }
   $updated=['name'=>$name,'phone'=>$phone,'ip_hash'=>$this->ip_hash(),'last_seen'=>$now,'marketing_consent'=>$marketing];
   if(!$token_is_valid) $updated['token_hash']=$token_hash;
   $this->db->update($table,$updated,['id'=>$lead_id]);
  } else {
   $token=wp_generate_password(48,false,false); $token_hash=$this->hash_value($token);
   $ok=$this->db->insert($table,['campaign_id'=>$c->id,'name'=>$name,'phone'=>$phone,'phone_hash'=>$phone_hash,'token_hash'=>$token_hash,'ip_hash'=>$this->ip_hash(),'marketing_consent'=>$marketing,'privacy_accepted'=>1,'created_at'=>$now,'last_seen'=>$now]);
   if(!$ok) return $this->json_error('Não foi possível concluir o cadastro. Tente novamente.',500);
   $lead_id=(int)$this->db->insert_id;
  }
  return new WP_REST_Response(['success'=>true,'token'=>$token,'name'=>$name,'games'=>$this->available_games($c,$lead_id)],200);
 }
 private function campaign_open($c){ if($c->status!=='active') return false; $now=current_time('timestamp'); if($c->start_at && strtotime($c->start_at)>$now) return false; if($c->end_at && strtotime($c->end_at)<$now) return false; return true; }
 private function enabled_games($c){ $g=json_decode($c->games,true); $valid=['roleta','raspadinha','caixa']; if(!is_array($g)) $g=[]; return array_values(array_intersect($valid,$g)); }
 private function available_games($c,$lead_id){ $out=[]; $cooldown=max(1,(int)$c->cooldown_hours); foreach($this->enabled_games($c) as $game){ $last=$this->db->get_var($this->db->prepare("SELECT created_at FROM {$this->table('plays')} WHERE campaign_id=%d AND lead_id=%d AND game=%s ORDER BY id DESC LIMIT 1",$c->id,$lead_id,$game)); $won=(bool)$this->db->get_var($this->db->prepare("SELECT id FROM {$this->table('plays')} WHERE campaign_id=%d AND lead_id=%d AND game=%s AND result='win' LIMIT 1",$c->id,$lead_id,$game)); $next=$last?strtotime($last)+$cooldown*HOUR_IN_SECONDS:0; $out[$game]=['label'=>$this->game_label($game),'won'=>$won,'available'=>!$last || $next<=current_time('timestamp'),'next_at'=>$last?wp_date('c',$next):null]; } return $out; }
 private function game_label($game){ return ['roleta'=>'Roleta premiada','raspadinha'=>'Raspadinha','caixa'=>'Caixa misteriosa'][$game]??$game; }
 public function api_play(WP_REST_Request $r){
  $slug=sanitize_title($r->get_param('campaign')); $game=sanitize_key($r->get_param('game')); $token=sanitize_text_field($r->get_param('token')); $c=$this->campaign($slug);
  if(!$c || !in_array($game,$this->enabled_games($c),true)) return $this->json_error('Jogo ou campanha inválidos.');
  if(!$this->campaign_open($c)) return $this->json_error('Esta campanha não está recebendo participações.');
  if(!$token) return $this->json_error('Faça seu cadastro para jogar.');
  $lead=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('leads')} WHERE campaign_id=%d AND token_hash=%s",$c->id,$this->hash_value($token)));
  if(!$lead) return $this->json_error('Não foi possível reconhecer seu cadastro. Informe seus dados novamente.',401);
  // Serialize attempts for this participant/game to prevent simultaneous requests bypassing cooldown or win limits.
  $lock_name='msgplay_'.md5($c->id.':'.$lead->id.':'.$game);
  $locked=(int)$this->db->get_var($this->db->prepare('SELECT GET_LOCK(%s,5)',$lock_name));
  if($locked!==1) return $this->json_error('Estamos processando sua tentativa. Aguarde alguns segundos e tente novamente.',429);
  try {
   $last=$this->db->get_var($this->db->prepare("SELECT created_at FROM {$this->table('plays')} WHERE campaign_id=%d AND lead_id=%d AND game=%s ORDER BY id DESC LIMIT 1",$c->id,$lead->id,$game));
   if($last && strtotime($last)+max(1,(int)$c->cooldown_hours)*HOUR_IN_SECONDS>current_time('timestamp')) return $this->json_error('Você já participou deste jogo. Tente novamente após o período de espera.');
   $already_won=(bool)$this->db->get_var($this->db->prepare("SELECT id FROM {$this->table('plays')} WHERE campaign_id=%d AND lead_id=%d AND game=%s AND result='win' LIMIT 1",$c->id,$lead->id,$game));
   $prizes=$this->db->get_results($this->db->prepare("SELECT * FROM {$this->table('prizes')} WHERE campaign_id=%d AND game=%s AND active=1 ORDER BY id",$c->id,$game));
   $eligible=[]; $total=0;
   if(!$already_won){ foreach($prizes as $pr){ $stock=$this->stock_count($pr); if($stock>0){ $weight=max(0.001,(float)$pr->weight)*(float)$stock; $eligible[]=['prize'=>$pr,'weight'=>$weight]; $total+=$weight; } } }
   $mode=$c->chance_mode??'automatic'; $win_chance=max(0,min(100,(float)($c->win_chance??25)));
   if($mode==='goal' && (int)($c->campaign_goal??0)>0){ $delivered=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('coupons')} co INNER JOIN {$this->table('prizes')} pr ON pr.id=co.prize_id WHERE pr.campaign_id=%d AND co.status='assigned'",$c->id)); $all_plays=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('plays')} WHERE campaign_id=%d",$c->id)); $goal_left=max(0,(int)$c->campaign_goal-$delivered); $plays_left=max(1,(int)($c->expected_plays??1000)-$all_plays); $win_chance=max(0,min(100,($goal_left/$plays_left)*100)); }
   elseif($mode==='automatic'){ $all_plays=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('plays')} WHERE campaign_id=%d",$c->id)); $plays_left=max(1,(int)($c->expected_plays??1000)-$all_plays); $remaining_stock=0; $all_prizes=$this->db->get_results($this->db->prepare("SELECT * FROM {$this->table('prizes')} WHERE campaign_id=%d AND active=1",$c->id)); foreach($all_prizes as $stock_prize)$remaining_stock+=$this->stock_count($stock_prize); $win_chance=max(0,min(100,($remaining_stock/$plays_left)*100)); }
   $win=(!$already_won && $total>0 && $win_chance>0 && wp_rand(1,100000)<= (int)round($win_chance*1000));
   $selected=null;
   if($win){ $pick=mt_rand(1,max(1,(int)round($total*1000))); $acc=0; foreach($eligible as $item){ $acc+=(int)round($item['weight']*1000); if($pick<=$acc){$selected=$item['prize'];break;} } if(!$selected && $eligible) $selected=$eligible[count($eligible)-1]['prize']; }
   $now=current_time('mysql'); $coupon_id=null; $coupon_code='';
   if($selected){ $coupon=$this->reserve_coupon($selected,(int)$lead->id); if($coupon){$coupon_id=(int)$coupon->id;$coupon_code=$coupon->code;} else {$selected=null;$win=false;} }
   $result=$selected?'win':'lose';
   $inserted=$this->db->insert($this->table('plays'),['campaign_id'=>$c->id,'lead_id'=>$lead->id,'game'=>$game,'result'=>$result,'prize_id'=>$selected?(int)$selected->id:null,'coupon_id'=>$coupon_id,'created_at'=>$now]);
   if(!$inserted) return $this->json_error('Não foi possível registrar a tentativa. Tente novamente.',500);
   $play_id=(int)$this->db->insert_id;
   $next=wp_date('c',current_time('timestamp')+max(1,(int)$c->cooldown_hours)*HOUR_IN_SECONDS);
   return new WP_REST_Response(['success'=>true,'result'=>$result,'message'=>$selected?($c->win_text?:'Parabéns! Você ganhou!'):($already_won?'Você já ganhou nesta modalidade nesta campanha. Desta vez não há novo prêmio.':($c->lose_text?:'Dessa vez não foi! Você poderá tentar novamente após o período de espera.')),'prize'=>$selected?$selected->name:null,'coupon'=>$coupon_code,'game'=>$game,'already_won'=>$already_won,'next_at'=>$next,'play_id'=>$play_id],200);
  } finally { $this->db->get_var($this->db->prepare('SELECT RELEASE_LOCK(%s)',$lock_name)); }
 }
 private function stock_count($pr){ if($pr->stock_mode==='shared') return max(0,(int)$pr->shared_limit-(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('coupons')} WHERE prize_id=%d AND status='assigned'",$pr->id))); return (int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('coupons')} WHERE prize_id=%d AND status='available'",$pr->id)); }
 private function reserve_coupon($pr,$lead_id){ $t=$this->table('coupons'); if($pr->stock_mode==='shared'){ $lock='msgstock_'.(int)$pr->id; $got=(int)$this->db->get_var($this->db->prepare('SELECT GET_LOCK(%s,5)',$lock)); if($got!==1)return null; try { $assigned=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM $t WHERE prize_id=%d AND status='assigned'",$pr->id)); if($assigned >= (int)$pr->shared_limit || !$pr->shared_code) return null; $ok=$this->db->insert($t,['prize_id'=>$pr->id,'code'=>$pr->shared_code,'status'=>'assigned','lead_id'=>$lead_id,'created_at'=>current_time('mysql'),'assigned_at'=>current_time('mysql')]); return $ok?(object)['id'=>(int)$this->db->insert_id,'code'=>$pr->shared_code]:null; } finally { $this->db->get_var($this->db->prepare('SELECT RELEASE_LOCK(%s)',$lock)); } }
 $row=$this->db->get_row($this->db->prepare("SELECT * FROM $t WHERE prize_id=%d AND status='available' ORDER BY id ASC LIMIT 1",$pr->id)); if(!$row) return null; $updated=$this->db->update($t,['status'=>'assigned','lead_id'=>$lead_id,'assigned_at'=>current_time('mysql')],['id'=>$row->id,'status'=>'available']); if(!$updated) return null; return $row; }

 /* ---------- Site: shortcode ---------- */
 private function closed_message($c){ $now=current_time('timestamp'); if($c->status==='active' && $c->start_at && strtotime($c->start_at)>$now) return ['title'=>'A campanha ainda vai começar','text'=>'Os jogos abrem em '.mysql2date('d/m/Y \à\s H:i',$c->start_at).'. Volte nesse horário para participar.']; if($c->status==='ended' || ($c->end_at && strtotime($c->end_at)<$now)) return ['title'=>'Campanha encerrada','text'=>'Obrigado a todos que participaram. Fique de olho nas próximas promoções.']; return ['title'=>'Campanha indisponível no momento','text'=>'Os jogos desta campanha estão fechados agora. Tente novamente mais tarde.']; }
 public function shortcode($atts){ $atts=shortcode_atts(['campanha'=>'','campaign'=>''],$atts,'mini_salgados'); $slug=sanitize_title($atts['campanha']?:$atts['campaign']); $c=$this->campaign($slug); if(!$c) return current_user_can('manage_options')?'<div class="msg-admin-hint" style="padding:16px 18px;border:2px dashed #E00025;border-radius:14px;background:#fff7f8;color:#7a0014;font:600 14px/1.5 sans-serif">Mini Salgados Games: a campanha <code>'.esc_html($slug?:'(vazio)').'</code> não foi encontrada. Confira o slug no shortcode. Só administradores veem este aviso.</div>':''; wp_enqueue_style('msg-games'); wp_enqueue_script('msg-games'); $body_font=$this->safe_font($c->font_family??'Montserrat'); $heading_font=$this->safe_font($c->heading_font_family??'Fredoka One','Fredoka One'); $this->enqueue_campaign_fonts($c->slug,$body_font,$heading_font); $primary=sanitize_hex_color($c->primary_color)?:'#E00025'; $secondary=sanitize_hex_color($c->secondary_color)?:'#FFCA09'; $cfg=['slug'=>$c->slug,'name'=>$c->name,'open'=>$this->campaign_open($c),'games'=>$this->enabled_games($c),'color'=>$primary,'secondary'=>$secondary,'logo'=>$c->logo_url,'intro'=>$c->intro_text,'api'=>esc_url_raw(rest_url('mini-salgados/v1/')),'nonce'=>wp_create_nonce('wp_rest'),'cooldown'=>max(1,(int)$c->cooldown_hours),'winChance'=>max(0,min(100,(float)($c->win_chance??25))),'fontFamily'=>$body_font,'headingFontFamily'=>$heading_font,'roletaLabels'=>array_pad(array_slice((array)json_decode($c->roleta_labels??'[]',true),0,8),8,'Prêmio')]; wp_add_inline_script('msg-games','window.MSGCampaigns=window.MSGCampaigns||{};window.MSGCampaigns['.wp_json_encode($c->slug).']='.wp_json_encode($cfg).';','before'); $style='--msg-primary:'.$primary.';--msg-secondary:'.$secondary.';--msg-on-primary:'.$this->on_color($primary).';--msg-on-secondary:'.$this->on_color($secondary).";--msg-body-font:'".$body_font."';--msg-heading-font:'".$heading_font."'"; ob_start(); ?>
 <div class="msg-app" data-campaign="<?php echo esc_attr($c->slug); ?>" data-view="register" style="<?php echo esc_attr($style); ?>">
  <div class="msg-awning" aria-hidden="true"><span></span></div>
  <header class="msg-heading">
   <?php if($c->logo_url): ?><img class="msg-logo" src="<?php echo esc_url($c->logo_url); ?>" alt="<?php echo esc_attr($c->name); ?>"><?php endif; ?>
   <h2><?php echo esc_html($c->name); ?></h2>
   <?php if($c->intro_text): ?><p><?php echo esc_html($c->intro_text); ?></p><?php endif; ?>
  </header>
  <?php if(!$this->campaign_open($c)): $closed=$this->closed_message($c); ?>
  <div class="msg-notice" role="status"><span class="msg-notice-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><strong><?php echo esc_html($closed['title']); ?></strong><p><?php echo esc_html($closed['text']); ?></p></div>
  <?php else: ?>
  <section class="msg-panel msg-register" aria-labelledby="msg-register-<?php echo esc_attr($c->slug); ?>">
   <div class="msg-panel-head"><h3 id="msg-register-<?php echo esc_attr($c->slug); ?>">Participe para jogar</h3><p>Preencha seus dados uma vez para liberar os jogos desta campanha.</p></div>
   <form class="msg-register-form">
    <label class="msg-field"><span class="msg-field-label">Seu nome</span><input name="name" required minlength="2" autocomplete="name" placeholder="Como podemos te chamar?"></label>
    <label class="msg-field"><span class="msg-field-label">WhatsApp</span><input name="phone" type="tel" inputmode="tel" required minlength="10" autocomplete="tel" placeholder="(00) 00000-0000"></label>
    <div class="msg-checks">
     <label class="msg-check"><input type="checkbox" name="privacy" required><span>Li e aceito o <a href="<?php echo esc_url(get_privacy_policy_url()?:'#'); ?>" target="_blank" rel="noopener">aviso de privacidade</a>.</span></label>
     <label class="msg-check"><input type="checkbox" name="marketing"><span>Quero receber novidades e ofertas da Mini Salgados. <em>(opcional)</em></span></label>
    </div>
    <button type="submit" class="msg-action">Continuar para os jogos</button>
    <p class="msg-feedback" aria-live="polite"></p>
   </form>
  </section>
  <section class="msg-panel msg-menu" hidden>
   <div class="msg-panel-head msg-menu-head"><h3>Escolha seu jogo</h3><p class="msg-returning"></p></div>
   <div class="msg-game-list"></div>
   <button type="button" class="msg-back" hidden><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>Voltar aos jogos</button>
   <div class="msg-play-area" hidden></div>
   <p class="msg-feedback" aria-live="polite"></p>
  </section>
  <?php endif; ?>
 </div><?php return ob_get_clean(); }

 /* ---------- Painel administrativo ---------- */
 private function admin_pages(){ return ['mini-salgados-games'=>'Campanhas','msg-prizes'=>'Prêmios e cupons','msg-leads'=>'Participantes','msg-reports'=>'Relatórios']; }
 public function menu(){ add_menu_page('Mini Salgados Games','Mini Salgados Games','manage_options','mini-salgados-games',[$this,'admin_page'],'dashicons-games',58); add_submenu_page('mini-salgados-games','Campanhas','Campanhas','manage_options','mini-salgados-games',[$this,'admin_page']); add_submenu_page('mini-salgados-games','Prêmios e cupons','Prêmios e cupons','manage_options','msg-prizes',[$this,'prizes_page']); add_submenu_page('mini-salgados-games','Participantes','Participantes','manage_options','msg-leads',[$this,'leads_page']); add_submenu_page('mini-salgados-games','Relatórios','Relatórios','manage_options','msg-reports',[$this,'reports_page']); }
 private function admin_guard(){ if(!current_user_can('manage_options')) wp_die('Você não tem permissão para acessar esta página.'); }
 private function current_admin_page(){ $page=sanitize_key(wp_unslash($_GET['page']??'')); return isset($this->admin_pages()[$page])?$page:''; }
 public function admin_body_class($classes){ return $this->current_admin_page()?$classes.' msg-admin-screen':$classes; }
 public function admin_assets($hook){ if(!$this->current_admin_page()) return; wp_enqueue_style('msg-admin-fonts','https://fonts.googleapis.com/css2?family=Fredoka+One&family=Montserrat:wght@400;500;600;700&display=swap',[],null); wp_enqueue_style('msg-admin',MSG_URL.'assets/admin.css',['msg-admin-fonts'],MSG_VERSION); if($this->current_admin_page()==='mini-salgados-games') wp_enqueue_media(); wp_enqueue_script('msg-admin',MSG_URL.'assets/admin.js',[],MSG_VERSION,true); }
 private function icon($name,$size=18){ $paths=[
  'roleta'=>'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/>',
  'raspadinha'=>'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M9 10l2 2 4-4"/>',
  'caixa'=>'<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M2.5 6.5h19V9h-19zM12 6.5V20M12 6.5C10 3 7 3.5 7.5 5.2 8 6.5 12 6.5 12 6.5zm0 0c2-3.5 5-3 4.5-1.3-.5 1.3-4.5 1.3-4.5 1.3z"/>',
  'copy'=>'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  'plus'=>'<path d="M12 5v14M5 12h14"/>',
  'edit'=>'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  'trash'=>'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  'download'=>'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  'sliders'=>'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  'calendar'=>'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  'users'=>'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.5 5.2"/>',
  'image'=>'<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-9 8.5"/>',
  'back'=>'<path d="M15 6l-6 6 6 6"/>',
  'ticket'=>'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 5v12" stroke-dasharray="2 2.5"/>',
 ]; return '<svg class="msg-icon" viewBox="0 0 24 24" width="'.(int)$size.'" height="'.(int)$size.'" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'.($paths[$name]??'').'</svg>'; }
 private function game_chip($game){ return '<span class="msg-chip msg-chip--'.esc_attr($game).'">'.$this->icon($game,15).esc_html($this->game_label($game)).'</span>'; }
 private function campaign_state($c){ $now=current_time('timestamp'); if($c->status==='active'){ if($c->start_at && strtotime($c->start_at)>$now) return ['scheduled','Agendada']; if($c->end_at && strtotime($c->end_at)<$now) return ['expired','Período encerrado']; return ['active','Ativa']; } return [$c->status,['draft'=>'Rascunho','paused'=>'Pausada','ended'=>'Encerrada'][$c->status]??$c->status]; }
 private function status_badge($c){ list($key,$label)=$this->campaign_state($c); return '<span class="msg-status msg-status--'.esc_attr($key).'"><i aria-hidden="true"></i>'.esc_html($label).'</span>'; }
 private function admin_header($title,$intro='',$actions=''){
  $this->ensure_schema(); $current=$this->current_admin_page();
  echo '<div class="wrap msg-admin-wrap"><header class="msg-admin-top"><div class="msg-admin-brand"><span class="msg-admin-mark" aria-hidden="true">MS</span><span class="msg-admin-brand-copy"><strong>Mini Salgados Games</strong><span>Central de campanhas promocionais</span></span><span class="msg-admin-version">v'.esc_html(MSG_VERSION).'</span></div><nav class="msg-admin-tabs" aria-label="Seções do Mini Salgados Games">';
  foreach($this->admin_pages() as $slug=>$label) echo '<a class="msg-admin-tab'.($slug===$current?' is-current':'').'" href="'.esc_url(admin_url('admin.php?page='.$slug)).'"'.($slug===$current?' aria-current="page"':'').'>'.esc_html($label).'</a>';
  echo '</nav></header><div class="msg-admin-title"><div><h1>'.esc_html($title).'</h1>'.($intro?'<p>'.esc_html($intro).'</p>':'').'</div>'.$actions.'</div><hr class="wp-header-end">';
  if(isset($_GET['msg'])){ $type=sanitize_key(wp_unslash($_GET['msg_type']??''))==='error'?'error':'success'; echo '<div class="notice notice-'.$type.' is-dismissible msg-notice"><p>'.esc_html(sanitize_text_field(wp_unslash($_GET['msg']))).'</p></div>'; }
 }
 private function admin_footer(){ echo '</div>'; }
 private function empty_state($title,$text,$button='',$icon='ticket'){ return '<div class="msg-empty"><span class="msg-empty-icon">'.$this->icon($icon,30).'</span><h2>'.esc_html($title).'</h2><p>'.esc_html($text).'</p>'.$button.'</div>'; }
 private function campaign_defaults(){ return (object)['id'=>0,'name'=>'','slug'=>'','status'=>'draft','start_at'=>null,'end_at'=>null,'games'=>wp_json_encode(['roleta','raspadinha','caixa']),'cooldown_hours'=>24,'win_chance'=>25,'chance_mode'=>'automatic','campaign_goal'=>0,'expected_plays'=>1000,'roleta_labels'=>wp_json_encode(['Prêmio 1','Prêmio 2','Prêmio 3','Prêmio 4','Prêmio 5','Prêmio 6','Prêmio 7','Prêmio 8']),'primary_color'=>'#E00025','secondary_color'=>'#FFCA09','logo_url'=>'','intro_text'=>'','win_text'=>'Parabéns! Você ganhou!','lose_text'=>'Dessa vez não foi! Tente novamente depois.','font_family'=>'Montserrat','heading_font_family'=>'Fredoka One']; }
 private function local_input_date($value){ return $value?mysql2date('Y-m-d\TH:i',$value):''; }

 public function admin_page(){ $this->admin_guard(); $edit=absint($_GET['edit']??0); $view=sanitize_key(wp_unslash($_GET['view']??''));
  if($edit){ $c=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('campaigns')} WHERE id=%d",$edit)); if(!$c) wp_die('Campanha não encontrada.'); $this->admin_header('Editar campanha','Altere regras, visual e mensagens. O slug continua o mesmo para não quebrar o shortcode já publicado.','<a class="msg-btn msg-btn--ghost" href="'.esc_url(admin_url('admin.php?page=mini-salgados-games')).'">'.$this->icon('back').'Voltar às campanhas</a>'); $this->campaign_form($c,true); $this->admin_footer(); return; }
  if($view==='new'){ $this->admin_header('Nova campanha','Defina regras, jogos e identidade visual. Você pode alterar tudo depois em Editar.','<a class="msg-btn msg-btn--ghost" href="'.esc_url(admin_url('admin.php?page=mini-salgados-games')).'">'.$this->icon('back').'Voltar às campanhas</a>'); $this->campaign_form($this->campaign_defaults(),false); $this->admin_footer(); return; }
  $new_button='<a class="msg-btn msg-btn--primary" href="'.esc_url(admin_url('admin.php?page=mini-salgados-games&view=new')).'">'.$this->icon('plus').'Nova campanha</a>';
  $this->admin_header('Campanhas','Crie campanhas, copie o shortcode e ajuste as regras de cada promoção.',$new_button);
  $campaigns=$this->db->get_results("SELECT * FROM {$this->table('campaigns')} ORDER BY id DESC");
  if(!$campaigns){ echo $this->empty_state('Nenhuma campanha ainda','Crie a primeira campanha para gerar o shortcode e começar a cadastrar prêmios.',$new_button,'roleta'); $this->admin_footer(); return; }
  echo '<div class="msg-campaign-grid">';
  foreach($campaigns as $c){
   $plays=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('plays')} WHERE campaign_id=%d",$c->id));
   $leads=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('leads')} WHERE campaign_id=%d",$c->id));
   $shortcode='[mini_salgados campanha="'.$c->slug.'"]';
   $period=($c->start_at||$c->end_at)?($c->start_at?mysql2date('d/m/Y H:i',$c->start_at):'Sem início').' → '.($c->end_at?mysql2date('d/m/Y H:i',$c->end_at):'sem fim'):'Sem período definido';
   $mode=['automatic'=>'Automático','manual'=>'Manual','goal'=>'Meta de cupons'][$c->chance_mode??'automatic']??'Automático';
   ?>
   <article class="msg-campaign">
    <header class="msg-campaign-head">
     <?php echo $this->status_badge($c); ?>
     <span class="msg-swatches" title="Cores da campanha"><i style="background:<?php echo esc_attr($c->primary_color); ?>"></i><i style="background:<?php echo esc_attr($c->secondary_color); ?>"></i></span>
    </header>
    <h2 class="msg-campaign-name"><?php echo esc_html($c->name); ?></h2>
    <div class="msg-chips"><?php foreach($this->enabled_games($c) as $g) echo $this->game_chip($g); ?></div>
    <dl class="msg-campaign-stats">
     <div><dt>Participantes</dt><dd><?php echo number_format_i18n($leads); ?></dd></div>
     <div><dt>Jogadas</dt><dd><?php echo number_format_i18n($plays); ?></dd></div>
     <div><dt>Intervalo</dt><dd><?php echo (int)$c->cooldown_hours; ?>h</dd></div>
    </dl>
    <p class="msg-campaign-meta"><?php echo $this->icon('calendar',15).esc_html($period); ?></p>
    <p class="msg-campaign-meta"><?php echo $this->icon('sliders',15).esc_html('Probabilidade: '.$mode.($c->chance_mode==='manual'?' · '.rtrim(rtrim(number_format((float)$c->win_chance,2,',',''),'0'),',').'%':'')); ?></p>
    <div class="msg-shortcode"><code><?php echo esc_html($shortcode); ?></code><button type="button" class="msg-btn msg-btn--small" data-msg-copy="<?php echo esc_attr($shortcode); ?>"><?php echo $this->icon('copy',15); ?><span>Copiar</span></button></div>
    <details class="msg-quick">
     <summary><?php echo $this->icon('sliders',16); ?>Ajustes rápidos</summary>
     <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="msg-quick-form">
      <?php wp_nonce_field('msg_update_campaign_'.$c->id); ?><input type="hidden" name="action" value="msg_update_campaign"><input type="hidden" name="id" value="<?php echo (int)$c->id; ?>"><input type="hidden" name="scope" value="quick">
      <label class="msg-field"><span>Status</span><select name="status"><?php foreach(['draft'=>'Rascunho','active'=>'Ativa','paused'=>'Pausada','ended'=>'Encerrada'] as $k=>$v) echo '<option value="'.$k.'" '.selected($c->status,$k,false).'>'.$v.'</option>'; ?></select></label>
      <label class="msg-field"><span>Modo de probabilidade</span><select name="chance_mode"><?php foreach(['automatic'=>'Automático','manual'=>'Manual','goal'=>'Meta de cupons'] as $k=>$v) echo '<option value="'.$k.'" '.selected($c->chance_mode??'automatic',$k,false).'>'.$v.'</option>'; ?></select></label>
      <label class="msg-field"><span>Chance manual (%)</span><input type="number" name="win_chance" min="0" max="100" step="0.1" value="<?php echo esc_attr($c->win_chance??25); ?>"></label>
      <label class="msg-field"><span>Intervalo (horas)</span><input type="number" name="cooldown" min="1" max="720" value="<?php echo (int)$c->cooldown_hours; ?>"></label>
      <label class="msg-field"><span>Participações esperadas</span><input type="number" name="expected_plays" min="1" value="<?php echo (int)($c->expected_plays??1000); ?>"></label>
      <label class="msg-field"><span>Meta de cupons</span><input type="number" name="campaign_goal" min="0" value="<?php echo (int)($c->campaign_goal??0); ?>"></label>
      <button class="msg-btn msg-btn--primary">Salvar ajustes</button>
     </form>
    </details>
    <footer class="msg-campaign-foot">
     <a class="msg-btn" href="<?php echo esc_url(admin_url('admin.php?page=mini-salgados-games&edit='.(int)$c->id)); ?>"><?php echo $this->icon('edit',16); ?>Editar campanha</a>
     <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" data-msg-confirm="Excluir a campanha “<?php echo esc_attr($c->name); ?>”? Prêmios, cupons, participantes e jogadas dela também serão apagados. Essa ação não pode ser desfeita."><?php wp_nonce_field('msg_delete_campaign_'.$c->id); ?><input type="hidden" name="action" value="msg_delete_campaign"><input type="hidden" name="id" value="<?php echo (int)$c->id; ?>"><button class="msg-btn msg-btn--danger-ghost"><?php echo $this->icon('trash',16); ?>Excluir</button></form>
    </footer>
   </article>
   <?php
  }
  echo '</div><p class="msg-footnote"><strong>Como publicar:</strong> cole o shortcode em um bloco Shortcode do WordPress ou no widget Shortcode do Elementor. O resultado de cada jogada é sempre decidido no servidor.</p>';
  $this->admin_footer();
 }

 private function campaign_form($c,$is_edit){
  $games=$this->enabled_games($c); $labels=array_pad(array_slice((array)json_decode($c->roleta_labels??'[]',true),0,8),8,'Prêmio'); $mode=$c->chance_mode??'automatic';
  $game_info=['roleta'=>'8 espaços giram e param no ponteiro.','raspadinha'=>'A pessoa raspa o cartão com o dedo ou o mouse.','caixa'=>'4 toques abrem a tampa do presente.'];
  $mode_info=['automatic'=>['Automático','Divide o estoque restante pelas participações esperadas.'],'manual'=>['Manual','Usa a porcentagem fixa que você definir.'],'goal'=>['Meta de cupons','Ajusta a chance para tentar atingir a meta.']];
  ?>
  <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="msg-campaign-form" data-msg-campaign-form>
   <?php if($is_edit){ wp_nonce_field('msg_update_campaign_'.$c->id); echo '<input type="hidden" name="action" value="msg_update_campaign"><input type="hidden" name="id" value="'.(int)$c->id.'"><input type="hidden" name="scope" value="full">'; } else { wp_nonce_field('msg_save_campaign'); echo '<input type="hidden" name="action" value="msg_save_campaign">'; } ?>
   <div class="msg-form-layout">
    <div class="msg-form-main">
     <section class="msg-card msg-section">
      <header class="msg-section-head"><h2>Identificação</h2><p>Nome, endereço do shortcode e quando a campanha fica aberta.</p></header>
      <div class="msg-grid msg-grid--2">
       <label class="msg-field msg-span-2"><span>Nome da campanha</span><input name="name" required value="<?php echo esc_attr($c->name); ?>" placeholder="Ex.: Festival de Salgados de Natal" data-msg-preview="name"></label>
       <?php if($is_edit): ?>
       <div class="msg-field"><span>Slug</span><code class="msg-readonly"><?php echo esc_html($c->slug); ?></code><small>Fixo depois de criado, para não quebrar o shortcode publicado.</small></div>
       <?php else: ?>
       <label class="msg-field"><span>Slug <em>(opcional)</em></span><input name="slug" placeholder="promocao-de-natal" pattern="[a-z0-9\-]*"><small>Aparece no shortcode. Vazio = gerado a partir do nome.</small></label>
       <?php endif; ?>
       <label class="msg-field"><span>Status</span><select name="status"><?php foreach(['draft'=>'Rascunho','active'=>'Ativa','paused'=>'Pausada','ended'=>'Encerrada'] as $k=>$v) echo '<option value="'.$k.'" '.selected($c->status,$k,false).'>'.$v.'</option>'; ?></select><small>Só campanhas ativas e dentro do período recebem jogadas.</small></label>
       <label class="msg-field"><span>Início <em>(opcional)</em></span><input type="datetime-local" name="start_at" value="<?php echo esc_attr($this->local_input_date($c->start_at)); ?>"></label>
       <label class="msg-field"><span>Fim <em>(opcional)</em></span><input type="datetime-local" name="end_at" value="<?php echo esc_attr($this->local_input_date($c->end_at)); ?>"><small>Usa o fuso horário do WordPress.</small></label>
      </div>
     </section>

     <section class="msg-card msg-section">
      <header class="msg-section-head"><h2>Jogos e regras</h2><p>Quais jogos aparecem e como a chance de ganhar é calculada.</p></header>
      <fieldset class="msg-fieldset"><legend>Jogos habilitados</legend>
       <div class="msg-option-grid">
        <?php foreach(['roleta','raspadinha','caixa'] as $g): ?>
        <label class="msg-option"><input type="checkbox" name="games[]" value="<?php echo $g; ?>" <?php checked(in_array($g,$games,true)); ?>><span class="msg-option-body"><span class="msg-option-icon"><?php echo $this->icon($g,22); ?></span><strong><?php echo esc_html($this->game_label($g)); ?></strong><small><?php echo esc_html($game_info[$g]); ?></small></span></label>
        <?php endforeach; ?>
       </div>
       <small class="msg-hint">Se nenhum for marcado, a roleta é habilitada automaticamente.</small>
      </fieldset>
      <fieldset class="msg-fieldset"><legend>Modo de probabilidade</legend>
       <div class="msg-option-grid">
        <?php foreach($mode_info as $k=>$info): ?>
        <label class="msg-option msg-option--radio"><input type="radio" name="chance_mode" value="<?php echo $k; ?>" <?php checked($mode,$k); ?>><span class="msg-option-body"><strong><?php echo esc_html($info[0]); ?></strong><small><?php echo esc_html($info[1]); ?></small></span></label>
        <?php endforeach; ?>
       </div>
      </fieldset>
      <div class="msg-grid msg-grid--2">
       <label class="msg-field" data-msg-show-when="chance_mode=manual"><span>Chance manual de ganhar</span><span class="msg-input-unit"><input type="number" min="0" max="100" step="0.1" name="win_chance" value="<?php echo esc_attr($c->win_chance); ?>"><b>%</b></span><small>Por tentativa elegível, quando há prêmio com estoque.</small></label>
       <label class="msg-field" data-msg-show-when="chance_mode=automatic,goal"><span>Participações esperadas</span><input type="number" min="1" name="expected_plays" value="<?php echo (int)$c->expected_plays; ?>"><small>Estimativa total de jogadas usada no cálculo.</small></label>
       <label class="msg-field"><span>Meta de cupons <em>(opcional)</em></span><input type="number" min="0" name="campaign_goal" value="<?php echo (int)$c->campaign_goal; ?>"><small>Referência para relatórios e para o modo Meta. 0 = sem meta.</small></label>
       <label class="msg-field"><span>Intervalo entre jogadas</span><span class="msg-input-unit"><input type="number" min="1" max="720" name="cooldown" value="<?php echo (int)$c->cooldown_hours; ?>"><b>horas</b></span><small>Contado separadamente para cada jogo.</small></label>
      </div>
     </section>

     <section class="msg-card msg-section">
      <header class="msg-section-head"><h2>Textos da roleta</h2><p>Os 8 espaços são decorativos: o prêmio real vem do sorteio e do estoque cadastrado.</p></header>
      <div class="msg-wheel-labels">
       <?php foreach($labels as $i=>$label): ?>
       <label class="msg-field msg-wheel-label"><span><i class="msg-slot msg-slot--<?php echo $i%4; ?>" aria-hidden="true"><?php echo $i+1; ?></i>Espaço <?php echo $i+1; ?></span><input name="roleta_labels[]" maxlength="24" value="<?php echo esc_attr($label); ?>"></label>
       <?php endforeach; ?>
      </div>
     </section>

     <section class="msg-card msg-section">
      <header class="msg-section-head"><h2>Identidade visual</h2><p>Cores, fontes e logo usados nos jogos desta campanha.</p></header>
      <div class="msg-grid msg-grid--2">
       <div class="msg-field"><span>Cor principal</span><span class="msg-color"><input type="color" name="primary_color" value="<?php echo esc_attr($c->primary_color); ?>" data-msg-color><input type="text" value="<?php echo esc_attr(strtoupper($c->primary_color)); ?>" maxlength="7" aria-label="Código da cor principal" data-msg-color-text></span><small>Botões, toldo e destaques.</small></div>
       <div class="msg-field"><span>Cor secundária</span><span class="msg-color"><input type="color" name="secondary_color" value="<?php echo esc_attr($c->secondary_color); ?>" data-msg-color><input type="text" value="<?php echo esc_attr(strtoupper($c->secondary_color)); ?>" maxlength="7" aria-label="Código da cor secundária" data-msg-color-text></span><small>Cupom, laços e detalhes.</small></div>
       <label class="msg-field"><span>Fonte dos títulos</span><?php echo $this->font_select_html('heading_font_family',$c->heading_font_family); ?></label>
       <label class="msg-field"><span>Fonte dos textos</span><?php echo $this->font_select_html('font_family',$c->font_family); ?></label>
       <div class="msg-field msg-span-2"><span>Logo</span><span class="msg-logo-picker"><span class="msg-logo-thumb" data-msg-logo-thumb><?php if($c->logo_url) echo '<img src="'.esc_url($c->logo_url).'" alt="">'; else echo $this->icon('image',22); ?></span><input type="url" name="logo_url" value="<?php echo esc_attr($c->logo_url); ?>" placeholder="https://…/logo.png" data-msg-logo><button type="button" class="msg-btn" data-msg-media><?php echo $this->icon('image',16); ?>Biblioteca de mídia</button></span><small>PNG ou SVG com fundo transparente fica melhor.</small></div>
      </div>
     </section>

     <section class="msg-card msg-section">
      <header class="msg-section-head"><h2>Mensagens</h2><p>Textos mostrados para quem participa.</p></header>
      <div class="msg-grid">
       <label class="msg-field"><span>Texto de abertura</span><textarea name="intro_text" rows="3" placeholder="Ex.: Jogue, ganhe e retire seu prêmio na loja." data-msg-preview="intro"><?php echo esc_textarea($c->intro_text); ?></textarea></label>
       <label class="msg-field"><span>Mensagem de vitória</span><input name="win_text" value="<?php echo esc_attr($c->win_text); ?>"></label>
       <label class="msg-field"><span>Mensagem de derrota</span><input name="lose_text" value="<?php echo esc_attr($c->lose_text); ?>"></label>
      </div>
     </section>
    </div>

    <aside class="msg-form-aside">
     <div class="msg-card msg-preview-card">
      <p class="msg-overline">Prévia</p>
      <div class="msg-preview" data-msg-preview-root>
       <div class="msg-preview-awning"></div>
       <div class="msg-preview-body">
        <img class="msg-preview-logo" alt="" data-msg-preview-logo <?php echo $c->logo_url?'src="'.esc_url($c->logo_url).'"':'hidden'; ?>>
        <strong class="msg-preview-title" data-msg-preview-out="name"><?php echo esc_html($c->name?:'Nome da campanha'); ?></strong>
        <span class="msg-preview-intro" data-msg-preview-out="intro"><?php echo esc_html($c->intro_text?:'Seu texto de abertura aparece aqui.'); ?></span>
        <span class="msg-preview-wheel" aria-hidden="true"></span>
        <span class="msg-preview-button">Continuar para os jogos</span>
        <span class="msg-preview-ticket">SEU CUPOM · MS-0001</span>
       </div>
      </div>
      <p class="msg-hint">A prévia usa as cores e fontes escolhidas. No site, o visual se adapta ao celular.</p>
     </div>
     <div class="msg-form-actions">
      <button type="submit" class="msg-btn msg-btn--primary msg-btn--block"><?php echo $is_edit?'Salvar alterações':'Criar campanha'; ?></button>
      <a class="msg-btn msg-btn--ghost msg-btn--block" href="<?php echo esc_url(admin_url('admin.php?page=mini-salgados-games')); ?>">Cancelar</a>
     </div>
    </aside>
   </div>
  </form>
  <?php
 }
 private function campaign_input(){ $to_date=function($key){$v=sanitize_text_field(wp_unslash($_POST[$key]??''));return $v?get_date_from_gmt(gmdate('Y-m-d H:i:s',strtotime($v)-get_option('gmt_offset')*HOUR_IN_SECONDS)) : null;}; $games=array_values(array_intersect(['roleta','raspadinha','caixa'],array_map('sanitize_key',(array)($_POST['games']??[])))); if(!$games)$games=['roleta']; return ['status'=>in_array($_POST['status']??'draft',['draft','active','paused','ended'],true)?sanitize_key($_POST['status']):'draft','start_at'=>$to_date('start_at'),'end_at'=>$to_date('end_at'),'games'=>wp_json_encode($games),'cooldown_hours'=>max(1,min(720,absint($_POST['cooldown']??24))),'win_chance'=>max(0,min(100,(float)($_POST['win_chance']??25))),'chance_mode'=>in_array($_POST['chance_mode']??'automatic',['automatic','manual','goal'],true)?sanitize_key($_POST['chance_mode']):'automatic','campaign_goal'=>max(0,absint($_POST['campaign_goal']??0)),'expected_plays'=>max(1,absint($_POST['expected_plays']??1000)),'roleta_labels'=>wp_json_encode(array_slice(array_map(function($v){return sanitize_text_field(wp_unslash($v));},(array)($_POST['roleta_labels']??[])),0,8)),'primary_color'=>sanitize_hex_color($_POST['primary_color']??'#E00025')?:'#E00025','secondary_color'=>sanitize_hex_color($_POST['secondary_color']??'#FFCA09')?:'#FFCA09','font_family'=>$this->safe_font(sanitize_text_field(wp_unslash($_POST['font_family']??'Montserrat'))),'heading_font_family'=>$this->safe_font(sanitize_text_field(wp_unslash($_POST['heading_font_family']??'Fredoka One')),'Fredoka One'),'logo_url'=>esc_url_raw(wp_unslash($_POST['logo_url']??'')),'intro_text'=>sanitize_textarea_field(wp_unslash($_POST['intro_text']??'')),'win_text'=>sanitize_text_field(wp_unslash($_POST['win_text']??'')),'lose_text'=>sanitize_text_field(wp_unslash($_POST['lose_text']??''))]; }
 public function save_campaign(){ $this->admin_guard(); check_admin_referer('msg_save_campaign'); $this->ensure_schema(); $name=sanitize_text_field(wp_unslash($_POST['name']??'')); if(!$name) wp_die('Informe o nome.'); $slug=sanitize_title(wp_unslash($_POST['slug']??'')); if(!$slug)$slug=sanitize_title($name); $base=$slug;$i=2;while($this->campaign($slug)){$slug=$base.'-'.$i++;} $ok=$this->db->insert($this->table('campaigns'),array_merge(['name'=>$name,'slug'=>$slug],$this->campaign_input(),['created_at'=>current_time('mysql')])); if(!$ok) $this->fail_redirect('A campanha não foi salva.','mini-salgados-games'); $id=(int)$this->db->insert_id; $this->audit($id,'Campanha criada',['slug'=>$slug]); wp_safe_redirect(add_query_arg('msg',rawurlencode('Campanha criada. Shortcode: [mini_salgados campanha="'.$slug.'"]'),admin_url('admin.php?page=mini-salgados-games')));exit; }
 public function update_campaign(){ $this->admin_guard(); $id=absint($_POST['id']??0); check_admin_referer('msg_update_campaign_'.$id); $this->ensure_schema(); $c=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('campaigns')} WHERE id=%d",$id)); if(!$c) wp_die('Campanha não encontrada.');
  if(($_POST['scope']??'')==='full'){ $name=sanitize_text_field(wp_unslash($_POST['name']??'')); if(!$name) wp_die('Informe o nome.'); $data=array_merge(['name'=>$name],$this->campaign_input()); }
  else { $data=['status'=>in_array($_POST['status']??'draft',['draft','active','paused','ended'],true)?sanitize_key($_POST['status']):'draft','win_chance'=>max(0,min(100,(float)($_POST['win_chance']??25))),'chance_mode'=>in_array($_POST['chance_mode']??'automatic',['automatic','manual','goal'],true)?sanitize_key($_POST['chance_mode']):'automatic','expected_plays'=>max(1,absint($_POST['expected_plays']??1000)),'cooldown_hours'=>max(1,min(720,absint($_POST['cooldown']??24))),'campaign_goal'=>isset($_POST['campaign_goal'])?max(0,absint($_POST['campaign_goal'])):(int)($c->campaign_goal??0)]; }
  $before=[]; foreach(array_keys($data) as $key) $before[$key]=$c->$key??null;
  if($this->db->update($this->table('campaigns'),$data,['id'=>$id])===false) $this->fail_redirect('As alterações não foram salvas.','mini-salgados-games'); $this->audit($id,'Configurações da campanha alteradas',['before'=>$before,'after'=>$data]); wp_safe_redirect(add_query_arg('msg',rawurlencode('Campanha “'.($data['name']??$c->name).'” atualizada.'),admin_url('admin.php?page=mini-salgados-games'))); exit; }
 public function delete_campaign(){ $this->admin_guard(); $id=absint($_POST['id']??0); check_admin_referer('msg_delete_campaign_'.$id); foreach(['plays','leads','coupons','prizes'] as $tbl){ if($tbl==='coupons') $this->db->query($this->db->prepare("DELETE FROM {$this->table('coupons')} WHERE prize_id IN (SELECT id FROM {$this->table('prizes')} WHERE campaign_id=%d)",$id)); elseif($tbl==='plays'||$tbl==='leads'||$tbl==='prizes') $this->db->delete($this->table($tbl),['campaign_id'=>$id]); } $this->db->delete($this->table('campaigns'),['id'=>$id]); wp_safe_redirect(add_query_arg('msg','Campanha excluída.',admin_url('admin.php?page=mini-salgados-games')));exit; }

 public function prizes_page(){ $this->admin_guard(); $this->admin_header('Prêmios e cupons','Cadastre prêmios por jogo e mantenha o estoque de códigos abastecido.'); $cs=$this->db->get_results("SELECT * FROM {$this->table('campaigns')} ORDER BY name"); $ps=$this->db->get_results("SELECT p.*,c.name campaign_name FROM {$this->table('prizes')} p LEFT JOIN {$this->table('campaigns')} c ON c.id=p.campaign_id ORDER BY p.id DESC");
  if(!$cs){ echo $this->empty_state('Crie uma campanha primeiro','Os prêmios ficam vinculados a uma campanha e a um jogo dela.','<a class="msg-btn msg-btn--primary" href="'.esc_url(admin_url('admin.php?page=mini-salgados-games&view=new')).'">'.$this->icon('plus').'Nova campanha</a>','ticket'); $this->admin_footer(); return; }
  ?>
  <div class="msg-split">
   <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" class="msg-card msg-section msg-prize-form" data-msg-prize-form>
    <?php wp_nonce_field('msg_save_prize'); ?><input type="hidden" name="action" value="msg_save_prize">
    <header class="msg-section-head"><h2>Novo prêmio</h2><p>Cada prêmio pertence a um jogo. Para o mesmo prêmio em dois jogos, cadastre duas vezes.</p></header>
    <div class="msg-grid">
     <label class="msg-field"><span>Campanha</span><select name="campaign_id" required data-msg-prize-campaign><?php foreach($cs as $c) echo '<option value="'.(int)$c->id.'" data-games="'.esc_attr(implode(',',$this->enabled_games($c))).'">'.esc_html($c->name).'</option>'; ?></select></label>
     <fieldset class="msg-fieldset"><legend>Jogo</legend><div class="msg-segment"><?php foreach(['roleta','raspadinha','caixa'] as $i=>$g) echo '<label><input type="radio" name="game" value="'.$g.'" '.checked($i,0,false).'><span>'.$this->icon($g,16).esc_html(['roleta'=>'Roleta','raspadinha'=>'Raspadinha','caixa'=>'Caixa'][$g]).'</span></label>'; ?></div><small class="msg-hint" data-msg-game-hint hidden>Jogos desligados nesta campanha aparecem desabilitados.</small></fieldset>
     <label class="msg-field"><span>Nome do prêmio</span><input name="name" required placeholder="Ex.: 10 mini salgados"></label>
     <label class="msg-field"><span>Peso relativo</span><input type="number" name="weight" min="0.001" step="0.001" value="1"><small>Multiplicado pelo estoque restante para escolher entre os prêmios do jogo. Não é uma porcentagem.</small></label>
     <fieldset class="msg-fieldset"><legend>Tipo de cupom</legend><div class="msg-segment"><label><input type="radio" name="stock_mode" value="unique" checked><span>Códigos únicos</span></label><label><input type="radio" name="stock_mode" value="shared"><span>Código compartilhado</span></label></div></fieldset>
     <label class="msg-field" data-msg-show-when="stock_mode=shared"><span>Código compartilhado</span><input name="shared_code" placeholder="Ex.: SALGADOS10"></label>
     <label class="msg-field" data-msg-show-when="stock_mode=shared"><span>Limite de resgates</span><input type="number" name="shared_limit" min="1" value="10"></label>
     <p class="msg-hint" data-msg-show-when="stock_mode=unique">Depois de salvar, adicione os códigos na lista ao lado, um por linha.</p>
    </div>
    <button class="msg-btn msg-btn--primary msg-btn--block">Salvar prêmio</button>
   </form>
   <section class="msg-card msg-table-card">
    <header class="msg-table-head"><h2>Prêmios e estoque</h2><span class="msg-count"><?php echo count($ps).' '.(count($ps)===1?'prêmio':'prêmios'); ?></span></header>
    <?php if(!$ps): echo $this->empty_state('Nenhum prêmio cadastrado','Use o formulário para criar o primeiro prêmio de uma campanha.','', 'ticket'); else: ?>
    <div class="msg-table-scroll"><table class="msg-table">
     <thead><tr><th>Prêmio</th><th>Jogo</th><th>Cupom</th><th class="msg-num">Estoque</th><th>Repor</th></tr></thead><tbody>
     <?php foreach($ps as $p){ $stock=$this->stock_count($p); $level=$stock<=0?'out':($stock<=5?'low':'ok'); ?>
      <tr>
       <td><strong><?php echo esc_html($p->name); ?></strong><small><?php echo esc_html($p->campaign_name?:'Campanha removida'); ?> · peso <?php echo esc_html(rtrim(rtrim(number_format((float)$p->weight,3,',',''),'0'),',')); ?></small></td>
       <td><?php echo $this->game_chip($p->game); ?></td>
       <td><?php if($p->stock_mode==='shared') echo '<span class="msg-muted">Compartilhado</span><br><code>'.esc_html($p->shared_code).'</code> <small class="msg-muted">limite '.(int)$p->shared_limit.'</small>'; else echo '<span class="msg-muted">Códigos únicos</span>'; ?></td>
       <td class="msg-num"><span class="msg-stock msg-stock--<?php echo $level; ?>"><?php echo $stock<=0?'Esgotado':number_format_i18n($stock); ?></span></td>
       <td><?php if($p->stock_mode==='unique'): ?>
        <details class="msg-restock"><summary><?php echo $this->icon('plus',15); ?>Adicionar códigos</summary>
         <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>"><?php wp_nonce_field('msg_add_coupons_'.$p->id); ?><input type="hidden" name="action" value="msg_add_coupons"><input type="hidden" name="prize_id" value="<?php echo (int)$p->id; ?>"><textarea name="codes" rows="4" placeholder="MS-0001&#10;MS-0002&#10;MS-0003" required></textarea><small class="msg-hint">Um código por linha.</small><button class="msg-btn msg-btn--primary msg-btn--small">Adicionar ao estoque</button></form>
        </details>
       <?php else: ?><span class="msg-muted">Limite definido no cadastro</span><?php endif; ?></td>
      </tr>
     <?php } ?>
     </tbody></table></div>
    <?php endif; ?>
   </section>
  </div>
  <?php $this->admin_footer(); }

 public function leads_page(){
  $this->admin_guard();
  $export='<a class="msg-btn msg-btn--primary" href="'.esc_url(wp_nonce_url(admin_url('admin-post.php?action=msg_export_leads'),'msg_export_leads')).'">'.$this->icon('download').'Exportar CSV</a>';
  $this->admin_header('Participantes','Pessoas cadastradas nas campanhas. A exportação CSV inclui todos os registros.',$export);
  $leads=$this->db->get_results("SELECT l.*,c.name campaign_name,(SELECT COUNT(*) FROM {$this->table('plays')} x WHERE x.lead_id=l.id) plays_count FROM {$this->table('leads')} l LEFT JOIN {$this->table('campaigns')} c ON c.id=l.campaign_id ORDER BY l.id DESC LIMIT 1000");
  if(!$leads){ echo $this->empty_state('Nenhum participante ainda','Quando alguém se cadastrar em uma campanha, ele aparece aqui.','','users'); $this->admin_footer(); return; }
  echo '<form id="msg-delete-leads-form" method="post" action="'.esc_url(admin_url('admin-post.php')).'" class="msg-card msg-table-card">'; wp_nonce_field('msg_delete_leads');
  echo '<input type="hidden" name="action" value="msg_delete_leads"><div class="msg-bulk-bar"><label class="msg-check"><input type="checkbox" id="msg-select-all-leads"> Selecionar todos</label><span id="msg-selected-count" aria-live="polite">Nenhum selecionado</span><button type="submit" class="msg-btn msg-btn--danger" id="msg-delete-selected" disabled>'.$this->icon('trash',16).'Apagar selecionados</button></div>';
  echo '<p class="msg-bulk-note">Apagar remove também as jogadas da pessoa e devolve cupons únicos ao estoque. Exibindo os '.number_format_i18n(count($leads)).' cadastros mais recentes.</p>';
  echo '<div class="msg-table-scroll"><table class="msg-table msg-leads-table"><thead><tr><th class="msg-check-column"><span class="screen-reader-text">Selecionar</span></th><th>Participante</th><th>Campanha</th><th>Cadastro</th><th class="msg-num">Jogadas</th><th>Marketing</th></tr></thead><tbody>';
  foreach($leads as $l){ $initial=mb_strtoupper(mb_substr(trim($l->name),0,1)); echo '<tr><td class="msg-check-column"><input class="msg-lead-check" type="checkbox" name="lead_ids[]" value="'.(int)$l->id.'" aria-label="Selecionar '.esc_attr($l->name).'"></td><td><span class="msg-person"><span class="msg-avatar" aria-hidden="true">'.esc_html($initial).'</span><span><strong>'.esc_html($l->name).'</strong><small>'.esc_html($l->phone).'</small></span></span></td><td>'.esc_html($l->campaign_name?:'Campanha removida').'</td><td>'.esc_html(mysql2date('d/m/Y H:i',$l->created_at)).'</td><td class="msg-num"><span class="msg-count-pill">'.(int)$l->plays_count.'</span></td><td>'.($l->marketing_consent?'<span class="msg-yes">Sim</span>':'<span class="msg-muted">Não</span>').'</td></tr>'; }
  echo '</tbody></table></div></form>';
  $this->admin_footer();
 }
 public function delete_leads(){
  $this->admin_guard(); check_admin_referer('msg_delete_leads'); $ids=array_values(array_unique(array_filter(array_map('absint',(array)($_POST['lead_ids']??[]))))); if(!$ids){wp_safe_redirect(add_query_arg(['msg'=>rawurlencode('Selecione ao menos um participante.'),'msg_type'=>'error'],admin_url('admin.php?page=msg-leads')));exit;}
  $deleted=0;
  foreach(array_slice($ids,0,1000) as $lead_id){
   $lead=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('leads')} WHERE id=%d",$lead_id)); if(!$lead)continue;
   $assigned=$this->db->get_results($this->db->prepare("SELECT co.id,co.prize_id,pr.stock_mode FROM {$this->table('coupons')} co INNER JOIN {$this->table('prizes')} pr ON pr.id=co.prize_id WHERE co.lead_id=%d AND co.status='assigned'",$lead_id));
   foreach($assigned as $coupon){ if($coupon->stock_mode==='unique') $this->db->update($this->table('coupons'),['status'=>'available','lead_id'=>null,'assigned_at'=>null],['id'=>(int)$coupon->id]); else $this->db->delete($this->table('coupons'),['id'=>(int)$coupon->id]); }
   $this->db->delete($this->table('plays'),['lead_id'=>$lead_id]); $this->db->delete($this->table('leads'),['id'=>$lead_id]); $this->audit((int)$lead->campaign_id,'Lead e participações excluídos',['lead_id'=>$lead_id]); $deleted++;
  }
  wp_safe_redirect(add_query_arg('msg',rawurlencode($deleted.' participante(s) removido(s). Cupons únicos voltaram ao estoque.'),admin_url('admin.php?page=msg-leads')));exit;
 }

 public function reports_page(){ $this->admin_guard(); $this->admin_header('Relatórios','Desempenho acumulado de cada campanha.'); $campaigns=$this->db->get_results("SELECT * FROM {$this->table('campaigns')} ORDER BY id DESC");
  if(!$campaigns){ echo $this->empty_state('Ainda não há dados','Os números aparecem assim que a primeira campanha receber participações.','','sliders'); $this->admin_footer(); return; }
  $rows=[]; $totals=['leads'=>0,'plays'=>0,'wins'=>0,'coupons'=>0];
  foreach($campaigns as $c){$leads=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('leads')} WHERE campaign_id=%d",$c->id));$plays=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('plays')} WHERE campaign_id=%d",$c->id));$wins=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('plays')} WHERE campaign_id=%d AND result='win'",$c->id));$coupons=(int)$this->db->get_var($this->db->prepare("SELECT COUNT(*) FROM {$this->table('coupons')} co INNER JOIN {$this->table('prizes')} pr ON pr.id=co.prize_id WHERE pr.campaign_id=%d AND co.status='assigned'",$c->id)); $rows[]=compact('c','leads','plays','wins','coupons'); foreach($totals as $k=>$v) $totals[$k]+=$$k; }
  $tiles=['leads'=>'Participantes','plays'=>'Jogadas','wins'=>'Vitórias','coupons'=>'Cupons entregues'];
  echo '<div class="msg-stats">'; foreach($tiles as $k=>$label) echo '<div class="msg-stat"><span>'.esc_html($label).'</span><strong>'.number_format_i18n($totals[$k]).'</strong></div>'; echo '</div>';
  echo '<section class="msg-card msg-table-card"><header class="msg-table-head"><h2>Por campanha</h2></header><div class="msg-table-scroll"><table class="msg-table msg-report-table"><thead><tr><th>Campanha</th><th class="msg-num">Participantes</th><th class="msg-num">Jogadas</th><th class="msg-num">Vitórias</th><th class="msg-num">Cupons</th><th class="msg-num">Chance-base</th><th>Meta de cupons</th><th>Taxa de vitória</th></tr></thead><tbody>';
  foreach($rows as $r){ $c=$r['c']; $goal=(int)($c->campaign_goal??0); $progress=$goal>0?min(100,round($r['coupons']/$goal*100,1)):0; $rate=$r['plays']?round($r['wins']/$r['plays']*100,1):0;
   echo '<tr><td><strong>'.esc_html($c->name).'</strong>'.$this->status_badge($c).'</td><td class="msg-num">'.number_format_i18n($r['leads']).'</td><td class="msg-num">'.number_format_i18n($r['plays']).'</td><td class="msg-num">'.number_format_i18n($r['wins']).'</td><td class="msg-num">'.number_format_i18n($r['coupons']).'</td><td class="msg-num">'.esc_html(number_format_i18n((float)($c->win_chance??25),1)).'%</td>';
   echo '<td>'.($goal>0?'<div class="msg-meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'.esc_attr($progress).'" aria-label="Progresso da meta"><span class="msg-meter-track"><span class="msg-meter-fill" style="width:'.esc_attr($progress).'%"></span></span><small>'.number_format_i18n($r['coupons']).' de '.number_format_i18n($goal).' · '.esc_html(number_format_i18n($progress,1)).'%</small></div>':'<span class="msg-muted">Sem meta</span>').'</td>';
   echo '<td><div class="msg-meter msg-meter--quiet" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'.esc_attr($rate).'" aria-label="Taxa de vitória"><span class="msg-meter-track"><span class="msg-meter-fill" style="width:'.esc_attr(min(100,$rate)).'%"></span></span><small>'.esc_html(number_format_i18n($rate,1)).'%</small></div></td></tr>'; }
  echo '</tbody></table></div></section><p class="msg-footnote">A chance-base vale por tentativa elegível quando há prêmios com estoque. Os pesos relativos dividem essa chance entre os prêmios disponíveis. Metas são referências, não garantias. Apagar participantes também remove as jogadas deles destes números.</p>';
  $this->admin_footer(); }
 public function save_prize(){ $this->admin_guard(); check_admin_referer('msg_save_prize'); $this->ensure_schema(); $cid=absint($_POST['campaign_id']??0);$c=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('campaigns')} WHERE id=%d",$cid)); if(!$c)wp_die('Campanha inválida.'); $game=sanitize_key($_POST['game']??''); if(!in_array($game,$this->enabled_games($c),true))wp_die('Essa modalidade não está habilitada na campanha.'); $mode=($_POST['stock_mode']??'unique')==='shared'?'shared':'unique'; $ok=$this->db->insert($this->table('prizes'),['campaign_id'=>$cid,'game'=>$game,'name'=>sanitize_text_field(wp_unslash($_POST['name']??'')),'weight'=>max(.001,(float)($_POST['weight']??1)),'stock_mode'=>$mode,'shared_code'=>sanitize_text_field(wp_unslash($_POST['shared_code']??'')),'shared_limit'=>max(1,absint($_POST['shared_limit']??1)),'active'=>1,'created_at'=>current_time('mysql')]); if(!$ok) $this->fail_redirect('O prêmio não foi salvo.','msg-prizes'); $this->audit($cid,'Prêmio criado',['name'=>sanitize_text_field(wp_unslash($_POST['name']??''))]); wp_safe_redirect(add_query_arg('msg','Prêmio cadastrado.',admin_url('admin.php?page=msg-prizes')));exit; }
 public function add_coupons(){ $this->admin_guard(); $id=absint($_POST['prize_id']??0);check_admin_referer('msg_add_coupons_'.$id);$p=$this->db->get_row($this->db->prepare("SELECT * FROM {$this->table('prizes')} WHERE id=%d",$id));if(!$p||$p->stock_mode!=='unique')wp_die('Prêmio inválido.');$codes=preg_split('/\r\n|\r|\n/',wp_unslash($_POST['codes']??''));$added=0;foreach($codes as $code){$code=sanitize_text_field(trim($code));if($code==='')continue;$ok=$this->db->insert($this->table('coupons'),['prize_id'=>$id,'code'=>$code,'status'=>'available','created_at'=>current_time('mysql')]);if($ok)$added++;} $this->audit((int)$p->campaign_id,'Estoque de cupons atualizado',['prize_id'=>$id,'added'=>$added]);wp_safe_redirect(add_query_arg('msg',rawurlencode($added.' código(s) adicionado(s).'),admin_url('admin.php?page=msg-prizes')));exit; }
 public function export_leads(){ $this->admin_guard(); check_admin_referer('msg_export_leads'); header('Content-Type: text/csv; charset=utf-8');header('Content-Disposition: attachment; filename=mini-salgados-leads.csv');$out=fopen('php://output','w');fputcsv($out,['Nome','WhatsApp','Campanha','Cadastro','Última atividade','Consentimento marketing']);$rows=$this->db->get_results("SELECT l.*,c.name campaign_name FROM {$this->table('leads')} l LEFT JOIN {$this->table('campaigns')} c ON c.id=l.campaign_id ORDER BY l.id DESC",ARRAY_A);foreach($rows as $r)fputcsv($out,[$r['name'],$r['phone'],$r['campaign_name'],$r['created_at'],$r['last_seen'],$r['marketing_consent']?'Sim':'Não']);fclose($out);exit; }
 private function audit($cid,$event,$details=[]){$this->db->insert($this->table('audit'),['campaign_id'=>$cid,'admin_id'=>get_current_user_id(),'event'=>$event,'details'=>wp_json_encode($details),'created_at'=>current_time('mysql')]);}
 public function elementor_widget($manager){ if(class_exists('\Elementor\Widget_Base') && class_exists('MSG_Elementor_Widget')) $manager->register(new \MSG_Elementor_Widget()); }
}


if (class_exists('\Elementor\Widget_Base') && !class_exists('MSG_Elementor_Widget')) {
 class MSG_Elementor_Widget extends \Elementor\Widget_Base {
  public function get_name(){return 'mini-salgados-games';}
  public function get_title(){return 'Mini Salgados Games';}
  public function get_icon(){return 'eicon-game-controller';}
  public function get_categories(){return ['general'];}
  protected function register_controls(){ $this->start_controls_section('content',['label'=>'Campanha']); $this->add_control('campaign',['label'=>'Slug da campanha','type'=>\Elementor\Controls_Manager::TEXT,'placeholder'=>'promocao-de-natal']); $this->end_controls_section(); }
  protected function render(){ $s=sanitize_title($this->get_settings_for_display('campaign')); echo do_shortcode('[mini_salgados campanha="'.esc_attr($s).'"]'); }
 }
}
