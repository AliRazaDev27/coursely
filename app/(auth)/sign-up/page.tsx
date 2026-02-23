"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="auth-card">
                <div className="auth-header">
                    <Mail size={24} className="auth-header-icon" />
                    <h2>Check your email</h2>
                    <p>
                        We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                        Click the link to activate your account.
                    </p>
                </div>
                <Link href="/sign-in" className="btn btn-primary btn-full">
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="auth-card">
            <div className="auth-header">
                <UserPlus size={24} className="auth-header-icon" />
                <h2>Create an account</h2>
                <p>Get started with Coursely</p>
            </div>

            <form onSubmit={handleSignUp} className="auth-form">
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-wrapper">
                        <Mail size={18} className="input-icon" />
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                        <Lock size={18} className="input-icon" />
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 size={18} className="spinner" />
                            Creating account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>

            <p className="auth-footer">
                Already have an account?{" "}
                <Link href="/sign-in">Sign in</Link>
            </p>
        </div>
    );
}
