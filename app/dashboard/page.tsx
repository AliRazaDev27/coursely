"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Pencil,
    Trash2,
    Loader2,
    Calendar,
} from "lucide-react";

export default function DashboardPage() {
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const router = useRouter();

    const { data, isLoading, refetch } = trpc.courses.list.useQuery({
        page,
        pageSize,
    });

    const deleteMutation = trpc.courses.delete.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        deleteMutation.mutate({ id });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1>My Courses</h1>
                    <p className="dashboard-subtitle">
                        {data ? `${data.total} course${data.total !== 1 ? "s" : ""}` : "Loading..."}
                    </p>
                </div>
                <Link href="/dashboard/courses/new" className="btn btn-primary">
                    <Plus size={18} />
                    Create Course
                </Link>
            </div>

            {isLoading ? (
                <div className="loading-state">
                    <Loader2 size={32} className="spinner" />
                    <p>Loading courses...</p>
                </div>
            ) : data?.courses.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} />
                    <h3>No courses yet</h3>
                    <p>Create your first course to get started.</p>
                    <Link href="/dashboard/courses/new" className="btn btn-primary">
                        <Plus size={18} />
                        Create Course
                    </Link>
                </div>
            ) : (
                <>
                    <div className="course-grid">
                        {data?.courses.map((course: { id: string; title: string; description: string; created_at: string; updated_at: string }) => (
                            <div key={course.id} className="course-card">
                                <div className="course-card-header">
                                    <div
                                        className="course-card-title-link"
                                        onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                                    >
                                        <h3>{course.title}</h3>
                                    </div>
                                    <div className="course-card-actions">
                                        <button
                                            onClick={() =>
                                                router.push(`/dashboard/courses/${course.id}/edit`)
                                            }
                                            className="btn btn-icon"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id, course.title)}
                                            className="btn btn-icon btn-danger"
                                            title="Delete"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="course-card-description">
                                    {course.description || "No description"}
                                </p>
                                <div className="course-card-footer">
                                    <span className="course-card-date">
                                        <Calendar size={14} />
                                        {formatDate(course.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data && data.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn btn-ghost"
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {data.page} of {data.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                disabled={page === data.totalPages}
                                className="btn btn-ghost"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
