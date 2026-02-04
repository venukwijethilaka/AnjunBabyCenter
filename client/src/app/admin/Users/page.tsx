"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
  useUpdateUserRoleMutation,
  User,
  Role,
} from "@/state/api";
import {
  Search,
  Shield,
  Ban,
  CheckCircle,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Users as UsersIcon,
  ShieldCheck,
  MoreVertical,
} from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";

const getDisplayName = (user: User) => user.name ?? user.email.split('@')[0];
const getInitial = (user: User) => getDisplayName(user).charAt(0).toUpperCase();

const UsersPage = () => {
  const { data: users, isLoading, isFetching, isError, refetch } = useGetUsersQuery();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "CUSTOMER">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BANNED">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Reset to first page whenever filters change
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        getDisplayName(user).toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "ALL"
          ? true
          : roleFilter === "ADMIN"
          ? user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN
          : user.role === Role.CUSTOMER;

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? user.isActive
          : !user.isActive;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePromoteDemote = async (user: User) => {
    const newRole = user.role === Role.ADMIN ? Role.CUSTOMER : Role.ADMIN;
    if (confirm(`Are you sure you want to change ${getDisplayName(user)}'s role to ${newRole}?`)) {
      await updateUserRole({ userId: user.id, role: newRole }).unwrap();
    }
  };

  const handleBanUnban = async (user: User) => {
    const action = user.isActive ? 'ban' : 'unban';
    if (confirm(`Are you sure you want to ${action} ${getDisplayName(user)}?`)) {
      await toggleUserStatus({ userId: user.id, isActive: !user.isActive }).unwrap();
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const roleUI = {
    [Role.ADMIN]: { icon: ShieldCheck, color: "text-blue-500", label: "Admin" },
    [Role.CUSTOMER]: { icon: UsersIcon, color: "text-gray-500", label: "Customer" },
    [Role.SUPER_ADMIN]: { icon: ShieldCheck, color: "text-green-600", label: "Super Admin" },
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UsersIcon className="text-gray-500" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-gray-600">Role:</label>
              <select onChange={(e) => setRoleFilter(e.target.value as any)} value={roleFilter} className="flex-1 p-2 border border-gray-300 rounded-lg">
                <option value="ALL">All</option>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold text-gray-600">Status:</label>
              <select onChange={(e) => setStatusFilter(e.target.value as any)} value={statusFilter} className="flex-1 p-2 border border-gray-300 rounded-lg">
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading users...</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">Error loading users.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUsers.map((user) => {
                const RoleInfo = roleUI[user.role] || roleUI[Role.CUSTOMER];
                return (
                  <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">{getInitial(user)}</div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-gray-800 truncate">{getDisplayName(user)}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className={`flex items-center gap-2 font-semibold ${RoleInfo.color}`}>
                        <RoleInfo.icon size={16} />
                        <span>{RoleInfo.label}</span>
                      </div>
                      <div className={`flex items-center gap-2 font-semibold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {user.isActive ? <CheckCircle size={16} /> : <Ban size={16} />}
                        <span>{user.isActive ? 'Active' : 'Banned'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => viewUserDetails(user)} className="flex-1 text-sm flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <Eye size={16}/> View
                        </button>
                        <button disabled={isUpdatingRole} onClick={() => handlePromoteDemote(user)} className="flex-1 text-sm flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            <Shield size={16}/> Role
                        </button>
                        <button disabled={isTogglingStatus} onClick={() => handleBanUnban(user)} className="flex-1 text-sm flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                           <Ban size={16}/> Status
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {paginatedUsers.length === 0 && (
                <div className="text-center py-20 col-span-full">
                    <UsersIcon className="mx-auto text-gray-300" size={48} />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">No Users Found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-semibold text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
