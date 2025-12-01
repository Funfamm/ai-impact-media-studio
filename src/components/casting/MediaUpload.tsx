"use client";

import * as React from "react";
import { Upload, X, FileAudio, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MediaUploadProps {
    label: string;
    accept?: string;
    maxFiles?: number;
    onFilesChange?: (files: File[]) => void;
}

export function MediaUpload({ label, accept = "image/*,audio/mpeg", maxFiles = 3, onFilesChange }: MediaUploadProps) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const updateFiles = (newFiles: File[]) => {
        setFiles(newFiles);
        onFilesChange?.(newFiles);
    };

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
            const currentFiles = [...files];
            const addedFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles - currentFiles.length);
            updateFiles([...currentFiles, ...addedFiles]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const currentFiles = [...files];
            const addedFiles = Array.from(e.target.files).slice(0, maxFiles - currentFiles.length);
            updateFiles([...currentFiles, ...addedFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        updateFiles(newFiles);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 md:p-10 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[200px] active:scale-[0.99] transition-transform",
                    isDragging
                        ? "border-primary bg-primary/10"
                        : "border-border bg-surface hover:bg-surface-hover"
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    multiple
                    onChange={handleFileSelect}
                />
                <div className="h-12 w-12 rounded-full bg-surface-hover flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-300 font-medium mb-1">
                    Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mb-2">
                    Images (JPG, PNG) or Audio (MP3 only)
                </p>
                {accept.includes("audio") && (
                    <p className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">
                        ⚠️ Please ensure audio has NO background noise
                    </p>
                )}
            </div>

            <AnimatePresence>
                {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {file.type.startsWith("audio") ? (
                                        <FileAudio className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    ) : (
                                        <ImageIcon className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                    )}
                                    <span className="text-sm text-gray-300 truncate">{file.name}</span>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-400" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
