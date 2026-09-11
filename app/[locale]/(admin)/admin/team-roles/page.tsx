'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UserPlus, Pencil, Trash2, Lock } from 'lucide-react';
import { getAdminUsers, deleteAdminUser } from '@/actions/admin';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Superadmin' | 'Support' | 'Editor';
  lastActive: string;
  isOwner?: boolean;
}

const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Muhammad Talha Iftikhar',
    email: 'talha@soovia.com',
    avatar: 'MT',
    role: 'Superadmin',
    lastActive: 'Active now',
    isOwner: true,
  },
  {
    id: 'staff-2',
    name: 'Adeel Shaukat',
    email: 'adeel@soovia.com',
    avatar: 'AS',
    role: 'Superadmin',
    lastActive: '2 hours ago',
    isOwner: false,
  },
  {
    id: 'staff-3',
    name: 'Sarah Jenkins',
    email: 'sarah.j@soovia.com',
    avatar: 'SJ',
    role: 'Support',
    lastActive: '45 mins ago',
    isOwner: false,
  },
  {
    id: 'staff-4',
    name: 'Alex Chen',
    email: 'alex.c@soovia.com',
    avatar: 'AC',
    role: 'Editor',
    lastActive: 'Yesterday',
    isOwner: false,
  },
  {
    id: 'staff-5',
    name: 'Elena Rostova',
    email: 'elena.r@soovia.com',
    avatar: 'ER',
    role: 'Support',
    lastActive: '3 days ago',
    isOwner: false,
  },
];

export default function TeamRolesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF);

  // Fetch real admin users from Prisma on mount
  useEffect(() => {
    async function loadStaff() {
      try {
        const users = await getAdminUsers();
        if (users && users.length > 0) {
          setStaff(
            users.map((u: any, idx: number) => {
              const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
              const initials = `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || 'AD';

              // Map DB enum (SUPERADMIN, SUPPORT, EDITOR, CUSTOM)
              let uiRole: 'Superadmin' | 'Support' | 'Editor' = 'Support';
              if (u.role === 'SUPERADMIN') uiRole = 'Superadmin';
              else if (u.role === 'EDITOR') uiRole = 'Editor';

              const lastActiveText = u.lastActive
                ? new Date(u.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Offline';

              return {
                id: u.id,
                name,
                email: u.email,
                avatar: initials,
                role: uiRole,
                lastActive: idx === 0 ? 'Active now' : lastActiveText,
                isOwner: u.role === 'SUPERADMIN' && idx === 0,
              };
            })
          );
        }
      } catch (err) {
        console.error('Failed to load team members:', err);
      }
    }
    loadStaff();
  }, []);

  const handleDeleteStaff = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the team?`)) {
      setStaff((prev) => prev.filter((user) => user.id !== id));
      try {
        await deleteAdminUser(id);
      } catch (err) {
        console.error('Failed to delete team member:', err);
      }
    }
  };

  const getRoleBadge = (role: StaffUser['role']) => {
    switch (role) {
      case 'Superadmin':
        return (
          <span className="text-sm font-semibold text-purple-600">
            Superadmin
          </span>
        );
      case 'Support':
        return (
          <span className="text-sm font-semibold text-blue-600">
            Support
          </span>
        );
      case 'Editor':
        return (
          <span className="text-sm font-semibold text-amber-600">
            Editor
          </span>
        );
      default:
        return (
          <span className="text-sm font-semibold text-gray-600">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Team &amp; Roles
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage team members, assign roles, and control portal permissions.
          </p>
        </div>

        <Link
          href={`/${locale}/admin/team-roles/add`}
          className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Member</span>
        </Link>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  User
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  {/* User (Avatar circle + Name and Email stacked) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-xs flex items-center justify-center shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900 text-sm">
                            {user.name}
                          </span>
                          {user.isOwner && (
                            <span className="text-[10px] font-bold bg-[#F88B35]/10 text-[#F88B35] px-1.5 py-0.5 rounded border border-[#F88B35]/20">
                              Owner
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>

                  {/* Last Active */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      {user.lastActive === 'Active now' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                      <span>{user.lastActive}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/team-roles/${user.id}/edit`}
                        title="Edit team member"
                        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      {user.isOwner ? (
                        <button
                          type="button"
                          disabled
                          title="Primary owner cannot be removed"
                          className="p-1.5 text-gray-300 cursor-not-allowed rounded-lg"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(user.id, user.name)}
                          title="Remove team member"
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
