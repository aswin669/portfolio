import "./globals.css";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingElements from "../components/FloatingElements";

export const metadata = {
  title: "Aswin S — Portfolio",
  description: "MERN Stack Developer portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0f1d] to-[#0f1629]">
          <FloatingElements />
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}