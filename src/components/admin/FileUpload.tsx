"use client";

import * as React from "react";
import { Upload, X, FileVideo, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    label: string;
    accept?: string;
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export function FileUpload({ label, accept = "image/*", value, onChange, className }: FileUploadProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setIsUploading(true);
        setProgress(0);

        // Simulate upload
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    // Create a fake URL for the uploaded file
                    const fakeUrl = URL.createObjectURL(file);
                    onChange(fakeUrl);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setProgress(0);
    };

    return (
        <div className={cn("w-full", className)}>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div
                onClick={() => !value && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[160px]",
                    isDragging ? "border-primary bg-primary/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                    value ? "border-green-500/50 bg-green-500/5" : ""
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileSelect}
                />

                <AnimatePresence mode="wait">
                    {isUploading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3 w-full max-w-[200px]"
                        >
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400">Uploading... {progress}%</p>
                        </motion.div>
                    ) : value ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                    File Uploaded
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Click remove to change</p>
                            </div>
                            <button
                                onClick={handleRemove}
                                className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs hover:bg-red-500/20 transition-colors"
                            >
                                Remove File
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                {accept.includes("video") ? (
                                    <FileVideo className="h-6 w-6 text-gray-400" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <p className="text-sm text-gray-300 font-medium">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                {accept.includes("video") ? "MP4, WebM (Max 500MB)" : "JPG, PNG (Max 10MB)"}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
