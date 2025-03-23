import { Navbar } from "./components/Navbar";
import "./globals.css";
import { Martian_Mono } from "next/font/google";

const font = Martian_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "MODEO PMIS",
  description: "DPWH MODEO Project Management Information System",
};

  /**
   * The root layout component.
   *
   * This component wraps the entire app, providing a consistent
   * layout structure for all pages.
   *
   * @param {{ children: React.ReactNode }} props The component props.
   * @returns {React.ReactElement} The root layout component.
   */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} flex flex-col w-screen h-screen`}>
        <Navbar />
        <main className="flex flex-col justify-center items-center overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
