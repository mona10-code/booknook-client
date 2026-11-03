"use client";

import Link from "next/link";
import { useState, useEffect } from "react"; // ১. নতুন ইমপোর্ট যুক্ত হলো
import { FaBookOpen, FaFacebook, FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  // ২. বর্তমান বছর রাখার জন্য একটি স্টেট তৈরি করলাম
  const [currentYear, setCurrentYear] = useState(""); 

  // ৩. useEffect ব্যবহার করে পেজ লোড হওয়ার পর বছরটা সেট করব
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-base-300 text-base-content pt-10 pb-6 border-t border-base-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ১. লোগো এবং বর্ণনা */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <FaBookOpen className="text-3xl" />
            <span>BookNook</span>
          </Link>
          <p className="text-sm text-base-content/70 leading-relaxed pr-4">
            A small online library where you can explore, borrow, and share your favorite books. Dive into a new world with every page.
          </p>
        </div>

        {/* ২. কন্টাক্ট ইনফো */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-base-content">Contact Us</h3>
          <ul className="space-y-3 text-sm text-base-content/80">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary text-lg" />
              <span>support@booknook.com</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-primary text-lg" />
              <span>+880 1234 567890</span>
            </li>
            <li className="mt-2 text-base-content/60">
              123 Library Street, Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* ৩. সোশ্যাল মিডিয়া */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-base-content">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-100 hover:text-primary transition-all">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-100 hover:text-primary transition-all">
              <FaXTwitter className="text-xl" />
            </a>
            <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-100 hover:text-primary transition-all">
              <FaGithub className="text-xl" />
            </a>
          </div>
        </div>

      </div>

      {/* কপিরাইট লাইন */}
      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-base-content/10 text-center text-sm text-base-content/60">
        {/* ৪. এখানে currentYear স্টেটটি ব্যবহার করা হলো */}
        <p>&copy; {currentYear} BookNook. All rights reserved.</p>
      </div>
    </footer>
  );
}