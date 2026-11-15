import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import BorrowButton from "./BorrowButton"; // ক্লায়েন্ট বাটন আলাদা ফাইলে
import { Suspense } from "react";

export default async function BookDetailsPage({ params }) {
   return (
    <Suspense fallback={<div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <BookDetailsContent params={params} />
    </Suspense>
  );
}

async function BookDetailsContent({ params }) {
  const { id } = await params;

  // Programming Hero-এর মতো সরাসরি auth থেকে টোকেন নেওয়া
  const tokenData = await auth.api.getToken({
    headers: await headers(),
  });
  const token = tokenData?.token;

  // সার্ভার থেকেই ডাটা ফেচ করা
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`);
  const result = await response.json();
  const book = result.data;

  if (!book) {
    return <div className="text-center mt-20 text-red-500 text-xl font-bold">Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-16 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-gray-200 dark:border-[#334155] overflow-hidden flex flex-col lg:flex-row">
        
        {/* বইয়ের ছবি */}
        <div className="lg:w-1/2 h-96 lg:h-auto relative">
          <img src={book.image} alt={book.title} className="w-full h-full object-cover absolute inset-0" />
        </div>

        {/* বইয়ের তথ্য */}
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

          {/* Borrow বাটন (ক্লায়েন্ট কম্পোনেন্টে পাঠানো হলো) */}
          <div className="mt-auto">
            <BorrowButton book={book} token={token} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/books" className="btn btn-ghost text-gray-700 dark:text-gray-300">← Back to All Books</Link>
      </div>
    </div>
  );
}