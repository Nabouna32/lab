import { Roboto } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function DesignLabLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={roboto.variable}>{children}</div>;
}
