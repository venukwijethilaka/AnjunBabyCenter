"use client";
import React, { useState, useMemo } from 'react';
import { 
    useGetUsersQuery, 
    useToggleUserStatusMutation, 
    useUpdateUserRoleMutation, 
    useGetLoyaltyLevelsQuery,
    useUpdateLoyaltyLevelMutation,
    useCreateLoyaltyLevelMutation, 
    useDeleteLoyaltyLevelMutation, 
    User, 
    Role,
    LoyaltyLevel
} from '@/state/api';
import { 
    Search, Shield, ShieldAlert, Ban, CheckCircle, Eye, User as UserIcon,
    Mail, RefreshCw, ChevronLeft, ChevronRight, Star, Settings, Save, AlertTriangle, X,
    Percent, Crown, Palette, Trophy, Plus, Trash2, Edit3, Check
} from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';

const PRESETS = [
    { from: 'rgb(146, 64, 14)', to: 'rgb(217, 119, 6)' },    { from: 'rgb(148, 163, 184)', to: 'rgb(71, 85, 105)' }, 
    { from: 'rgb(251, 191, 36)', to: 'rgb(180, 83, 9)' },   { from: 'rgb(99, 102, 241)', to: 'rgb(168, 85, 247)' }, 
    { from: 'rgb(16, 185, 129)', to: 'rgb(5, 150, 105)' },  { from: 'rgb(244, 63, 94)', to: 'rgb(225, 29, 72)' },   
    { from: 'rgb(30, 41, 59)', to: 'rgb(15, 23, 42)' },     { from: 'rgb(14, 165, 233)', to: 'rgb(3, 105, 161)' },  
    { from: 'rgb(249, 115, 22)', to: 'rgb(236, 72, 153)' }, { from: 'rgb(100, 116, 139)', to: 'rgb(51, 65, 85)' },  
    { from: 'rgb(190, 24, 93)', to: 'rgb(131, 24, 67)' },   { from: 'rgb(124, 58, 237)', to: 'rgb(76, 29, 149)' },  
    { from: 'rgb(20, 184, 166)', to: 'rgb(13, 148, 136)' }, { from: 'rgb(79, 70, 229)', to: 'rgb(67, 56, 202)' },  
    { from: 'rgb(34, 197, 94)', to: 'rgb(21, 128, 61)' },
];

