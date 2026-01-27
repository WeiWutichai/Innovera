'use client';

import { useState } from 'react';
import { MessageCircle, Trash2, ChevronRight } from 'lucide-react';
import LineUserProductManager from './LineUserProductManager';

interface LineUser {
    id: string;
    lineUserId: string;
    displayName: string | null;
    pictureUrl: string | null;
    createdAt: Date;
    products: {
        id: string;
        name: string;
    }[];
}

interface Product {
    id: string;
    name: string;
}

interface LineUserListProps {
    lineUsers: LineUser[];
    allProducts: Product[];
}

export default function LineUserList({ lineUsers, allProducts }: LineUserListProps) {
    const [selectedUser, setSelectedUser] = useState<LineUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleManageProducts = (user: LineUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (lineUsers.length === 0) {
        return (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">ยังไม่มี LINE Users</h3>
                    <p className="text-gray-500 text-sm">
                        เมื่อมีผู้ใช้เพิ่ม LINE OA เป็นเพื่อน จะแสดงที่นี่
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                        <tr>
                            <th className="p-5">LINE User</th>
                            <th className="p-5">Products</th>
                            <th className="p-5">เพิ่มเพื่อนเมื่อ</th>
                            <th className="p-5 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {lineUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                                        {user.pictureUrl ? (
                                            <img src={user.pictureUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <MessageCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900 block">
                                            {user.displayName || 'ไม่ทราบชื่อ'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {user.lineUserId.substring(0, 8)}...
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {user.products.length > 0 ? (
                                            user.products.map(product => (
                                                <span
                                                    key={product.id}
                                                    className="px-2 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-600 border border-green-100"
                                                >
                                                    {product.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">ยังไม่ได้กำหนด</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5 text-gray-600 text-sm">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="p-5 text-right">
                                    <button
                                        onClick={() => handleManageProducts(user)}
                                        className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                                    >
                                        <span>จัดการ</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <LineUserProductManager
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedUser(null);
                    }}
                    lineUser={selectedUser}
                    allProducts={allProducts}
                />
            )}
        </>
    );
}
