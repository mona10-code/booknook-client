import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-3xl font-bold text-base-content mt-4 mb-2">Page Not Found</h2>
      <p className="text-base-content/70 mb-8 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary btn-lg text-white">
        Back to Home
      </Link>
    </div>
  );
}
