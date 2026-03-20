"use client";
import React, { useState, useMemo } from 'react';
import {
    useGetUsersQuery, useToggleUserStatusMutation, useUpdateUserRoleMutation,
    useGetLoyaltyLevelsQuery, useUpdateLoyaltyLevelMutation, useCreateLoyaltyLevelMutation,
    useDeleteLoyaltyLevelMutation, User, Role, LoyaltyLevel
} from '@/state/api';
import {
    Search, Shield, ShieldAlert, Ban, CheckCircle, Eye, User as UserIcon,
    Mail, RefreshCw, ChevronLeft, ChevronRight, Star, Settings, Save, AlertTriangle, X,
    Percent, Crown, Palette, Trophy, Plus, Trash2, Edit3, Check
} from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';

const PRESETS = [
    { from: 'rgb(146, 64, 14)', to: 'rgb(217, 119, 6)' }, { from: 'rgb(148, 163, 184)', to: 'rgb(71, 85, 105)' },
    { from: 'rgb(251, 191, 36)', to: 'rgb(180, 83, 9)' }, { from: 'rgb(99, 102, 241)', to: 'rgb(168, 85, 247)' },
    { from: 'rgb(16, 185, 129)', to: 'rgb(5, 150, 105)' }, { from: 'rgb(244, 63, 94)', to: 'rgb(225, 29, 72)' },
    { from: 'rgb(30, 41, 59)', to: 'rgb(15, 23, 42)' }, { from: 'rgb(14, 165, 233)', to: 'rgb(3, 105, 161)' },
    { from: 'rgb(249, 115, 22)', to: 'rgb(236, 72, 153)' }, { from: 'rgb(100, 116, 139)', to: 'rgb(51, 65, 85)' },
    { from: 'rgb(190, 24, 93)', to: 'rgb(131, 24, 67)' }, { from: 'rgb(124, 58, 237)', to: 'rgb(76, 29, 149)' },
    { from: 'rgb(20, 184, 166)', to: 'rgb(13, 148, 136)' }, { from: 'rgb(79, 70, 229)', to: 'rgb(67, 56, 202)' },
    { from: 'rgb(34, 197, 94)', to: 'rgb(21, 128, 61)' },
];

