import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { calculateRaphiaMetadata } from "./raphia/calculateMetadata";
import { RaphiaAd } from "./raphia/RaphiaAd";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Raphia">
        {/* Anúncio vertical 9:16 — Site profissional por R$ 399,00 */}
        <Composition
          id="RaphiaSite399"
          component={RaphiaAd}
          durationInFrames={1650}
          fps={30}
          width={1080}
          height={1920}
          calculateMetadata={calculateRaphiaMetadata}
          defaultProps={{
            narracao: true,
            whatsapp: "",
            duracoes: [6, 11, 17, 10, 11],
          }}
        />
      </Folder>
      <Folder name="Exemplo-Remotion">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
    </>
  );
};
