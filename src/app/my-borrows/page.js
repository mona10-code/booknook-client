"use client";
import { useState, useEffect } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // প্রাইভেট রুট প্রোটেকশন
  useEffect(() => {
    document.title = "BookNook | My Borrows";
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const fetchBorrows = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`http://localhost:5000/api/my-borrows?email=${session.user.email}`);
      const result = await response.json();
      if (result.success) setBorrows(result.data);
    } catch (error) {
      console.error("Failed to fetch borrows", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchBorrows();
  }, [session]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/borrows/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      
      if (result.success) {
        setBorrows(borrows.filter((b) => b._id !== id));
        showToast("Book returned successfully!", "success");
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Failed to return book.", "error");
    }
  };

  if (isPending || loading) {
    return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen relative">
      <h2 className="text-3xl font-bold text-base-content mb-8">My Borrowed Books</h2>

      {/* টোস্ট মেসেজ */}
      {toast.show && (
        <div className="fixed top-20 right-5 z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {borrows.length === 0 ? (
        <div className="text-center bg-base-200 p-10 rounded-2xl">
          <p className="text-xl text-base-content/70 mb-4">You haven't borrowed any books yet.</p>
          <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-lg border border-base-content/10">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Image</th>
                <th>Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id} className="hover:bg-base-200/50">
                  <td>
                    <div className="avatar">
                      <div className="w-16 h-16 rounded">
                        <img src={borrow.bookImage} alt={borrow.bookTitle} />
                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-base-content">{borrow.bookTitle}</td>
                  <td className="text-base-content/80">{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                  <td className="text-base-content/80">{new Date(borrow.returnDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleReturn(borrow._id)} className="btn btn-sm btn-error text-white">
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}