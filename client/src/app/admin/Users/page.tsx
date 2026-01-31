"use client";

import React, { useState, useMemo } from "react";
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
  LoyaltyLevel,
} from "@/state/api";

import {
  Search,
  Shield,
  ShieldAlert,
  Ban,
  CheckCircle,
  Eye,
  User as UserIcon,
  Mail,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Percent,
  Crown,
  Trophy,
  Plus,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";

import UserDetailsModal from "./UserDetailsModal";

/* ---------------- HELPERS (CRITICAL FIX) ---------------- */
const getDisplayName = (user: User) => user.name ?? user.email;
const getInitial = (user: User) => getDisplayName(user).charAt(0).toUpperCase();

/* ---------------- CONSTANTS ---------------- */
const PRESETS = [
  { from: "rgb(146, 64, 14)", to: "rgb(217, 119, 6)" },
  { from: "rgb(148, 163, 184)", to: "rgb(71, 85, 105)" },
  { from: "rgb(251, 191, 36)", to: "rgb(180, 83, 9)" },
  { from: "rgb(99, 102, 241)", to: "rgb(168, 85, 247)" },
  { from: "rgb(16, 185, 129)", to: "rgb(5, 150, 105)" },
];

/* ========================================================= */

const UsersPage = () => {
  /* ---------------- API ---------------- */
  const { data: users, isLoading, isFetching, isError, refetch } =
    useGetUsersQuery();
  const { data: loyaltyLevels, refetch: refetchLoyalty } =
    useGetLoyaltyLevelsQuery();

  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [createLoyaltyLevel] = useCreateLoyaltyLevelMutation();
  const [updateLoyaltyLevel] = useUpdateLoyaltyLevelMutation();
  const [deleteLoyaltyLevel] = useDeleteLoyaltyLevelMutation();

  /* ---------------- STATE ---------------- */
  const [activeTab, setActiveTab] = useState<"USERS" | "LOYALTY">("USERS");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<"ALL" | "ADMIN" | "CUSTOMER">("ALL");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | "ACTIVE" | "BANNED">("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banData, setBanData] = useState({
    userId: 0,
    userName: "",
    reason: "",
    duration: 7,
  });

  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [loyaltyFormData, setLoyaltyFormData] = useState<any>({
    name: "",
    minPoints: 0,
    discount: 0,
    colorFrom: PRESETS[0].from,
    colorTo: PRESETS[0].to,
  });

  /* ---------------- FILTERING ---------------- */
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

  /* ---------------- HANDLERS ---------------- */
  const handlePromoteDemote = async (user: User) => {
    const newRole =
      user.role === Role.ADMIN ? Role.CUSTOMER : Role.ADMIN;

    if (confirm(`Change ${getDisplayName(user)} to ${newRole}?`)) {
      await updateUserRole({ userId: user.id, role: newRole });
      alert(`${getDisplayName(user)} is now ${newRole}`);
    }
  };

  const handleBanClick = (user: User) => {
    if (user.isActive) {
      setBanData({
        userId: user.id,
        userName: getDisplayName(user),
        reason: "",
        duration: 7,
      });
      setIsBanModalOpen(true);
    } else {
      if (confirm(`Activate ${getDisplayName(user)}?`)) {
        toggleUserStatus({ userId: user.id, isActive: true });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-4">
      <table className="w-full">
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    {getInitial(user)}
                  </div>
                  <div>
                    <p className="font-bold">{getDisplayName(user)}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right space-x-2">
                <button onClick={() => handlePromoteDemote(user)}>
                  <Shield size={16} />
                </button>
                <button onClick={() => handleBanClick(user)}>
                  <Ban size={16} />
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDetailsModalOpen(true);
                  }}
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
