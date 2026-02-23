import Link from "next/link";

export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-logo">C</div>
        <h1>Coursely</h1>
        <p>
          A modern platform to create, manage, and organize your courses.
          Built for educators who value simplicity and elegance.
        </p>
        <div className="landing-actions">
          <Link href="/sign-in" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn btn-ghost">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
