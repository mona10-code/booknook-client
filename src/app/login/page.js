"use client";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch (err) {
      setError("Failed to login with Google.");
    }
  };

  useEffect(() => {
    document.title = "BookNook | Login;"
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-2 text-base-content">Login</h2>
          <p className="text-center text-sm text-base-content/60 mb-6">Welcome back to BookNook!</p>
          
          {error && (
            <div className="alert alert-error text-sm py-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="input input-bordered" 
                placeholder="Your Email" 
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="input input-bordered" 
                placeholder="Password" 
              />
              <label className="label">
                <Link href="#" className="label-text-alt link link-hover text-primary">
                  Forgot password?
                </Link>
              </label>
            </div>
            
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
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
            Login with Google
          </button>

          <p className="text-center mt-6 text-sm text-base-content/70">
            Don't have an account? <Link href="/register" className="link link-primary font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}