const UsersPage = () => {
    // ============================
    // 1. API HOOKS
    // ============================
    const { data: users, isLoading, isFetching, isError, refetch } = useGetUsersQuery();
    const { data: loyaltyLevels, refetch: refetchLoyalty } = useGetLoyaltyLevelsQuery();
    
    const [toggleUserStatus] = useToggleUserStatusMutation();
    const [updateUserRole] = useUpdateUserRoleMutation();
    
    const [createLoyaltyLevel] = useCreateLoyaltyLevelMutation();
    const [updateLoyaltyLevel] = useUpdateLoyaltyLevelMutation();
    const [deleteLoyaltyLevel] = useDeleteLoyaltyLevelMutation();

    // ============================
    // 2. UI STATE
    // ============================
    const [activeTab, setActiveTab] = useState<'USERS' | 'LOYALTY'>('USERS');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'CUSTOMER'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 

    // ============================
    // 3. MODAL STATES
    // ============================
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [banData, setBanData] = useState({ userId: 0, userName: '', reason: '', duration: 7 });

    const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
    const [loyaltyFormData, setLoyaltyFormData] = useState<any>({
        name: '', minPoints: 0, discount: 0, colorFrom: PRESETS[0].from, colorTo: PRESETS[0].to
    });

    // ============================
    // 4. FILTERING & LOGIC
    // ============================
    const maxBarPoints = useMemo(() => {
        if (!loyaltyLevels || loyaltyLevels.length === 0) return 5000;
        const highest = Math.max(...loyaltyLevels.map(l => l.minPoints));
        return highest > 0 ? highest : 5000;
    }, [loyaltyLevels]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter((user) => {
            const lowerSearch = searchTerm.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch);
            const matchesRole = roleFilter === 'ALL' ? true : roleFilter === 'ADMIN' ? (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) : user.role === Role.CUSTOMER;
            const matchesStatus = statusFilter === 'ALL' ? true : statusFilter === 'ACTIVE' ? user.isActive : !user.isActive;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const adminCount = users?.filter(u => u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN).length || 0;

    // ============================
    // 5. HANDLERS
    // ============================
    const handleViewDetails = (user: User) => { setSelectedUser(user); setIsDetailsModalOpen(true); };
    
    const handlePromoteDemote = async (user: User) => {
        const newRole = user.role === Role.ADMIN ? Role.CUSTOMER : Role.ADMIN;
        
        if (confirm(`Change ${user.name} to ${newRole}?`)) {
            try {
                await updateUserRole({ userId: user.id, role: newRole }).unwrap();
                // Success alert
                alert(`User ${user.name} is now an ${newRole}`);
            } catch (err: any) {
                // Check if it's a 403
                if (err.status === 403) {
                    alert("Action Denied: You do not have Super Admin privileges to change roles.");
                } else {
                    alert("Failed to update role. The server might be busy.");
                }
                console.error("Promotion failed:", err);
            }
        }
    };

    const handleBanClick = (user: User) => {
        if (user.isActive) {
            setBanData({ userId: user.id, userName: user.name, reason: '', duration: 7 });
            setIsBanModalOpen(true);
        } else {
            if (confirm(`Activate ${user.name}?`)) toggleUserStatus({ userId: user.id, isActive: true });
        }
    };

    const confirmBan = async () => {
        if (!banData.reason.trim()) return alert("Reason required.");
        try {
            await toggleUserStatus({ userId: banData.userId, isActive: false, banReason: banData.reason, banDuration: banData.duration }).unwrap();
            setIsBanModalOpen(false);
        } catch { alert("Failed to ban."); }
    };

    const openCreateLoyaltyModal = () => {
        setLoyaltyFormData({ name: '', minPoints: 0, discount: 0, colorFrom: PRESETS[0].from, colorTo: PRESETS[0].to });
        setIsLoyaltyModalOpen(true);
    };

    const openEditLoyaltyModal = (level: LoyaltyLevel) => {
        const colors = level.color?.split('|') || [];
        setLoyaltyFormData({ ...level, colorFrom: colors[0] || PRESETS[0].from, colorTo: colors[1] || PRESETS[0].to });
        setIsLoyaltyModalOpen(true);
    };

    const handleDeleteTier = async (id: number) => {
        if (confirm("Are you sure you want to delete this tier?")) {
            try { await deleteLoyaltyLevel(id).unwrap(); refetchLoyalty(); } catch { alert("Failed to delete."); }
        }
    };

    const handleSaveLoyalty = async () => {
        if (!loyaltyFormData.name) return alert("Name is required");
        try {
            const payload = {
                ...loyaltyFormData,
                minPoints: Number(loyaltyFormData.minPoints),
                discount: Number(loyaltyFormData.discount),
                color: `${loyaltyFormData.colorFrom}|${loyaltyFormData.colorTo}`,
                badgeColor: "bg-gray-100"
            };
            if (loyaltyFormData.id) await updateLoyaltyLevel(payload).unwrap();
            else await createLoyaltyLevel(payload).unwrap();
            setIsLoyaltyModalOpen(false);
            refetchLoyalty();
        } catch { alert("Failed to save."); }
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

    if (isError) return (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100 flex flex-col items-center">
            <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-gray-800 text-lg font-semibold mb-2">Failed to load data</p>
            <button onClick={() => refetch()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Retry</button>
        </div>
    );

    return (
        <div className="space-y-6 min-h-screen p-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Profile Management Console</h1>
                    <div className="flex gap-6 mt-3 border-b border-gray-100">
                        <button onClick={() => setActiveTab('USERS')} className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'USERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>User Management</button>
                        <button onClick={() => setActiveTab('LOYALTY')} className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all ${activeTab === 'LOYALTY' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Loyalty System</button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Users</span>
                        <span className="text-2xl font-black text-blue-600">{users?.length || 0}</span>
                    </div>
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[100px]">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Admins</span>
                        <span className="text-2xl font-black text-purple-600">{adminCount}</span>
                    </div>
                </div>
            </div>

            {activeTab === 'USERS' ? (
                <>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                            <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-3">
                            <select className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold cursor-pointer" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}><option value="ALL">All Roles</option><option value="ADMIN">Admins</option><option value="CUSTOMER">Customers</option></select>
                            <select className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-bold cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}><option value="ALL">All Status</option><option value="ACTIVE">Active</option><option value="BANNED">Banned</option></select>
                            <button onClick={() => refetch()} disabled={isFetching} className="p-2.5 text-gray-500 hover:text-blue-600 border border-gray-200 rounded-xl hover:bg-gray-50"><RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} /></button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                        <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                                        <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md shadow-gray-200 ${user.role.includes('ADMIN') ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>{user.name.charAt(0).toUpperCase()}</div>
                                                    <div><p className="font-bold text-gray-900">{user.name}</p><div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><Mail className="w-3 h-3" /> {user.email}</div></div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                {user.role === Role.SUPER_ADMIN ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-200"><ShieldAlert className="w-3 h-3" /> Super Admin</span> :
                                                 user.role === Role.ADMIN ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-700 border border-purple-200"><Shield className="w-3 h-3" /> Admin</span> :
                                                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100"><UserIcon className="w-3 h-3" /> Customer</span>}
                                            </td>
                                            <td className="p-5">
                                                {user.isActive ? <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg border border-green-100"><CheckCircle className="w-3 h-3" /> Active</span> : <span className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded-lg border border-red-100"><Ban className="w-3 h-3" /> Suspended</span>}
                                            </td>
                                            <td className="p-5 text-right flex justify-end gap-2">
                                                <button onClick={() => handleViewDetails(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 shadow-sm"><Eye size={18} /></button>
                                                <button onClick={() => handlePromoteDemote(user)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-gray-200 shadow-sm"><Shield size={18} /></button>
                                                <button onClick={() => handleBanClick(user)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 shadow-sm"><Ban size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Page {currentPage} of {totalPages}</span><div className="flex gap-2"><button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="p-2 border rounded-lg bg-white disabled:opacity-50"><ChevronLeft className="w-4 h-4"/></button><button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="p-2 border rounded-lg bg-white disabled:opacity-50"><ChevronRight className="w-4 h-4"/></button></div></div>
                    </div>
                </>
            ) : (
                <div className="space-y-8 pb-10">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-end mb-6">
                            <div><h2 className="text-xl font-black text-gray-900">Loyalty Ladder</h2><p className="text-sm text-gray-400 mt-1">Visual progression of tiers</p></div>
                            <button onClick={openCreateLoyaltyModal} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all"><Plus size={16} /> Add New Tier</button>
                        </div>
                        <div className="relative h-4 bg-gray-100 rounded-full w-full flex items-center mt-10">
                            {loyaltyLevels?.map((level: any) => {
                                const [cFrom, cTo] = level.color?.split('|') || [PRESETS[0].from, PRESETS[0].to];
                                const percentage = (level.minPoints / maxBarPoints) * 100;
                                return (
                                    <div key={level.id} className="absolute transform -translate-x-1/2 group cursor-pointer" style={{ left: `${Math.min(percentage, 100)}%` }}>
                                        <div className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-125" style={{ backgroundImage: `linear-gradient(to right, ${cFrom}, ${cTo})` }}><Crown size={12} className="text-white" /></div>
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center opacity-50 group-hover:opacity-100 transition-opacity whitespace-nowrap"><p className="text-[10px] font-black uppercase text-gray-400">{level.name}</p><p className="text-xs font-bold text-gray-900">{level.minPoints} pts</p></div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-16 text-xs font-bold text-gray-300 uppercase tracking-widest"><span>0 Points</span><span>{maxBarPoints}+ Points</span></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {loyaltyLevels?.map((level) => {
                            const [cFrom, cTo] = level.color?.split('|') || [PRESETS[0].from, PRESETS[0].to];
                            return (
                                <div key={level.id} className="relative bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundImage: `linear-gradient(to right, ${cFrom}, ${cTo})` }}></div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundImage: `linear-gradient(to bottom right, ${cFrom}, ${cTo})` }}><Trophy size={28} /></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditLoyaltyModal(level)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Edit3 size={16} /></button>
                                                <button onClick={() => handleDeleteTier(level.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Tier Name</label><p className="text-xl font-black text-gray-900">{level.name}</p></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><label className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Star size={10} className="text-amber-500" /> Points</label><p className="text-lg font-black text-gray-800">{level.minPoints}</p></div>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100"><label className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-1"><Percent size={10} className="text-green-500" /> Discount</label><p className="text-lg font-black text-gray-800">{level.discount}%</p></div>
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

            {isBanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Ban className="text-red-500 w-6 h-6"/> Suspend User</h2>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Duration (Days)</label><input type="number" value={banData.duration} onChange={(e) => setBanData({...banData, duration: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none font-bold" min={1} /></div>
                            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason</label><textarea value={banData.reason} onChange={(e) => setBanData({...banData, reason: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 h-24 outline-none resize-none" /></div>
                            <div className="flex justify-end gap-3 pt-2"><button onClick={() => setIsBanModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button><button onClick={confirmBan} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">Confirm</button></div>
                        </div>
                    </div>
                </div>
            )}

            {isLoyaltyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200 relative">
                        <button onClick={() => setIsLoyaltyModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">{loyaltyFormData.id ? "Edit Tier" : "Create New Tier"}</h2>
                        <div className="space-y-5">
                            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tier Name</label><input className="w-full bg-gray-50 border rounded-xl p-3 outline-none font-bold" value={loyaltyFormData.name} onChange={(e) => setLoyaltyFormData({...loyaltyFormData, name: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Min Points</label><input type="number" className="w-full bg-gray-50 border rounded-xl p-3 outline-none" value={loyaltyFormData.minPoints} onChange={(e) => setLoyaltyFormData({...loyaltyFormData, minPoints: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discount %</label><input type="number" className="w-full bg-gray-50 border rounded-xl p-3 outline-none" value={loyaltyFormData.discount} onChange={(e) => setLoyaltyFormData({...loyaltyFormData, discount: e.target.value})} /></div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Color Palette</label>
                                <div className="grid grid-cols-5 gap-3">
                                    {PRESETS.map((p, idx) => (
                                        <button key={idx} type="button" onClick={() => setLoyaltyFormData({...loyaltyFormData, colorFrom: p.from, colorTo: p.to})} className={`h-10 rounded-xl border-2 transition-all shadow-sm flex items-center justify-center ${loyaltyFormData.colorFrom === p.from ? 'border-blue-600 scale-110' : 'border-gray-100 hover:border-gray-300'}`} style={{ backgroundImage: `linear-gradient(to bottom right, ${p.from}, ${p.to})` }}>
                                            {loyaltyFormData.colorFrom === p.from && <Check size={14} className="text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handleSaveLoyalty} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all mt-4">{loyaltyFormData.id ? "Update Tier" : "Create Tier"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;