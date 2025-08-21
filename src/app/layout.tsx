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
        <Base>
          <div style={{ padding: "2rlh" }}>{children}</div>
        </Base>
      </FrameworkContextProvider>
    </body>
  </html>
);

export default RootLayout;
