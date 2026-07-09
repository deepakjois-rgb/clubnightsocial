import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/context/SessionProvider";
import { ToastProvider } from "@/components/ui";

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
      <body className="min-h-screen bg-surface text-foreground antialiased">
        <SessionProvider>
          <ToastProvider>{children}</ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
