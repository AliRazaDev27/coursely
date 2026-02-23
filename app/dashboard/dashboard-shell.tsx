"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TRPCProvider } from "@/lib/trpc/provider";
import { LogOut, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

function DashboardNav() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setEmail(user?.email ?? null);
        });
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="dashboard-nav">
            <div className="dashboard-nav-inner">
                <div className="dashboard-nav-brand">
                    <BookOpen size={24} />
                    <span>Coursely</span>
                </div>
                <div className="dashboard-nav-actions">
                    {email && <span className="dashboard-nav-email">{email}</span>}
                    <button onClick={handleSignOut} className="btn btn-ghost" title="Sign out">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <TRPCProvider>
            <div className="dashboard-layout">
                <DashboardNav />
                <main className="dashboard-main">{children}</main>
            </div>
        </TRPCProvider>
    );
}
