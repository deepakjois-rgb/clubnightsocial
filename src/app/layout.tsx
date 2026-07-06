import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionProvider";

export const metadata: Metadata = {
  title: "Club Night Social",
  description: "Club Night Social",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <p>Club Night Social</p>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
