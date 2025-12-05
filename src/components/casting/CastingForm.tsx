"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "./FormSection";
import { MediaUpload } from "./MediaUpload";
import { Card } from "@/components/ui/Card";

export function CastingForm() {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [permissionGranted, setPermissionGranted] = React.useState(false);
    const [compensationAcknowledged, setCompensationAcknowledged] = React.useState(false);
    const [headshots, setHeadshots] = React.useState<File[]>([]);
    const [voiceSamples, setVoiceSamples] = React.useState<File[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (headshots.length === 0) {
            showToast("Please upload at least one professional headshot.", "error");
            return;
        }

        if (voiceSamples.length === 0) {
            showToast("Please upload a voice sample.", "error");
            return;
        }

        if (!permissionGranted) {
            showToast("Please grant permission to use submitted documents.", "error");
            return;
        }

        if (!compensationAcknowledged) {
            showToast("Please acknowledge the no financial compensation policy.", "error");
            return;
        }

        const form = e.currentTarget;
        setIsSubmitting(true);

        try {
            const formData = new FormData(form);

            // Append files manually since they are in state, not directly in the form inputs in a way FormData picks up automatically if they are custom components
            // Actually, the MediaUpload component doesn't use a named input that FormData would pick up automatically for files if it's just a div with hidden input.
            // Let's append them manually.
            headshots.forEach(file => {
                formData.append("headshots", file);
            });
            voiceSamples.forEach(file => {
                formData.append("voiceSamples", file);
            });

            // Append checkboxes manually if needed, but standard checkboxes work with FormData if they have a name.
            // The current inputs in the form need 'name' attributes for FormData to pick them up automatically.
            // I will add 'name' attributes to the inputs in the JSX as well.

            const response = await fetch("/api/casting/submit", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            showToast("Application Submitted Successfully!", "success");

            // Reset form
            form.reset();
            setHeadshots([]);
            setVoiceSamples([]);
            setPermissionGranted(false);
            setCompensationAcknowledged(false);

        } catch (error) {
            console.error(error);
            showToast(error instanceof Error ? error.message : "Something went wrong. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 md:p-12 lg:p-16">
            <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">
                    Casting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Application</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                    Join our elite roster of talent. We are looking for unique voices and faces for our next generation of AI-driven productions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Section 1: Personal Details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">01</div>
                        <h3 className="text-xl font-semibold text-white">Personal Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-300">First Name <span className="text-red-500">*</span></Label>
                            <Input id="firstName" name="firstName" placeholder="Jane" required className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-300">Last Name <span className="text-red-500">*</span></Label>
                            <Input id="lastName" name="lastName" placeholder="Doe" required className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-gray-300">Gender <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <select id="gender" name="gender" required className="flex h-14 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                    <option value="" className="bg-gray-900">Select Gender</option>
                                    <option value="female" className="bg-gray-900">Female</option>
                                    <option value="male" className="bg-gray-900">Male</option>
                                    <option value="non-binary" className="bg-gray-900">Non-binary</option>
                                    <option value="other" className="bg-gray-900">Other</option>
                                    <option value="prefer-not-to-say" className="bg-gray-900">Prefer not to say</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Email Address <span className="text-red-500">*</span></Label>
                            <Input id="email" name="email" type="email" placeholder="jane@example.com" required className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number <span className="text-gray-500 text-sm font-normal">(Optional)</span></Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="socialHandle" className="text-gray-300">Social Media Handle <span className="text-red-500">*</span></Label>
                            <Input id="socialHandle" name="socialHandle" placeholder="@username" required className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="socialType" className="text-gray-300">Platform <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <select id="socialType" name="socialType" required className="flex h-14 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 appearance-none cursor-pointer hover:bg-white/10 transition-colors">
                                    <option value="" className="bg-gray-900">Select Platform</option>
                                    <option value="instagram" className="bg-gray-900">Instagram</option>
                                    <option value="tiktok" className="bg-gray-900">TikTok</option>
                                    <option value="youtube" className="bg-gray-900">YouTube</option>
                                    <option value="twitter" className="bg-gray-900">X (Twitter)</option>
                                    <option value="linkedin" className="bg-gray-900">LinkedIn</option>
                                    <option value="other" className="bg-gray-900">Other</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="about" className="text-gray-300">Tell us about yourself <span className="text-red-500">*</span></Label>
                            <textarea
                                id="about"
                                name="about"
                                required
                                rows={4}
                                placeholder="Share your experience, skills, and what makes you unique..."
                                className="w-full rounded-lg bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Section 2: Media */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">02</div>
                        <h3 className="text-xl font-semibold text-white">Media Assets <span className="text-red-500">*</span></h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <MediaUpload
                            label="Professional Headshots"
                            accept="image/*"
                            maxFiles={3}
                            onFilesChange={setHeadshots}
                        />
                        <MediaUpload
                            label="Voice Sample (Monologue)"
                            accept="audio/mpeg"
                            maxFiles={1}
                            onFilesChange={setVoiceSamples}
                        />
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Section 3: Legal */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">03</div>
                        <h3 className="text-xl font-semibold text-white">Legal & Consent <span className="text-red-500">*</span></h3>
                    </div>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="pt-1">
                                <input
                                    type="checkbox"
                                    id="document-permission"
                                    required
                                    checked={permissionGranted}
                                    onChange={(e) => setPermissionGranted(e.target.checked)}
                                    className="h-5 w-5 rounded border-red-500/30 bg-red-500/10 text-red-500 focus:ring-red-500/50 cursor-pointer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="document-permission" className="text-base font-semibold text-red-200 cursor-pointer">
                                    Permission to Use Submitted Documents <span className="text-red-500">*</span>
                                </Label>
                                <p className="text-sm text-red-200/60 leading-relaxed">
                                    I hereby grant AI Impact Media Studio the irrevocable right and permission to use, reproduce, and distribute the submitted documents, images, and audio recordings for casting, promotional, and production purposes. I confirm that I possess all necessary rights to the submitted materials.
                                </p>
                            </div>
                        </div>

                        <div className="h-px w-full bg-red-500/10" />

                        <div className="flex items-start space-x-4">
                            <div className="pt-1">
                                <input
                                    type="checkbox"
                                    id="compensation-waiver"
                                    required
                                    checked={compensationAcknowledged}
                                    onChange={(e) => setCompensationAcknowledged(e.target.checked)}
                                    className="h-5 w-5 rounded border-red-500/30 bg-red-500/10 text-red-500 focus:ring-red-500/50 cursor-pointer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="compensation-waiver" className="text-base font-semibold text-red-200 cursor-pointer">
                                    No Financial Compensation Acknowledgement <span className="text-red-500">*</span>
                                </Label>
                                <p className="text-sm text-red-200/60 leading-relaxed">
                                    I acknowledge and agree that my participation in this casting call and any subsequent production is on a voluntary basis. I understand that there will be <strong>NO financial compensation</strong>, payment, or royalties provided for my time, likeness, or voice usage. I am participating solely for professional exposure and portfolio development.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Label htmlFor="signature" className="text-gray-300">Digital Signature <span className="text-red-500">*</span></Label>
                        <Input
                            id="signature"
                            name="signature"
                            required
                            placeholder="Type your full legal name"
                            className="h-16 font-mono text-xl bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all tracking-wider"
                        />
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            By typing your name above, you are electronically signing this application.
                        </p>
                    </div>
                </div>

                <div className="pt-8">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                    <p className="text-center text-xs text-gray-600 mt-4">
                        Protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                    </p>
                </div>
            </form>
        </div>
    );
}
