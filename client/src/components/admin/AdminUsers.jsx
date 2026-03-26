import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Shield, ShieldCheck, Truck, Edit2, Check, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('user');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch users', error);
            toast.error(t('admin.toasts.fetchError', 'Failed to load users'));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId) => {
        try {
            await api.put(`/users/${userId}/role`, { role: selectedRole });
            toast.success(t('admin.toasts.roleUpdated', 'Role updated successfully'));
            setEditingUserId(null);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update role', error);
            toast.error(error.response?.data?.message || t('admin.toasts.updateError', 'Failed to update role'));
        }
    };

    if (loading) {
        return <div className="animate-pulse h-64 bg-dark-secondary rounded-xl"></div>;
    }

    const roleIcons = {
        user: <User size={16} />,
        assistant: <Shield size={16} />,
        delivery: <Truck size={16} />,
        admin: <ShieldCheck size={16} />
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">{t('admin.users', 'Users')}</h2>

            <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-text-secondary border-b border-gray-800">
                            <th className="p-4">{t('auth.name', 'Name')}</th>
                            <th className="p-4">{t('auth.email', 'Email')}</th>
                            <th className="p-4">{t('admin.role', 'Role')}</th>
                            <th className="p-4">{t('admin.joined', 'Joined')}</th>
                            <th className="p-4 text-right">{t('admin.actions', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-dark-secondary transition-colors">
                                <td className="p-4 font-medium">{u.name}</td>
                                <td className="p-4 text-text-secondary">{u.email}</td>
                                <td className="p-4">
                                    {editingUserId === u._id ? (
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="bg-dark-card border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                                        >
                                            <option value="user">{t('admin.roles.user', 'User')}</option>
                                            <option value="delivery">{t('admin.roles.delivery', 'Delivery')}</option>
                                            <option value="assistant">{t('admin.roles.assistant', 'Assistant')}</option>
                                            <option value="admin">{t('admin.roles.admin', 'Admin')}</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                                                u.role === 'assistant' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    u.role === 'delivery' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        'bg-gray-500/10 text-gray-400 border-gray-600/30'}`}>
                                            {roleIcons[u.role] || <User size={16} />}
                                            <span className="capitalize">{u.role}</span>
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-text-secondary">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    {editingUserId === u._id ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleUpdateRole(u._id)}
                                                className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition"
                                                title={t('common.save', 'Save')}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => setEditingUserId(null)}
                                                className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition"
                                                title={t('common.cancel', 'Cancel')}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditingUserId(u._id);
                                                setSelectedRole(u.role);
                                            }}
                                            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition"
                                            title={t('admin.editRole', 'Edit Role')}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-text-secondary">
                        {t('admin.noUsers', 'No users found.')}
                    </div>
                )}
            </div>
        </div>
    );
}
