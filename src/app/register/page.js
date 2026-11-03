"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(""); // নতুন: ছবির লিঙ্ক
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // পাসওয়ার্ড ভ্যালিডেশন (ডকুমেন্ট অনুযায়ী)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    setLoading(true);

    // BetterAuth এর রেজিস্ট্রেশন ফাংশন
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image, // ছবির লিঙ্ক পাঠানো হচ্ছে
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // ডকুমেন্ট অনুযায়ী রেজিস্ট্রেশন সফল হলে লগইন পেজে পাঠাতে হবে
      router.push("/login");
    }
  };

   useEffect(() => {
    document.title = "BookNook | Register";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 py-10">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-2 text-base-content">Register</h2>
          
          {error && <div className="alert alert-error text-sm mb-4 py-2">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Name</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input input-bordered" placeholder="Your Name" />
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input input-bordered" placeholder="Your Email" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Photo URL</span></label>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} required className="input input-bordered" placeholder="https://example.com/photo.jpg" />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered" placeholder="Password" />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/60">Min 6 chars, 1 Uppercase, 1 Lowercase</span>
              </label>
            </div>
            
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm text-base-content/70">
            Already have an account? <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}