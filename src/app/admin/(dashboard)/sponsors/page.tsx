"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Plus, Edit, Trash2, X, Save, ExternalLink, Check, Eye, Mail, User, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/admin/FileUpload";
import { Sponsor } from "@/types/sponsor";

// Mock Data
const initialSponsors: Sponsor[] = [
    {
        id: "1",
        name: "TechCorp Global",
        logoUrl: "",
        websiteUrl: "https://example.com",
        partnershipInterest: "Event Sponsorship",
        status: "Active",
        dateJoined: "2024-01-15",
        contactName: "Alice Johnson",
        email: "alice@techcorp.com",
        message: "We are excited to partner with AI Impact Media to drive innovation in storytelling.",
        proposalDocument: "https://example.com/proposal.pdf"
    },
    {
        id: "2",
        name: "Creative Arts Foundation",
        logoUrl: "",
        websiteUrl: "https://example.org",
        partnershipInterest: "Grant Funding",
        status: "Active",
        dateJoined: "2024-03-10",
        contactName: "Bob Smith",
        email: "bob@creativearts.org",
        message: "Supporting the next generation of creators is our mission.",
        proposalDocument: "https://example.com/grant-details.pdf"
    },
    {
        id: "3",
        name: "Future Vision Inc.",
        logoUrl: "",
        websiteUrl: "https://futurevision.io",
        partnershipInterest: "Product Placement",
        status: "Pending",
        dateJoined: "2024-12-01",
        contactName: "Charlie Davis",
        email: "charlie@futurevision.io",
        message: "Proposal: We would like to sponsor the 'AI in Cinema' documentary series. Looking forward to discussing details."
    }
];

