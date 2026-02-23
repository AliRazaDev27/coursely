"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, BookPlus } from "lucide-react";

export default function NewCoursePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const createMutation = trpc.courses.create.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        createMutation.mutate({ title, description });
    };

    return (
        <div className="form-page">
            <Link href="/dashboard" className="back-link">
                <ArrowLeft size={18} />
                Back to courses
            </Link>

            <div className="form-card">
                <div className="form-card-header">
                    <BookPlus size={24} />
                    <h2>Create a New Course</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Introduction to React"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="What is this course about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            maxLength={5000}
                        />
                    </div>

                    <div className="form-actions">
                        <Link href="/dashboard" className="btn btn-ghost">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    Creating...
                                </>
                            ) : (
                                "Create Course"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
