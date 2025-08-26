import { Base } from "@colonydb/anthill/Base";
import type { Metadata } from "next";
import FrameworkContextProvider from "./FrameworkContextProvider";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const canonical = "https://harvester.particlesystem.com/";
const description = "A tool to display lists of content scraped from the web.";
const image = "https://harvester.particlesystem.com/harvester-640x640.png";
const title = "Harvester";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: title,
    images: [
      {
        url: image,
        width: 640,
        height: 640,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
};

const RootLayout = ({ children }: Props) => (
  <html lang="en">
    <body>
      <FrameworkContextProvider>
        <Base
          brandTypeface="serif"
          color={{
            lightness: 0.779,
            chroma: 0.169,
            hue: 65.15,
            shadesLightnessCoefficient: 0.838,
            shadesChromaCoefficient: 0.789,
            tintsLightnessCoefficient: 0.71,
            tintsChromaCoefficient: 0.745,
            grayChroma: 0,
          }}
        >
          {children}
        </Base>
      </FrameworkContextProvider>
    </body>
  </html>
);

export default RootLayout;