export default function SponsorsPage() {
    const [sponsors, setSponsors] = React.useState<Sponsor[]>(initialSponsors);
    const [selectedSponsor, setSelectedSponsor] = React.useState<Sponsor | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingSponsor, setEditingSponsor] = React.useState<Sponsor | undefined>(undefined);
    const [formData, setFormData] = React.useState<Omit<Sponsor, "id" | "dateJoined">>({
        name: "",
        logoUrl: "",
        websiteUrl: "",
        partnershipInterest: "Event Sponsorship",
        status: "Pending",
        contactName: "",
        email: "",
        message: "",
        proposalDocument: ""
    });

    const resetForm = () => {
        setFormData({
            name: "",
            logoUrl: "",
            websiteUrl: "",
            partnershipInterest: "Event Sponsorship",
            status: "Pending",
            contactName: "",
            email: "",
            message: "",
            proposalDocument: ""
        });
        setEditingSponsor(undefined);
    };

    const handleAddSponsor = () => {
        const newSponsor: Sponsor = {
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
            dateJoined: new Date().toISOString().split('T')[0]
        };
        setSponsors([...sponsors, newSponsor]);
        setIsFormOpen(false);
        resetForm();
    };

    const handleEditSponsor = () => {
        if (!editingSponsor) return;
        setSponsors(sponsors.map(s => s.id === editingSponsor.id ? { ...s, ...formData } : s));
        setIsFormOpen(false);
        resetForm();
        if (selectedSponsor?.id === editingSponsor.id) {
            setSelectedSponsor({ ...editingSponsor, ...formData });
        }
    };

    const handleDeleteSponsor = (id: string) => {
        if (confirm("Are you sure you want to delete this sponsor?")) {
            setSponsors(sponsors.filter(s => s.id !== id));
            if (selectedSponsor?.id === id) setSelectedSponsor(null);
        }
    };

    const handleStatusUpdate = (id: string, newStatus: 'Active' | 'Pending' | 'Inactive') => {
        setSponsors(prev => prev.map(s =>
            s.id === id ? { ...s, status: newStatus } : s
        ));
        if (selectedSponsor?.id === id) {
            setSelectedSponsor(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const openEditForm = (sponsor: Sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name,
            logoUrl: sponsor.logoUrl,
            websiteUrl: sponsor.websiteUrl,
            partnershipInterest: sponsor.partnershipInterest,
            status: sponsor.status,
            contactName: sponsor.contactName || "",
            email: sponsor.email || "",
            message: sponsor.message || "",
            proposalDocument: sponsor.proposalDocument || ""
        });
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        resetForm();
        setIsFormOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Sponsor Management</h2>
                    <p className="text-gray-400">Review proposals and manage partnerships.</p>
                </div>
                <Button
                    onClick={openAddForm}
                    className="bg-gradient-to-r from-primary to-purple-600 border-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sponsor
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
                                        <th className="p-4 font-medium">Company</th>
                                        <th className="p-4 font-medium">Interest</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sponsors.map((sponsor) => (
                                        <tr key={sponsor.id} className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedSponsor?.id === sponsor.id ? 'bg-white/10' : ''}`} onClick={() => setSelectedSponsor(sponsor)}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                                                        {sponsor.logoUrl ? (
                                                            <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-sm font-bold text-gray-500">{sponsor.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{sponsor.name}</p>
                                                        <p className="text-gray-500 text-xs">{sponsor.dateJoined}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-gray-300 font-medium">{sponsor.partnershipInterest}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${sponsor.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                                                        sponsor.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-red-500/10 text-red-400'}`}>
                                                    {sponsor.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openEditForm(sponsor); }}
                                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteSponsor(sponsor.id); }}
                                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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

                {/* Detail View */}
                <div className="lg:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedSponsor ? (
                            <motion.div
                                key={selectedSponsor.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Sponsor Details</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                            ${selectedSponsor.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                selectedSponsor.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'}`}>
                                            {selectedSponsor.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-20 w-20 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                                            {selectedSponsor.logoUrl ? (
                                                <img src={selectedSponsor.logoUrl} alt={selectedSponsor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-gray-500">{selectedSponsor.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{selectedSponsor.name}</h2>
                                            <a href={selectedSponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                                                {selectedSponsor.websiteUrl} <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Partnership Interest</label>
                                            <p className="text-white font-medium">{selectedSponsor.partnershipInterest}</p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Contact Person</p>
                                                    <p className="text-white text-sm">{selectedSponsor.contactName || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Email Address</p>
                                                    <p className="text-white text-sm">{selectedSponsor.email || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedSponsor.proposalDocument && (
                                            <div className="pt-4 border-t border-white/10">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Proposal Document</label>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <p className="text-sm text-gray-300 truncate max-w-[200px]">
                                                        {selectedSponsor.proposalDocument.split('/').pop()}
                                                    </p>
                                                    <a href={selectedSponsor.proposalDocument} download target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {selectedSponsor.message && (
                                            <div className="pt-4 border-t border-white/10">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Proposal / Message</label>
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <p className="text-gray-300 text-sm leading-relaxed italic">
                                                        "{selectedSponsor.message}"
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedSponsor.id, 'Active')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                            disabled={selectedSponsor.status === 'Active'}
                                        >
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(selectedSponsor.id, 'Inactive')}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                            disabled={selectedSponsor.status === 'Inactive'}
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 p-8 border border-white/5 rounded-xl border-dashed">
                                <div className="text-center">
                                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>Select a sponsor to view details</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
                                <h2 className="text-xl font-bold text-white">
                                    {editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}
                                </h2>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <FileUpload
                                        label="Sponsor Logo"
                                        accept="image/*"
                                        value={formData.logoUrl}
                                        onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
                                        className="min-h-[120px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl">Website URL</Label>
                                    <Input
                                        id="websiteUrl"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partnershipInterest">Partnership Interest</Label>
                                    <select
                                        id="partnershipInterest"
                                        name="partnershipInterest"
                                        value={formData.partnershipInterest}
                                        onChange={handleChange}
                                        className="w-full rounded-md bg-[#0a0a0a] border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Event Sponsorship">Event Sponsorship</option>
                                        <option value="Product Placement">Product Placement</option>
                                        <option value="Digital Advertising">Digital Advertising</option>
                                        <option value="Grant Funding">Grant Funding</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">Contact Name</Label>
                                        <Input
                                            id="contactName"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message / Proposal</Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={3}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full rounded-md bg-white/5 border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Proposal Document</Label>
                                    <FileUpload
                                        label="Upload Proposal (PDF/DOC)"
                                        accept=".pdf,.doc,.docx"
                                        value={formData.proposalDocument || ""}
                                        onChange={(url) => setFormData(prev => ({ ...prev, proposalDocument: url }))}
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-md bg-[#0a0a0a] border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button variant="secondary" onClick={() => setIsFormOpen(false)} className="border-white/10 hover:bg-white/5 text-white">
                                        Cancel
                                    </Button>
                                    <Button onClick={editingSponsor ? handleEditSponsor : handleAddSponsor} className="bg-primary hover:bg-primary/90">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Sponsor
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
