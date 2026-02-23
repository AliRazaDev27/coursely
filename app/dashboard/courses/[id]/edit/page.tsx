"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function EditCoursePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: course, isLoading } = trpc.courses.getById.useQuery({ id });

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (course) {
            setTitle(course.title);
            setDescription(course.description ?? "");
        }
    }, [course]);

    const updateMutation = trpc.courses.update.useMutation({
        onSuccess: () => {
            router.push(`/dashboard/courses/${id}`);
        },
        onError: (err) => {
            setError(err.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        updateMutation.mutate({ id, title, description });
    };

    if (isLoading) {
        return (
            <div className="loading-state">
                <Loader2 size={32} className="spinner" />
                <p>Loading course...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="empty-state">
                <h3>Course not found</h3>
                <Link href="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="form-page">
            <Link href={`/dashboard/courses/${id}`} className="back-link">
                <ArrowLeft size={18} />
                Back to course
            </Link>

            <div className="form-card">
                <div className="form-card-header">
                    <Save size={24} />
                    <h2>Edit Course</h2>
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
                        <Link href={`/dashboard/courses/${id}`} className="btn btn-ghost">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
