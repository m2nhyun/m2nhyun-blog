import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import DashBoard from "./dashboard/page";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MinHyun_Blog",
  description: "next app",
};

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <DashBoard />
        <div className="flex justify-center">
          <main className="w-500px">{children}</main>
        </div>
      </body>
    </html>
    // <div>
    //   <DashBoard />
    //   <main>{children}</main>
    // </div>
  );
}
