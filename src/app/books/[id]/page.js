"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";

function BookDetailsContent() {
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`);
        const result = await response.json();
        if (result.success) setBook(result.data);
        else setError(result.message);
      } catch (err) {
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBookDetails();
  }, [id]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleBorrow = async () => {
    if (!session) {
      showToast("Please login first to borrow a book.", "error");
      return;
    }

    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 7);

    const borrowData = {
      bookId: book._id,
      bookTitle: book.title,
      bookImage: book.image,
      userEmail: session.user.email,
      userName: session.user.name,
      borrowDate: borrowDate,
      returnDate: returnDate,
    };

    try {
      // টোকেন নেওয়া
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token || session?.session?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/borrows`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // টোকেন যুক্ত হলো
        },
        body: JSON.stringify(borrowData),
      });
      const result = await response.json();

      if (result.success) {
        showToast("Book borrowed successfully! Check 'My Borrows'.", "success");
        setIsEditModalOpen(false);
        setBook({ ...book, totalCopies: book.totalCopies - 1 });
      } else {
        showToast(result.message, "error");
      }
    } catch (err) {
      showToast("Failed to borrow book.", "error");
    }
  };

  if (loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (error) return <div className="text-center mt-20 text-red-500 text-xl font-bold">{error}</div>;
  if (!book) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-16 px-4 transition-colors duration-300">
      {toast.show && (
        <div className="fixed top-20 right-5 z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-gray-200 dark:border-[#334155] overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 h-96 lg:h-auto relative">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover absolute inset-0" />
        </div>

        <div className="lg:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold">{book.category}</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{book.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-medium">By {book.author}</p>
          <div className="w-full border-t border-gray-200 dark:border-gray-700 my-4"></div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 grow">{book.description}</p>
          
          <div className="bg-gray-100 dark:bg-[#0f172a] p-5 rounded-2xl mb-6 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <p className="mb-2"><strong>Added By:</strong> {book.userName}</p>
            <p className="mb-2"><strong>Added On:</strong> {new Date(book.addedAt).toLocaleDateString()}</p>
            <p><strong>Available Copies:</strong> <span className="font-bold text-primary">{book.totalCopies || 0}</span></p>
          </div>

          <div className="mt-auto">
            {book.totalCopies > 0 ? (
              <button onClick={() => setIsEditModalOpen(true)} className="btn btn-primary w-full text-lg text-white shadow-md">
                Borrow This Book
              </button>
            ) : (
              <button disabled className="btn btn-disabled w-full text-lg">
                Not Available
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/books" className="btn btn-ghost text-gray-700 dark:text-gray-300">← Back to All Books</Link>
      </div>

      {/* Borrow Modal */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-4">Confirm Borrow</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="label"><span className="label-text font-semibold text-gray-700 dark:text-gray-300">User Name</span></label>
                <input type="text" value={session?.user?.name || ""} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-[#0f172a]" />
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold text-gray-700 dark:text-gray-300">User Email</span></label>
                <input type="text" value={session?.user?.email || ""} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-[#0f172a]" />
              </div>
            </div>
            <div className="modal-action">
              <button onClick={() => setIsEditModalOpen(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleBorrow} className="btn btn-primary text-white">Confirm Borrow</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <BookDetailsContent />
    </Suspense>
  );
}