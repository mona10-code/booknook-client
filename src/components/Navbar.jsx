"use client";
import Link from "next/link";
import { FaBookOpen, FaMoon, FaSun, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null); 

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="bg-base-200 shadow-sm px-4 md:px-10 py-3 transition-colors duration-300">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

              {/* মোবাইলের জন্য হ্যামবার্গার মেনু */}
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/books">All Books</Link></li>
            <li><Link href="/add-book">Add Book</Link></li>
            <li><Link href="/my-books">My Books</Link></li>
            <li><Link href="/my-borrows">My Borrows</Link></li>
            
            {/* লগইন/লগআউট বাটন মোবাইলে */}
            {!session && (
              <>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
              </>
            )}
            {session && (
              <li><button onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </div>
        
        {/* লোগো */}
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <FaBookOpen className="text-2xl" />
            <span className="tracking-wide">BookNook</span>
          </Link>
        </div>

          

        {/* মেনু লিস্ট */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8 font-medium text-sm lg:text-base whitespace-nowrap">
          <Link href="/" className="text-base-content/80 hover:text-primary transition-colors">Home</Link>
          <Link href="/books" className="text-base-content/80 hover:text-primary transition-colors">All Books</Link>
          <Link href="/add-book" className="text-base-content/80 hover:text-primary transition-colors">Add Book</Link>
          <Link href="/my-books" className="text-base-content/80 hover:text-primary transition-colors">My Books</Link>
          <Link href="/my-borrows" className="text-base-content/80 hover:text-primary transition-colors">My Borrows</Link>
        </div>

        {/* ডার্ক মোড, লগইন/লগআউট */}
        <div className="flex-1 flex justify-end items-center gap-3">
          
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle text-lg">
            {theme === "light" ? <FaMoon /> : <FaSun className="text-warning" />}
          </button>

          {isPending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : session ? (
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="btn btn-ghost btn-circle avatar border border-base-content/20"
              >
                <div className="w-10 rounded-full">
                  <img 
                    alt="User Profile" 
                    src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                  />
                </div>
              </button>

              {/* ড্রপডাউন মেনু */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-base-100 rounded-box shadow-xl border border-base-content/10 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-base-content/10 bg-base-200">
                    <p className="text-sm font-bold text-base-content truncate">{session.user.name}</p>
                  </div>
                  <ul className="menu w-full p-2">
                    <li>
                      <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 text-base-content hover:text-primary">
                        <FaUser /> My Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-error hover:bg-error/10">
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost font-medium hidden sm:flex text-base-content">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary font-medium shadow-md text-white">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}