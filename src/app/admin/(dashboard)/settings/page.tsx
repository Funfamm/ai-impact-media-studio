"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Save, RefreshCw, User, Shield, Bell, Server,
    LogOut, Key, Database, Zap, Globe, Smartphone, Mail, Upload, X
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

// Simple Switch Component
const Switch = ({ checked, onCheckedChange, id }: { checked: boolean; onCheckedChange: (checked: boolean) => void; id?: string }) => (
    <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ${checked ? "bg-primary" : "bg-white/10"
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                }`}
        />
    </button>

);

// Password Confirmation Modal
const ConfirmPasswordModal = ({ isOpen, onClose, onConfirm, isSaving }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isSaving: boolean }) => {
    const [password, setPassword] = React.useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-2">Confirm Changes</h3>
                <p className="text-gray-400 mb-6">Please enter your new password to confirm these changes.</p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="secondary" onClick={onClose} className="flex-1 border-white/10 hover:bg-white/5 text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={!password || isSaving}
                            className="flex-1 bg-primary hover:bg-primary/90"
                        >
                            {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Confirm & Save
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

type Tab = "profile" | "system" | "security" | "notifications";

export default function SettingsPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = React.useState<Tab>("profile");

    // Action States
    const [isSaving, setIsSaving] = React.useState(false);
    const [isConfirmingSave, setIsConfirmingSave] = React.useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
    const [isClearingCache, setIsClearingCache] = React.useState(false);
    const [isOptimizing, setIsOptimizing] = React.useState(false);

    // Initial Mock Data (for reset)
    const initialProfile = { name: "Admin User", email: "admin@aiimpact.com", role: "Super Admin" };
    const initialSystem = { cacheEnabled: true, cdnEnabled: true, apiRateLimit: 1000, debugMode: false };
    const initialSecurity = { twoFactor: true, sessionTimeout: "30", loginNotifications: true };
    const initialNotifications = { email: true, push: false, sms: false, castingAlerts: true, sponsorAlerts: true };

    // State
    const [profile, setProfile] = React.useState(initialProfile);
    const [system, setSystem] = React.useState(initialSystem);
    const [security, setSecurity] = React.useState(initialSecurity);
    const [notifications, setNotifications] = React.useState(initialNotifications);

    // Handlers
    const handleSaveClick = () => {
        setIsConfirmingSave(true);
    };

    const handleConfirmSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setIsConfirmingSave(false);
            showToast("Settings saved successfully!", "success");
        }, 1500);
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to discard all unsaved changes?")) {
            setProfile(initialProfile);
            setSystem(initialSystem);
            setSecurity(initialSecurity);
            setNotifications(initialNotifications);
            showToast("Changes discarded.", "info");
        }
    };

    const handleAvatarChange = () => {
        // Simulate file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setIsUploadingAvatar(true);
                // Simulate upload
                setTimeout(() => {
                    setIsUploadingAvatar(false);
                    showToast("Avatar updated successfully!", "success");
                }, 1500);
            }
        };
        input.click();
    };

    const handleForgotPassword = () => {
        // Simulate sending reset email
        setTimeout(() => {
            showToast("Password reset instructions sent to admin email.", "success");
        }, 500);
    };

    const clearCache = () => {
        setIsClearingCache(true);
        setTimeout(() => {
            setIsClearingCache(false);
            showToast("Application cache cleared successfully.", "success");
        }, 2000);
    };

    const optimizeDatabase = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            showToast("Database optimization completed.", "success");
        }, 3000);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "system", label: "System & Performance", icon: Server },
        { id: "security", label: "Security", icon: Shield },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="space-y-8 relative">
            <AnimatePresence>
                {isConfirmingSave && (
                    <ConfirmPasswordModal
                        isOpen={isConfirmingSave}
                        onClose={() => setIsConfirmingSave(false)}
                        onConfirm={handleConfirmSave}
                        isSaving={isSaving}
                    />
                )}
            </AnimatePresence>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                <p className="text-gray-400">Manage application preferences, security, and performance.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="p-6 md:p-8 border-white/10 bg-black/40 backdrop-blur-sm">
                                {activeTab === "profile" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="relative">
                                                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden">
                                                        {isUploadingAvatar ? (
                                                            <RefreshCw className="h-8 w-8 animate-spin" />
                                                        ) : (
                                                            profile.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={handleAvatarChange}
                                                        className="absolute bottom-0 right-0 p-1.5 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg"
                                                        title="Change Avatar"
                                                    >
                                                        <Upload className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={handleAvatarChange}
                                                        disabled={isUploadingAvatar}
                                                        className="border-white/10 hover:bg-white/5 text-white"
                                                    >
                                                        {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                                                    </Button>
                                                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Display Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={profile.name}
                                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        value={profile.email}
                                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Input value={profile.role} disabled className="bg-white/5 border-white/10 opacity-50 cursor-not-allowed" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Key className="h-5 w-5 text-primary" /> Password
                                                </h3>
                                                <button
                                                    onClick={handleForgotPassword}
                                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPass">Current Password</Label>
                                                    <Input id="currentPass" type="password" className="bg-white/5 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPass">New Password</Label>
                                                    <Input id="newPass" type="password" className="bg-white/5 border-white/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "system" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-6">System & Performance</h3>

                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                            <Zap className="h-5 w-5 text-blue-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">Application Cache</p>
                                                            <p className="text-sm text-gray-500">Clear temporary files and cached data</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={clearCache}
                                                        disabled={isClearingCache}
                                                        variant="secondary"
                                                        className="border-white/10 hover:bg-white/5 text-white min-w-[120px]"
                                                    >
                                                        {isClearingCache ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Clear Cache"}
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                            <Database className="h-5 w-5 text-green-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">Database Optimization</p>
                                                            <p className="text-sm text-gray-500">Run vacuum and analyze operations</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={optimizeDatabase}
                                                        disabled={isOptimizing}
                                                        variant="secondary"
                                                        className="border-white/10 hover:bg-white/5 text-white min-w-[120px]"
                                                    >
                                                        {isOptimizing ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Optimize"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <h3 className="text-lg font-bold text-white mb-4">Configuration</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Content Delivery Network (CDN)</Label>
                                                        <p className="text-sm text-gray-500">Serve static assets via global edge network</p>
                                                    </div>
                                                    <Switch
                                                        checked={system.cdnEnabled}
                                                        onCheckedChange={(c) => setSystem({ ...system, cdnEnabled: c })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Debug Mode</Label>
                                                        <p className="text-sm text-gray-500">Enable verbose logging for troubleshooting</p>
                                                    </div>
                                                    <Switch
                                                        checked={system.debugMode}
                                                        onCheckedChange={(c) => setSystem({ ...system, debugMode: c })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <Label>API Rate Limit (Requests/min)</Label>
                                                        <span className="text-sm text-primary font-mono">{system.apiRateLimit}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="100"
                                                        max="5000"
                                                        step="100"
                                                        value={system.apiRateLimit}
                                                        onChange={(e) => setSystem({ ...system, apiRateLimit: parseInt(e.target.value) })}
                                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                            <Shield className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">Two-Factor Authentication</p>
                                                            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={security.twoFactor}
                                                        onCheckedChange={(c) => setSecurity({ ...security, twoFactor: c })}
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Session Timeout</Label>
                                                        <select
                                                            value={security.sessionTimeout}
                                                            onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                                            className="w-full rounded-md bg-[#0a0a0a] border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                        >
                                                            <option value="15">15 Minutes</option>
                                                            <option value="30">30 Minutes</option>
                                                            <option value="60">1 Hour</option>
                                                            <option value="240">4 Hours</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <Globe className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Chrome on Windows</p>
                                                            <p className="text-xs text-green-400">Current Session • 192.168.1.1</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Now</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <Smartphone className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm font-medium text-white">Safari on iPhone</p>
                                                            <p className="text-xs text-gray-500">New York, USA • 192.168.1.25</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">2h ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "notifications" && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                        <div className="space-y-0.5">
                                                            <Label className="text-base">Email Notifications</Label>
                                                            <p className="text-sm text-gray-500">Receive daily summaries and alerts</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={notifications.email}
                                                        onCheckedChange={(c) => setNotifications({ ...notifications, email: c })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Smartphone className="h-5 w-5 text-gray-400" />
                                                        <div className="space-y-0.5">
                                                            <Label className="text-base">Push Notifications</Label>
                                                            <p className="text-sm text-gray-500">Real-time alerts on your device</p>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        checked={notifications.push}
                                                        onCheckedChange={(c) => setNotifications({ ...notifications, push: c })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/10">
                                            <h3 className="text-lg font-bold text-white mb-4">Alert Settings</h3>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">New Casting Submissions</Label>
                                                        <p className="text-sm text-gray-500">Notify when a new candidate applies</p>
                                                    </div>
                                                    <Switch
                                                        checked={notifications.castingAlerts}
                                                        onCheckedChange={(c) => setNotifications({ ...notifications, castingAlerts: c })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Sponsor Proposals</Label>
                                                        <p className="text-sm text-gray-500">Notify when a new sponsor proposal is received</p>
                                                    </div>
                                                    <Switch
                                                        checked={notifications.sponsorAlerts}
                                                        onCheckedChange={(c) => setNotifications({ ...notifications, sponsorAlerts: c })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-8 mt-8 border-t border-white/10 flex justify-end gap-4">
                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                        className="border-white/10 hover:bg-white/5 text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                        className="bg-primary hover:bg-primary/90 min-w-[140px]"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
