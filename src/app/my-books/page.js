"use client";
import { useState, useEffect } from "react";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const [editBook, setEditBook] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const fetchMyBooks = async () => {
    if (!session?.user?.email) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-books?email=${session.user.email}`);
      const result = await response.json();
      if (result.success) setBooks(result.data);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchMyBooks();
  }, [session]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const openDeleteModal = (id) => {
    setDeleteBookId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token || session?.session?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${deleteBookId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setBooks(books.filter((b) => b._id !== deleteBookId));
        showToast("Book deleted successfully", "success");
        setIsDeleteModalOpen(false);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Failed to delete book", "error");
    }
  };

  const openEditModal = (book) => {
    setEditBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data: tokenData } = await authClient.token();
      const token = tokenData?.token || session?.session?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${editBook._id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editBook),
      });
      const result = await response.json();
      
      if (result.success) {
        setBooks(books.map((b) => (b._id === editBook._id ? editBook : b)));
        showToast("Book updated successfully", "success");
        setIsEditModalOpen(false);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      showToast("Failed to update book", "error");
    }
  };

  if (isPending || loading) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!session) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen relative">
      <h2 className="text-3xl font-bold text-base-content mb-8">My Added Books</h2>

      {toast.show && (
        <div className="fixed top-20 right-5 z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg text-white`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {books.length === 0 ? (
        <div className="text-center bg-base-200 p-10 rounded-2xl">
          <p className="text-xl text-base-content/70 mb-4">You haven't added any books yet.</p>
          <Link href="/add-book" className="btn btn-primary text-white">Add a Book</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-lg border border-base-content/10">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 text-base-content">
                <th>Image</th><th>Title</th><th>Author</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-base-200/50">
                  <td>
                    <div className="avatar">
                      <div className="w-16 h-16 rounded">
                        <img src={book.image} alt={book.title} />
                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-base-content">{book.title}</td>
                  <td className="text-base-content/80">{book.author}</td>
                  <td className="flex gap-2">
                    <button onClick={() => openEditModal(book)} className="btn btn-sm btn-info text-white">Edit</button>
                    <button onClick={() => openDeleteModal(book._id)} className="btn btn-sm btn-error text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditModalOpen && editBook && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 border border-base-content/10">
            <h3 className="font-bold text-2xl text-base-content mb-4">Edit Book</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content">Title</span></label>
                <input type="text" value={editBook.title} onChange={(e) => setEditBook({...editBook, title: e.target.value})} className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content">Author</span></label>
                <input type="text" value={editBook.author} onChange={(e) => setEditBook({...editBook, author: e.target.value})} className="input input-bordered w-full" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold text-base-content">Description</span></label>
                <textarea value={editBook.description} onChange={(e) => setEditBook({...editBook, description: e.target.value})} className="textarea textarea-bordered w-full" required></textarea>
              </div>
              <div className="modal-action">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-base-100 border border-base-content/10 text-center">
            <h3 className="font-bold text-2xl text-error mb-4">Delete Book?</h3>
            <p className="text-base-content/80 mb-6">Are you sure you want to delete this book?</p>
            <div className="modal-action justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="btn">Cancel</button>
              <button onClick={confirmDelete} className="btn btn-error text-white">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}