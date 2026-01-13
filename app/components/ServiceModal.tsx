"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Monitor, Code2, Layers, Zap, Search, Share2, Star, Image as ImageIcon, UploadCloud, Shield, Compass, FileSearch } from "lucide-react";
import { useEffect } from "react";

// Map string icon names to Lucide components
const iconMap: { [key: string]: any } = {
    monitor: Monitor,
    "code-2": Code2,
    layers: Layers,
    zap: Zap,
    search: Search,
    "share-2": Share2,
    star: Star,
    image: ImageIcon,
    "upload-cloud": UploadCloud,
    shield: Shield,
    compass: Compass,
    "file-search": FileSearch,
};

// Define types for the service data structure
interface ServiceFeature {
    title: string;
    icon: string;
    desc: string;
    items: string[];
}

interface ServiceTable {
    headers: string[];
    rows: string[][];
}

interface ServiceData {
    title: string;
    desc: string;
    subtitle?: string; // Made optional as it wasn't in the original simple cards
    color?: string;    // Made optional
    features?: ServiceFeature[];
    table?: ServiceTable;
}

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: ServiceData | null;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!service) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-start sticky top-0 bg-secondary z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/80">{service.subtitle}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                    {service.desc}
                                </p>

                                {/* Features Grid */}
                                {service.features && (
                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        {service.features.map((feature, idx) => {
                                            const Icon = iconMap[feature.icon] || Star;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-primary/20 transition-colors"
                                                >
                                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-white border border-gray-200 shadow-sm">
                                                        <Icon className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-secondary mb-2">
                                                        {feature.title}
                                                    </h4>
                                                    <p className="text-gray-600 text-sm mb-4">
                                                        {feature.desc}
                                                    </p>
                                                    <ul className="space-y-2">
                                                        {feature.items.map((item, i) => (
                                                            <li key={i} className="flex items-center text-sm text-gray-700">
                                                                <Check className="w-4 h-4 mr-2 text-primary" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Pricing Table */}
                                {service.table && (
                                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs uppercase bg-secondary text-white border-b border-gray-200">
                                                <tr>
                                                    {service.table.headers.map((header, idx) => (
                                                        <th key={idx} className="px-6 py-4 font-bold tracking-wider">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {service.table.rows.map((row, rowIdx) => (
                                                    <tr key={rowIdx} className="bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                                        {row.map((cell, cellIdx) => (
                                                            <td
                                                                key={cellIdx}
                                                                className={`px-6 py-4 ${cellIdx === 0 ? "font-bold text-secondary" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 rounded-lg text-white font-medium transition-colors shadow-lg shadow-primary/20 bg-primary hover:bg-primary-hover"
                                >
                                    Close
                                </button>

                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ServiceModal;
