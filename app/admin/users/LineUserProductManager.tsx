'use client';

import { useState, useTransition } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { assignProductsToLineUser, deleteLineUser } from '@/app/actions/line';

interface LineUser {
    id: string;
    lineUserId: string;
    displayName: string | null;
    pictureUrl: string | null;
    products: {
        id: string;
        name: string;
    }[];
}

interface Product {
    id: string;
    name: string;
}

interface LineUserProductManagerProps {
    isOpen: boolean;
    onClose: () => void;
    lineUser: LineUser;
    allProducts: Product[];
}

export default function LineUserProductManager({
    isOpen,
    onClose,
    lineUser,
    allProducts,
}: LineUserProductManagerProps) {
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
        lineUser.products.map(p => p.id)
    );
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleToggleProduct = (productId: string) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSave = () => {
        startTransition(async () => {
            await assignProductsToLineUser(lineUser.id, selectedProductIds);
            onClose();
        });
    };

    const handleDelete = () => {
        if (!confirm('ต้องการลบ LINE User นี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            return;
        }

        setIsDeleting(true);
        startTransition(async () => {
            await deleteLineUser(lineUser.id);
            setIsDeleting(false);
            onClose();
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                                {lineUser.pictureUrl ? (
                                    <img src={lineUser.pictureUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-green-600 font-bold text-lg">
                                        {lineUser.displayName?.[0] || 'L'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {lineUser.displayName || 'LINE User'}
                                </h3>
                                <p className="text-sm text-gray-500">จัดการ Products</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-4">
                            เลือก Products ที่ต้องการให้ LINE User นี้ได้รับการแจ้งเตือน:
                        </p>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {allProducts.map(product => (
                                <label
                                    key={product.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedProductIds.includes(product.id)
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${selectedProductIds.includes(product.id)
                                                ? 'bg-green-500'
                                                : 'border-2 border-gray-300'
                                            }`}
                                    >
                                        {selectedProductIds.includes(product.id) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedProductIds.includes(product.id)}
                                        onChange={() => handleToggleProduct(product.id)}
                                    />
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                </label>
                            ))}
                        </div>

                        {allProducts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                ยังไม่มี Products ในระบบ
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={handleDelete}
                            disabled={isPending || isDeleting}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    กำลังลบ...
                                </span>
                            ) : (
                                'ลบ LINE User'
                            )}
                        </button>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg shadow-lg shadow-green-500/25 transition-all disabled:opacity-50"
                            >
                                {isPending && !isDeleting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังบันทึก...
                                    </span>
                                ) : (
                                    'บันทึก'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
