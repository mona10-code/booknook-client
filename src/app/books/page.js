"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | All Books"; 
    
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const result = await response.json();
        
        if (result.success) {
          setBooks(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500 text-xl">{error}</div>;
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-base-content mb-8 text-center">All Books</h2>
      
      {books.length === 0 ? (
        <p className="text-center text-base-content/70 text-lg">No books available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book._id} className="card bg-base-100 shadow-xl border border-base-content/10 hover:shadow-2xl transition-all duration-300">
              <figure className="h-64 overflow-hidden bg-base-200">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                />
              </figure>
              <div className="card-body p-5">
                <div className="badge badge-outline badge-primary badge-sm mb-2">{book.category}</div>
                <h2 className="card-title text-lg text-base-content line-clamp-1">{book.title}</h2>
                <p className="text-sm text-base-content/70">By {book.author}</p>
                <div className="card-actions justify-end mt-4">
                  <Link href={`/books/${book._id}`} className="btn btn-primary btn-sm w-full">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}