const UsersPage = () => {
    const { data: users = [], isLoading, isFetching, isError, refetch } = useGetUsersQuery();
    const { data: loyaltyLevels = [], refetch: refetchLoyalty } = useGetLoyaltyLevelsQuery();
    const [toggleUserStatus] = useToggleUserStatusMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [createLoyaltyLevel] = useCreateLoyaltyLevelMutation();
    const [updateLoyaltyLevel] = useUpdateLoyaltyLevelMutation();
    const [deleteLoyaltyLevel] = useDeleteLoyaltyLevelMutation();

    const [activeTab, setActiveTab] = useState<'USERS' | 'LOYALTY'>('USERS');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'CUSTOMER'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banData, setBanData] = useState({ userId: 0, userName: '', reason: '', duration: 7 });
    const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
    const [loyaltyFormData, setLoyaltyFormData] = useState<any>({ name: '', minPoints: 0, discount: 0, colorFrom: PRESETS[0].from, colorTo: PRESETS[0].to });

    const maxBarPoints = useMemo(() => {
        if (!loyaltyLevels || loyaltyLevels.length === 0) return 5000;
        const highest = Math.max(...loyaltyLevels.map(l => l.minPoints));
        return highest > 0 ? highest : 5000;
    }, [loyaltyLevels]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return (users || []).filter((user) => {
            const lower = searchTerm.toLowerCase();
            const matchesSearch = (user.name?.toLowerCase() ?? "").includes(lower) || (user.email?.toLowerCase() ?? "").includes(lower);
            const matchesRole = roleFilter === 'ALL' ? true : roleFilter === 'ADMIN' ? (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) : user.role === Role.CUSTOMER;
            const matchesStatus = statusFilter === 'ALL' ? true : statusFilter === 'ACTIVE' ? user.isActive : !user.isActive;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const adminCount = users?.filter(u => u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN).length || 0;

    const handleViewDetails = (user: User) => { setSelectedUser(user); setIsDetailsModalOpen(true); };
    const handlePromoteDemote = async (user: User) => {
        const newRole = user.role === Role.ADMIN ? Role.CUSTOMER : Role.ADMIN;
        if (confirm(`Change ${user.name} to ${newRole}?`)) {
            try { await updateUserRole({ userId: user.id, role: newRole }).unwrap(); alert(`User ${user.name} is now ${newRole}`); }
            catch (err: any) { alert(err.status === 403 ? "Access Denied: Super Admin required." : "Failed to update role."); }
        }
    };
    const handleBanClick = (user: User) => {
        if (user.isActive) { setBanData({ userId: user.id, userName: user.name ?? 'User', reason: '', duration: 7 }); setIsBanModalOpen(true); }
        else { if (confirm(`Activate ${user.name ?? 'this user'}?`)) toggleUserStatus({ userId: user.id, isActive: true }); }
    };
    const confirmBan = async () => {
        if (!banData.reason.trim()) return alert("Reason required.");
        try { await toggleUserStatus({ userId: banData.userId, isActive: false, banReason: banData.reason, banDuration: banData.duration }).unwrap(); setIsBanModalOpen(false); }
        catch { alert("Failed to ban."); }
    };
    const openCreateLoyaltyModal = () => { setLoyaltyFormData({ name: '', minPoints: 0, discount: 0, colorFrom: PRESETS[0].from, colorTo: PRESETS[0].to }); setIsLoyaltyModalOpen(true); };
    const openEditLoyaltyModal = (level: LoyaltyLevel) => {
        const colors = level.color?.split('|') || [];
        setLoyaltyFormData({ ...level, colorFrom: colors[0] || PRESETS[0].from, colorTo: colors[1] || PRESETS[0].to });
        setIsLoyaltyModalOpen(true);
    };
    const handleDeleteTier = async (id: number) => { if (confirm("Delete this tier?")) { try { await deleteLoyaltyLevel(id).unwrap(); refetchLoyalty(); } catch { alert("Failed."); } } };
    const handleSaveLoyalty = async () => {
        if (!loyaltyFormData.name) return alert("Name required");
        try {
            const payload = { ...loyaltyFormData, minPoints: Number(loyaltyFormData.minPoints), discount: Number(loyaltyFormData.discount), color: `${loyaltyFormData.colorFrom}|${loyaltyFormData.colorTo}`, badgeColor: "bg-gray-100" };
            if (loyaltyFormData.id) await updateLoyaltyLevel(payload).unwrap();
            else await createLoyaltyLevel(payload).unwrap();
            setIsLoyaltyModalOpen(false); refetchLoyalty();
        } catch { alert("Failed to save."); }
    };

    if (isLoading) return (
        <div className="flex min-h-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <p className="text-blue-600 font-bold">Loading Users…</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="p-8 m-6 text-center bg-white rounded-[28px] shadow-sm border border-red-100 flex flex-col items-center gap-3">
            <ShieldAlert className="w-12 h-12 text-red-500" />
            <p className="text-slate-800 text-lg font-bold">Failed to load data</p>
            <button onClick={() => refetch()} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
            </button>
        </div>
    );

    return (
        <div className="min-h-full bg-slate-50">
            <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">

                {/* ── Header ── */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <UserIcon className="w-7 h-7 text-blue-600" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-800">User Management</h1>
                        </div>
                        {/* Tabs */}
                        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                            <button onClick={() => setActiveTab('USERS')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'USERS' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                                Users
                            </button>
                            <button onClick={() => setActiveTab('LOYALTY')} className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all ${activeTab === 'LOYALTY' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                                <Trophy size={14} /> Loyalty
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-blue-50 flex flex-col items-center min-w-[100px]">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Users</span>
                            <span className="text-2xl font-black text-blue-600">{users?.length || 0}</span>
                        </div>
                        <div className="bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-blue-50 flex flex-col items-center min-w-[100px]">
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Admins</span>
                            <span className="text-2xl font-black text-blue-700">{adminCount}</span>
                        </div>
                    </div>
                </header>

                {activeTab === 'USERS' ? (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-[24px] border border-blue-50 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative w-full md:flex-1 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
                                <input type="text" placeholder="Search by name or email…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-13 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none font-medium transition-all" style={{ paddingLeft: '3.25rem' }} />
                            </div>
                            <div className="flex gap-3">
                                <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-200 outline-none" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                                    <option value="ALL">All Roles</option><option value="ADMIN">Admins</option><option value="CUSTOMER">Customers</option>
                                </select>
                                <select className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm font-bold focus:ring-2 focus:ring-blue-200 outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                                    <option value="ALL">All Status</option><option value="ACTIVE">Active</option><option value="BANNED">Banned</option>
                                </select>
                                <button onClick={() => refetch()} disabled={isFetching} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-2xl transition-colors">
                                    <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-blue-50/60 border-b border-blue-100">
                                    <tr>
                                        {['User Details', 'Role', 'Status', 'Actions'].map((h, i) => (
                                            <th key={h} className={`p-5 text-xs font-black text-blue-600 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white shadow-md ${user.role?.includes('ADMIN') ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                                                        {user.name?.[0]?.toUpperCase() ?? "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{user.name}</p>
                                                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium"><Mail className="w-3 h-3" /> {user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                {user.role === Role.SUPER_ADMIN
                                                    ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-900 text-white border border-blue-700"><ShieldAlert className="w-3 h-3" /> Super Admin</span>
                                                    : user.role === Role.ADMIN
                                                        ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-700 border border-blue-200"><Shield className="w-3 h-3" /> Admin</span>
                                                        : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200"><UserIcon className="w-3 h-3" /> Customer</span>}
                                            </td>
                                            <td className="p-5">
                                                {user.isActive
                                                    ? <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-3 py-1.5 rounded-xl border border-green-100"><CheckCircle className="w-3 h-3" /> Active</span>
                                                    : <span className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"><Ban className="w-3 h-3" /> Suspended</span>}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleViewDetails(user)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all active:scale-95"><Eye size={16} /></button>
                                                    <button onClick={() => handlePromoteDemote(user)} className="p-2.5 bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white rounded-xl transition-all active:scale-95"><Shield size={16} /></button>
                                                    <button onClick={() => handleBanClick(user)} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95"><Ban size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Page {currentPage} of {totalPages || 1}</span>
                                <div className="flex gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-blue-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-blue-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* ── LOYALTY TAB ── */
                    <div className="space-y-8 pb-10">
                        {/* Progress bar */}
                        <div className="bg-white rounded-[28px] border border-blue-50 shadow-sm p-8">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800">Loyalty Ladder</h2>
                                    <p className="text-sm text-slate-400 mt-1">Visual progression of tiers</p>
                                </div>
                                <button onClick={openCreateLoyaltyModal} className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all active:scale-95">
                                    <Plus size={16} /> Add New Tier
                                </button>
                            </div>
                            <div className="relative h-4 bg-slate-100 rounded-full w-full flex items-center mt-10">
                                {loyaltyLevels?.map((level: any) => {
                                    const [cFrom, cTo] = level.color?.split('|') || [PRESETS[0].from, PRESETS[0].to];
                                    const percentage = (level.minPoints / maxBarPoints) * 100;
                                    return (
                                        <div key={level.id} className="absolute transform -translate-x-1/2 group cursor-pointer" style={{ left: `${Math.min(percentage, 100)}%` }}>
                                            <div className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-125" style={{ backgroundImage: `linear-gradient(to right, ${cFrom}, ${cTo})` }}>
                                                <Crown size={12} className="text-white" />
                                            </div>
                                            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                <p className="text-[10px] font-black uppercase text-slate-400">{level.name}</p>
                                                <p className="text-xs font-bold text-slate-800">{level.minPoints} pts</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-16 text-xs font-bold text-slate-300 uppercase tracking-widest">
                                <span>0 Points</span><span>{maxBarPoints}+ Points</span>
                            </div>
                        </div>

                        {/* Tier cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loyaltyLevels?.map((level) => {
                                const [cFrom, cTo] = level.color?.split('|') || [PRESETS[0].from, PRESETS[0].to];
                                return (
                                    <div key={level.id} className="relative bg-white rounded-[28px] border border-blue-50 shadow-sm overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundImage: `linear-gradient(to right, ${cFrom}, ${cTo})` }} />
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundImage: `linear-gradient(to bottom right, ${cFrom}, ${cTo})` }}>
                                                    <Trophy size={26} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditLoyaltyModal(level)} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={15} /></button>
                                                    <button onClick={() => handleDeleteTier(level.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={15} /></button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Tier Name</label>
                                                <p className="text-xl font-black text-slate-800">{level.name}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1"><Star size={10} className="text-amber-500" /> Points</label>
                                                    <p className="text-lg font-black text-slate-800">{level.minPoints}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1"><Percent size={10} className="text-green-500" /> Discount</label>
                                                    <p className="text-lg font-black text-slate-800">{level.discount}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <UserDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} user={selectedUser} />

                {/* Ban Modal */}
                {isBanModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                        <div className="bg-white rounded-[28px] shadow-2xl p-8 w-full max-w-md">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-red-50 rounded-2xl"><Ban className="text-red-500 w-6 h-6" /></div>
                                <h2 className="text-xl font-black text-slate-800">Suspend User</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration (Days)</label>
                                    <input type="number" value={banData.duration} onChange={(e) => setBanData({ ...banData, duration: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold focus:ring-2 focus:ring-blue-200 transition-all" min={1} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Reason</label>
                                    <textarea value={banData.reason} onChange={(e) => setBanData({ ...banData, reason: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-24 outline-none resize-none font-medium focus:ring-2 focus:ring-blue-200 transition-all" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setIsBanModalOpen(false)} className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Cancel</button>
                                    <button onClick={confirmBan} className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-black shadow-lg hover:bg-red-600 transition-all active:scale-95">Confirm Suspend</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loyalty Modal */}
                {isLoyaltyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                        <div className="bg-white rounded-[28px] shadow-2xl p-8 w-full max-w-md relative">
                            <button onClick={() => setIsLoyaltyModalOpen(false)} className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-colors"><X size={18} /></button>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 rounded-2xl"><Trophy className="w-6 h-6 text-blue-600" /></div>
                                <h2 className="text-xl font-black text-slate-800">{loyaltyFormData.id ? "Edit Tier" : "Create New Tier"}</h2>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tier Name</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none font-bold focus:ring-2 focus:ring-blue-200 transition-all" value={loyaltyFormData.name} onChange={(e) => setLoyaltyFormData({ ...loyaltyFormData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Min Points</label>
                                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 transition-all" value={loyaltyFormData.minPoints} onChange={(e) => setLoyaltyFormData({ ...loyaltyFormData, minPoints: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Discount %</label>
                                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-200 transition-all" value={loyaltyFormData.discount} onChange={(e) => setLoyaltyFormData({ ...loyaltyFormData, discount: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Color Palette</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {PRESETS.map((p, idx) => (
                                            <button key={idx} type="button" onClick={() => setLoyaltyFormData({ ...loyaltyFormData, colorFrom: p.from, colorTo: p.to })}
                                                className={`h-10 rounded-xl border-2 transition-all shadow-sm flex items-center justify-center ${loyaltyFormData.colorFrom === p.from ? 'border-blue-600 scale-110' : 'border-transparent hover:border-slate-300'}`}
                                                style={{ backgroundImage: `linear-gradient(to bottom right, ${p.from}, ${p.to})` }}>
                                                {loyaltyFormData.colorFrom === p.from && <Check size={14} className="text-white drop-shadow-md" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleSaveLoyalty} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                                    {loyaltyFormData.id ? "Update Tier" : "Create Tier"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;