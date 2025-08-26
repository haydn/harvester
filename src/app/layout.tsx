import { Base } from "@colonydb/anthill/Base";
import type { Metadata } from "next";
import FrameworkContextProvider from "./FrameworkContextProvider";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export const metadata: Metadata = {
  title: "Harvester",
  description:
    "Use CSS selectors to grab lists of stuff from various websites and list them altogether on a single page.",
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
