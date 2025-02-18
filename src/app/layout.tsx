import "./globals.css";
import { Martian_Mono } from "next/font/google";

const font = Martian_Mono({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
});

export const metadata = {
  title: "MODEO PMIS",
  description: "DPWH MODEO Project Management Information System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} flex flex-col w-screen h-screen`}>
        {children}
      </body>
    </html>
  );
}
