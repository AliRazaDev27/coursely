"use client";

import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Loader2,
    Calendar,
    Clock,
} from "lucide-react";

export default function ViewCoursePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: course, isLoading } = trpc.courses.getById.useQuery({ id });

    const deleteMutation = trpc.courses.delete.useMutation({
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    const handleDelete = () => {
        if (!course) return;
        if (!confirm(`Are you sure you want to delete "${course.title}"?`)) return;
        deleteMutation.mutate({ id });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
            <Link href="/dashboard" className="back-link">
                <ArrowLeft size={18} />
                Back to courses
            </Link>

            <div className="course-detail-card">
                <div className="course-detail-header">
                    <h1>{course.title}</h1>
                    <div className="course-detail-actions">
                        <button
                            onClick={() => router.push(`/dashboard/courses/${id}/edit`)}
                            className="btn btn-ghost"
                        >
                            <Pencil size={18} />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn btn-danger"
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 size={18} className="spinner" />
                            ) : (
                                <Trash2 size={18} />
                            )}
                            Delete
                        </button>
                    </div>
                </div>

                <div className="course-detail-meta">
                    <span>
                        <Calendar size={16} />
                        Created: {formatDate(course.created_at)}
                    </span>
                    <span>
                        <Clock size={16} />
                        Updated: {formatDate(course.updated_at)}
                    </span>
                </div>

                <div className="course-detail-body">
                    {course.description ? (
                        <p>{course.description}</p>
                    ) : (
                        <p className="text-muted">No description provided.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
