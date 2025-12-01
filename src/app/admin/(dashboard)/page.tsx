"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Film, DollarSign, TrendingUp } from "lucide-react";

const stats = [
    {
        title: "Total Revenue",
        value: "$12,345",
        change: "+12%",
        icon: DollarSign,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "Active Users",
        value: "1,234",
        change: "+5%",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Total Movies",
        value: "45",
        change: "+2",
        icon: Film,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "Growth Rate",
        value: "24%",
        change: "+4%",
        icon: TrendingUp,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    }
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
                <p className="text-gray-400">Welcome back to the command center.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="text-green-400 text-sm font-medium bg-green-500/10 px-2 py-1 rounded">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors">View All</Button>
                </div>
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {[
                        {
                            type: "user",
                            title: "New User Registration",
                            desc: "Sarah Connor joined the platform",
                            time: "2 min ago",
                            icon: Users,
                            color: "text-blue-400",
                            bg: "bg-blue-500/10",
                            href: "/admin/settings" // Placeholder for Users
                        },
                        {
                            type: "submission",
                            title: "Casting Submission",
                            desc: "New application for 'Lead Protagonist'",
                            time: "15 min ago",
                            icon: Film,
                            color: "text-purple-400",
                            bg: "bg-purple-500/10",
                            href: "/admin/casting"
                        },
                        {
                            type: "sponsor",
                            title: "Sponsor Proposal",
                            desc: "TechCorp Global submitted a proposal",
                            time: "1 hour ago",
                            icon: DollarSign,
                            color: "text-green-400",
                            bg: "bg-green-500/10",
                            href: "/admin/sponsors"
                        },
                        {
                            type: "system",
                            title: "System Update",
                            desc: "Automated backup completed successfully",
                            time: "3 hours ago",
                            icon: TrendingUp,
                            color: "text-orange-400",
                            bg: "bg-orange-500/10",
                            href: "/admin/settings"
                        },
                        {
                            type: "user",
                            title: "New User Registration",
                            desc: "John Reese joined the platform",
                            time: "5 hours ago",
                            icon: Users,
                            color: "text-blue-400",
                            bg: "bg-blue-500/10",
                            href: "/admin/settings"
                        }
                    ].map((activity, i) => (
                        <div key={i} className="relative flex gap-4 group">
                            <div className={`absolute left-0 h-10 w-10 rounded-full ${activity.bg} flex items-center justify-center border border-black ring-4 ring-black z-10 group-hover:scale-110 transition-transform`}>
                                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1 pl-12">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">{activity.title}</p>
                                    <span className="text-xs text-gray-500 font-mono">{activity.time}</span>
                                </div>
                                <p className="text-gray-400 text-xs leading-relaxed mb-2">{activity.desc}</p>
                                <a
                                    href={activity.href}
                                    className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    View Details &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6">System Status</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Server Load</span>
                            <span className="text-green-400">24%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[24%] bg-green-500 rounded-full" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Memory Usage</span>
                            <span className="text-blue-400">58%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[58%] bg-blue-500 rounded-full" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-400">Storage</span>
                            <span className="text-purple-400">82%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[82%] bg-purple-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>

    );
}
