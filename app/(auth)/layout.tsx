export const dynamic = "force-dynamic";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="auth-logo">C</div>
                    <h1 className="auth-brand-name">Coursely</h1>
                    <p className="auth-brand-tagline">Manage your courses with ease</p>
                </div>
                {children}
            </div>
        </div>
    );
}
