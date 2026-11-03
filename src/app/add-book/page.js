"use client";
import { useState, useEffect } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: 5,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  //  Private Route Protection
  useEffect(() => {
    document.title = "BookNook | Add Book"; 
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return showToast("Please select an image!", "error");
    
    setLoading(true);

    try {
      const imageData = new FormData();
      imageData.append("image", imageFile);
      
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: imageData,
      });
      const imgbbResult = await imgbbResponse.json();
      
      if (!imgbbResult.success) throw new Error("Image upload failed!");

      const imageUrl = imgbbResult.data.url;
      const bookDataToSave = { 
        ...formData, 
        image: imageUrl, 
        userEmail: session.user.email, 
        userName: session.user.name, 
        addedAt: new Date() 
      };

      const serverResponse = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.session?.token || ""}`
         },
        body: JSON.stringify(bookDataToSave),
      });

      const serverResult = await serverResponse.json();

      if (serverResponse.ok && serverResult.success) {
        showToast("Book added successfully!", "success");
        setFormData({ title: "", author: "", category: "Fiction", image: "", description: "" });
        setImageFile(null);
        
        setTimeout(() => router.push("/books"), 2000);
      }  else if (serverResponse.status === 401 || serverResponse.status === 403) {
        
        showToast("Unauthorized! Please login again.", "error");
      } else {
        throw new Error(serverResult.message);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  
  if (isPending) {
    return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 relative">
      <div className="max-w-2xl mx-auto p-8 bg-base-100 shadow-xl rounded-2xl border border-base-content/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-base-content">Add a New Book</h2>
        
        {/* কাস্টম টোস্ট মেসেজ */}
        {toast.show && (
          <div className="fixed top-20 right-5 z-50">
            <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Book Title</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input input-bordered w-full text-base-content" placeholder="Enter book title" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Author Name</span></label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} required className="input input-bordered w-full text-base-content" placeholder="Enter author name" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Category</span></label>
            <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full text-base-content">
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Book Image</span></label>
            <input type="file" accept="image/*" onChange={handleImageChange} required className="file-input file-input-bordered w-full text-base-content" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Short Description</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="textarea textarea-bordered h-24 w-full text-base-content" placeholder="Enter short description"></textarea>
          </div>

                    <div className="form-control">
            <label className="label"><span className="label-text font-semibold text-base-content">Total Copies</span></label>
            <input 
              type="number" 
              name="totalCopies" 
              min="5"
              value={formData.totalCopies || ""} 
              onChange={handleChange} 
              required 
              className="input input-bordered w-full text-base-content" 
            />
          </div>

          {/* Read-only Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold text-base-content">User Name</span></label>
              <input type="text" value={session.user.name} readOnly className="input input-bordered bg-base-200 text-base-content/70 cursor-not-allowed" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold text-base-content">User Email</span></label>
              <input type="text" value={session.user.email} readOnly className="input input-bordered bg-base-200 text-base-content/70 cursor-not-allowed" />
            </div>
          </div>

          <div className="form-control mt-8">
            <button type="submit" className="btn btn-primary w-full text-lg text-white" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}