import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BookNook - A Small Online Library",
  description: "Explore, borrow, and share your favorite books.",
};

export default function RootLayout({ children }) {
  return (
     <html lang="en">
      {/* flex এবং min-h-screen দিলে Footer সবসময় নিচে থাকবে */}
      <body className="flex flex-col min-h-screen bg-base-100 text-base-content transition-colors duration-300">
        <Navbar />
        {/* main ট্যাগ এবং flex-grow দিলে মাঝের কন্টেন্ট জায়গা নেবে */}
        <main className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
