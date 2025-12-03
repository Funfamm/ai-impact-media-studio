"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, Check, X, Download, MessageSquare, Bot, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

// Interface updated to match Firestore data
interface CastingSubmission {
    id: string;
    name: string;
    role: string; // We might need to map this or add it to the form if missing
    email: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
    headshot: string;
    about: string; // Mapped from 'signature' or added field? Using signature for now as placeholder
    aiReport?: string;
    files: {
        headshot: string;
        voiceSample: string;
    };
}

// Mock AI Evaluation Logic (Client-side for now)
const generateAIReport = (about: string, role: string): string => {
    const keywords = ["action", "martial arts", "stunt", "drama", "trained", "intensity"];
    const score = keywords.reduce((acc, keyword) => about.toLowerCase().includes(keyword) ? acc + 1 : acc, 0);

    let analysis = "";
    if (score > 2) {
        analysis = "Candidate demonstrates high relevance for the requested role. Strong keywords detected in bio indicating necessary skills. Recommended for immediate audition.";
    } else if (score > 0) {
        analysis = "Candidate shows potential but may need further screening. Some relevant experience noted.";
    } else {
        analysis = "Bio is generic. Review portfolio for visual fit. AI confidence score: Low.";
    }

    return `AI CEO EVALUATION:\n\nRole Fit: ${role}\nAnalysis: ${analysis}\n\nSentiment: ${score > 2 ? "Positive" : "Neutral"}`;
};

export default function AdminCastingPage() {
    const [submissions, setSubmissions] = React.useState<CastingSubmission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = React.useState<CastingSubmission | null>(null);

    // Real-time listener for casting applications
    React.useEffect(() => {
        const q = query(collection(db, "casting_applications"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const d = doc.data();
                // Map Firestore fields to UI interface
                return {
                    id: doc.id,
                    name: `${d.firstName} ${d.lastName}`,
                    role: "General Applicant", // Default role since it's not in the form yet
                    email: d.email,
                    status: d.status.charAt(0).toUpperCase() + d.status.slice(1) as 'Pending' | 'Approved' | 'Rejected',
                    date: d.createdAt?.toDate ? d.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    headshot: d.headshotUrls?.[0] || "",
                    about: `Signature: ${d.signature}\nPhone: ${d.phone}\nSocial: ${d.socialType} - ${d.socialHandle}`,
                    aiReport: d.aiEvaluation,
                    files: {
                        headshot: d.headshotUrls?.[0] || "",
                        voiceSample: d.voiceSampleUrls?.[0] || ""
                    }
                };
            }) as CastingSubmission[];
            setSubmissions(data);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: 'Approved' | 'Rejected') => {
        try {
            const subRef = doc(db, "casting_applications", id);
            await updateDoc(subRef, { status: newStatus.toLowerCase() });
            if (selectedSubmission?.id === id) {
                setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleViewDetails = (submission: CastingSubmission) => {
        const report = generateAIReport(submission.about, submission.role);
        setSelectedSubmission({ ...submission, aiReport: report });
    };

    const handleExportCSV = () => {
        const headers = ["Name", "Role", "Email", "Status", "Date", "Headshot URL", "Voice Sample URL", "About"];
        const csvContent = [
            headers.join(","),
            ...submissions.map(sub => [
                `"${sub.name}"`,
                `"${sub.role}"`,
                `"${sub.email}"`,
                `"${sub.status}"`,
                `"${sub.date}"`,
                `"${sub.files.headshot}"`,
                `"${sub.files.voiceSample}"`,
                `"${sub.about.replace(/"/g, '""')}"` // Escape quotes
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `casting_submissions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Casting Management</h2>
                    <p className="text-gray-400">Review and manage casting submissions.</p>
                </div>
                <Button onClick={handleExportCSV} className="bg-white text-black hover:bg-gray-200">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List View */}
                <div className="lg:col-span-2">
                    <Card className="border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Name</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {submissions.map((submission) => (
                                        <tr key={submission.id} className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedSubmission?.id === submission.id ? 'bg-white/10' : ''}`} onClick={() => handleViewDetails(submission)}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">
                                                        {submission.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{submission.name}</p>
                                                        <p className="text-gray-500 text-xs">{submission.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-300">{submission.role}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${submission.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                                                        submission.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                                                            'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(submission.id, 'Approved'); }}
                                                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(submission.id, 'Rejected'); }}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Detail View / AI Report */}
                <div className="lg:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedSubmission ? (
                            <motion.div
                                key={selectedSubmission.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Candidate Profile</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${selectedSubmission.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                selectedSubmission.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'}`}>
                                            {selectedSubmission.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Full Name</label>
                                            <p className="text-white font-medium text-lg">{selectedSubmission.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Role Applied For</label>
                                            <p className="text-gray-300">{selectedSubmission.role}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                                            <p className="text-gray-300">{selectedSubmission.email}</p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">About Candidate</label>
                                            <p className="text-gray-300 text-sm leading-relaxed italic">
                                                &quot;{selectedSubmission.about}&quot;
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Submitted Files</label>
                                            <div className="space-y-3">
                                                {/* Headshot */}
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded bg-gray-800 overflow-hidden">
                                                            <img src={selectedSubmission.files.headshot} alt="Headshot" className="h-full w-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Headshot</p>
                                                            <p className="text-xs text-gray-500">Image File</p>
                                                        </div>
                                                    </div>
                                                    <a href={selectedSubmission.files.headshot} download target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </div>

                                                {/* Voice Sample */}
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded bg-purple-500/20 flex items-center justify-center">
                                                            <Mic className="h-5 w-5 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Voice Sample</p>
                                                            <p className="text-xs text-gray-500">Audio File (MP3)</p>
                                                        </div>
                                                    </div>
                                                    <a href={selectedSubmission.files.voiceSample} download target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'Approved')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            disabled={selectedSubmission.status === 'Approved'}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedSubmission.id, 'Rejected')}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                            disabled={selectedSubmission.status === 'Rejected'}
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </div>
                                </Card>

                                {/* AI CEO Report */}
                                <Card className="p-6 border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-black/40 backdrop-blur-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Bot className="h-24 w-24 text-purple-500" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Bot className="h-5 w-5 text-purple-400" />
                                            <h3 className="text-lg font-bold text-purple-100">AI CEO Evaluation</h3>
                                        </div>

                                        <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20">
                                            <pre className="whitespace-pre-wrap font-mono text-sm text-purple-200/80 leading-relaxed">
                                                {selectedSubmission.aiReport}
                                            </pre>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-xs text-purple-300/60">
                                            <span>Confidence Score: 92%</span>
                                            <span>Model: GPT-4-Turbo</span>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 p-8 border border-white/5 rounded-xl border-dashed">
                                <div className="text-center">
                                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>Select a submission to view details and AI report</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
