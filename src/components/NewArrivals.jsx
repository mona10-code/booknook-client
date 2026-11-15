"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NewArrivals() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/new-arrivals`);
        const result = await response.json();
        
        if (result.success) {
          
          setBooks(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">New Arrivals</h2>
        <p className="text-gray-500">No books available yet. Add a book to see it here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">New Arrivals</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Check out the latest books added to our library.</p>
        </div>
        <Link href="/books" className="btn btn-outline btn-primary hidden md:flex">
          See All Books
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <div 
            key={book._id} 
            className="card bg-white dark:bg-base-100 shadow-md border border-gray-200 dark:border-base-content/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <figure className="h-64 overflow-hidden bg-gray-100 dark:bg-base-300">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </figure>
            
            <div className="card-body p-5">
              <div className="badge badge-outline badge-primary badge-sm font-medium mb-2">
                {book.category}
              </div>
              
              <h2 className="card-title text-lg text-gray-900 dark:text-white line-clamp-1">{book.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">By {book.author}</p>
              
              <div className="card-actions justify-end mt-4">
                
                <Link 
                  href={`/books/${book._id}`} 
                  className="btn btn-primary btn-sm w-full text-white font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link href="/books" className="btn btn-outline btn-primary w-full">
          See All Books
        </Link>
      </div>
    </div>
  );
}