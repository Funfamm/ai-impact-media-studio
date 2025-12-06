import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <AdminSidebar />
            <AdminHeader email={process.env.CONTACT_EMAIL} />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
