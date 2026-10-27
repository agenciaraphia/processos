<?php
/**
 * Plugin Name: Mini Salgados Games
 * Description: Campanhas promocionais com roleta, raspadinha e caixa misteriosa, cadastro de participantes e controle de cupons.
 * Version: 1.4.0
 * Author: Mini Salgados
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: mini-salgados-games
 */
if (!defined('ABSPATH')) exit;
define('MSG_VERSION', '1.4.0');
define('MSG_PATH', plugin_dir_path(__FILE__));
define('MSG_URL', plugin_dir_url(__FILE__));
require_once MSG_PATH . 'includes/class-msg-plugin.php';
register_activation_hook(__FILE__, ['MSG_Plugin', 'activate']);
add_action('plugins_loaded', function(){ MSG_Plugin::instance(); });
