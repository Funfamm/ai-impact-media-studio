import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server‑side authentication check
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin/login");
    }
    const email = session.user?.email ?? process.env.CONTACT_EMAIL;
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <AdminSidebar />
            <AdminHeader email={email} />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
