"use client";
import { useState } from "react";
import { authClient } from "../../../lib/auth-client";
import { WiDaySunnyOvercast } from "react-icons/wi";

export default function BorrowButton({ book, token }) {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleBorrow = async () => {
    if (!session) return showToast("Please login first.", "error");

    try {
      const borrowData = {
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: session.user.email,
        userName: session.user.name,
        borrowDate: new Date(),
        returnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/borrows`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(borrowData),
      });
      
      // if (response.ok) {
      //   const result = await response.json();
      //   showToast("Book borrowed successfully!", "success");
      //   setIsOpen(false);
      // } else {
      //   showToast(result.message || result.msg, "error");
      // }
          if (response.ok) {
              showToast("Book borrowed successfully!", "success");
              setIsOpen(false);

              setTimeout(() => window.location.reload(), 1500);
      } else {
        // এরর হলে সার্ভারের মেসেজ দেখাও
        const errorResult = await response.json();
        showToast(errorResult.message || errorResult.msg || "Failed to borrow book", "error");
      }

    } catch (err) {
      showToast("Failed to borrow book.", "error");
    }
  };

  return (
    <>
      {book.totalCopies > 0 ? (
        <button onClick={() => setIsOpen(true)} className="btn btn-primary w-full text-lg text-white shadow-md">
          Borrow This Book
        </button>
      ) : (
        <button disabled className="btn btn-disabled w-full text-lg">Not Available</button>
      )}

      {toast.show && (
        <div className="fixed top-20 right-5 z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-[#1e293b]">
            <h3 className="font-bold text-2xl mb-4">Confirm Borrow</h3>
            <p className="mb-2"><strong>User:</strong> {session?.user?.name}</p>
            <p className="mb-6"><strong>Email:</strong> {session?.user?.email}</p>
            <div className="modal-action">
              <button onClick={() => setIsOpen(false)} className="btn">Cancel</button>
              <button onClick={handleBorrow} className="btn btn-primary text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}