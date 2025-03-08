import type { Metadata } from "next";
import "./layout.css";

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
    <body>{children}</body>
  </html>
);

export default RootLayout;
