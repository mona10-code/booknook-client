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
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

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

    // BetterAuth
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/login");
    }
  };

    const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // লগইন সফল হলে হোম পেজে নিয়ে যাবে
      });
    } catch (err) {
      setError("Failed to login with Google.");
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

                    <div className="divider text-base-content/50 text-sm">OR</div>

          {/* গুগল লগইন বাটন */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            className="btn btn-outline w-full border-base-content/20 hover:bg-base-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Register with Google
          </button>

          <p className="text-center mt-4 text-sm text-base-content/70">
            Already have an account? <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}