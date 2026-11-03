"use client";
import { useEffect, useState } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaUser, FaCalendarAlt, FaSignOutAlt, FaEdit } from "react-icons/fa";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [currentTheme, setCurrentTheme] = useState("light");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    document.title = "BookNook | My Profile";
    
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      setCurrentTheme(theme);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (!isPending && !session) {
      router.push("/login");
    }
    if (session) {
      setEditName(session.user.name || "");
      setEditImage(session.user.image || "");
    }
    return () => observer.disconnect();
  }, [session, isPending, router]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: editName,
        image: editImage,
      });

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Profile updated successfully!", "success");
        setIsEditModalOpen(false);
        router.refresh(); 
      }
    } catch (err) {
      showToast("Failed to update profile.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  if (!session) return null;

  const isDark = currentTheme === "dark";
  
  const bgOuter = isDark ? "bg-slate-950" : "bg-gray-200";
  const bgCard = isDark ? "bg-slate-900" : "bg-[#f0f9ff]"; 
  const bgInner = isDark ? "bg-slate-800" : "bg-gray-100"; 
  const textMain = isDark ? "text-slate-100" : "text-slate-900";
  const textSub = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";

  return (
    <div className={`min-h-screen ${bgOuter} py-16 px-4 flex justify-center items-start transition-colors duration-300`}>
      
      <div className={`w-full max-w-2xl ${bgCard} rounded-3xl shadow-xl border ${borderColor} overflow-hidden`}>
        
        <div className="p-8 md:p-12 flex flex-col items-center">
          
          {/* প্রোফাইল পিকচার */}
          <div className={`w-32 h-32 rounded-full border-4 ${isDark ? 'border-slate-700' : 'border-slate-100'} shadow-md overflow-hidden bg-slate-200 mb-6`}>
            <img 
              src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}&background=random&size=128`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* ইউজারের নাম */}
          <h2 className={`text-3xl font-extrabold ${textMain} mb-3`}>{session.user.name}</h2>
          
          {/* ইমেইল */}
          <p className={`${textSub} flex items-center gap-2 text-sm md:text-base mb-6 font-medium ${bgInner} px-4 py-2 rounded-full`}>
            <FaEnvelope /> {session.user.email}
          </p>
          
          {/* এডিট প্রোফাইল বাটন */}
          <button 
            onClick={() => setIsEditModalOpen(true)} 
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-full px-8 shadow-md transition-all"
          >
            <FaEdit /> Edit Profile
          </button>

          <div className={`w-full border-t ${borderColor} my-8`}></div>

          {/* ডিটেইলস সেকশন */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Name */}
            <div className={`${bgInner} p-5 rounded-2xl flex items-center gap-4 border ${borderColor} shadow-sm`}>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
                <FaUser />
              </div>
              <div className="overflow-hidden">
                <p className={`text-[10px] ${textSub} font-bold uppercase tracking-wider mb-0.5`}>Account Name</p>
                <p className={`font-semibold ${textMain} truncate`}>{session.user.name}</p>
              </div>
            </div>

            {/* User ID */}
            <div className={`${bgInner} p-5 rounded-2xl flex items-center gap-4 border ${borderColor} shadow-sm`}>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                <FaCalendarAlt />
              </div>
              <div className="overflow-hidden">
                <p className={`text-[10px] ${textSub} font-bold uppercase tracking-wider mb-0.5`}>User ID</p>
                <p className={`font-mono text-sm ${textMain} truncate`}>{session.user.id}</p>
              </div>
            </div>
          </div>

          {/* অ্যাকশন বাটন */}
          <div className="mt-10 flex flex-col md:flex-row gap-3 justify-center w-full">
            <Link href="/my-books" className={`btn ${bgInner} ${textMain} border-none flex-1 shadow-sm hover:opacity-80`}>
              My Books
            </Link>
            <Link href="/my-borrows" className={`btn ${bgInner} ${textMain} border-none flex-1 shadow-sm hover:opacity-80`}>
              My Borrows
            </Link>
            <button onClick={handleLogout} className="btn bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-none flex-1 shadow-sm">
              <FaSignOutAlt /> Logout
            </button>
          </div>

        </div>
      </div>

      {/* টোস্ট মেসেজ */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* এডিট প্রোফাইল মডাল */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className={`modal-box ${bgCard} border ${borderColor}`}>
            <h3 className={`font-bold text-2xl ${textMain} mb-6 text-center`}>Update Profile</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className={`label-text font-semibold ${textMain}`}>Profile Name</span></label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className={`input input-bordered w-full ${textMain} ${bgInner} border-gray-300 dark:border-gray-600`} 
                  required 
                />
              </div>

              <div className="form-control">
                <label className="label"><span className={`label-text font-semibold ${textMain}`}>Profile Image URL</span></label>
                <input 
                  type="url" 
                  value={editImage} 
                  onChange={(e) => setEditImage(e.target.value)} 
                  className={`input input-bordered w-full ${textMain} ${bgInner} border-gray-300 dark:border-gray-600`} 
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="modal-action mt-8">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn bg-gray-300 text-gray-800 hover:bg-gray-400 border-none">Cancel</button>
                <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none" disabled={updating}>
                  {updating ? <span className="loading loading-spinner loading-sm"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}