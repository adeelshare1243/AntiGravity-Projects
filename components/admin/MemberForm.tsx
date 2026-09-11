'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Shield, Users, Edit3, Sliders, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { createTeamMember, updateTeamMember } from '@/actions/team';
import { AdminRole } from '@prisma/client';

export interface MemberInitialData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  permissions?: Record<string, boolean>;
}

interface MemberFormProps {
  initialData?: MemberInitialData;
}

const ROLES_OPTIONS = [
  {
    id: 'SUPERADMIN' as AdminRole,
    label: 'Superadmin',
    description: 'Full platform control, billing, credentials, and settings.',
    icon: Shield,
    badgeColor: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    id: 'SUPPORT' as AdminRole,
    label: 'Support',
    description: 'Manage user orders, eSIM inventory, diagnostics, and customer requests.',
    icon: Users,
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    id: 'EDITOR' as AdminRole,
    label: 'Editor',
    description: 'Manage CMS documentation, Blog stories, and Help Center guides.',
    icon: Edit3,
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    id: 'CUSTOM' as AdminRole,
    label: 'Custom',
    description: 'Tailored permissions with customized portal access boundaries.',
    icon: Sliders,
    badgeColor: 'text-gray-600 bg-gray-50 border-gray-200',
  },
];

export default function MemberForm({ initialData }: MemberFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const isEditing = Boolean(initialData?.id);

  // Form State
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Normalize initial role to Prisma Enum
  const getInitialRole = (): AdminRole => {
    if (!initialData?.role) return AdminRole.SUPPORT;
    const r = initialData.role.toUpperCase();
    if (r === 'SUPERADMIN') return AdminRole.SUPERADMIN;
    if (r === 'EDITOR') return AdminRole.EDITOR;
    if (r === 'CUSTOM') return AdminRole.CUSTOM;
    return AdminRole.SUPPORT;
  };

  const [role, setRole] = useState<AdminRole>(getInitialRole());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isEditing && initialData?.id) {
        const res = await updateTeamMember(initialData.id, {
          firstName,
          lastName,
          email,
          role,
          ...(password ? { password } : {}),
        });

        if (!res.success) {
          setError(res.error || 'Failed to update member.');
          setIsLoading(false);
          return;
        }
      } else {
        const res = await createTeamMember({
          firstName,
          lastName,
          email,
          password: password || undefined,
          role,
        });

        if (!res.success) {
          setError(res.error || 'Failed to add member.');
          setIsLoading(false);
          return;
        }
      }

      router.push(`/${locale}/admin/team-roles`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3.5 flex items-start gap-2">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        {/* First & Last Name */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. John"
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Doe"
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
            />
          </div>
        </div>

        {/* Email & Password */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Password {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required={!isEditing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? 'Leave blank to keep unchanged' : 'Minimum 6 characters'}
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isEditing && (
              <p className="text-[11px] text-gray-500 mt-1">
                Only fill this in if you want to reset this user&apos;s password.
              </p>
            )}
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Assigned Role <span className="text-red-500">*</span>
          </label>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ROLES_OPTIONS.map((item) => {
              const isSelected = role === item.id;
              const Icon = item.icon;
              return (
                <label
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'border-[#F88B35] bg-[#FFF9F5] ring-1 ring-[#F88B35]/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item.id}
                    checked={isSelected}
                    onChange={() => setRole(item.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-[#F88B35] text-white border-[#F88B35]'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-gray-900">
                        {item.label}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#F88B35]" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/${locale}/admin/team-roles`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors text-center cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#F88B35] hover:bg-[#e07a2f] disabled:opacity-70 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isLoading
                ? isEditing
                  ? 'Saving Changes...'
                  : 'Adding Member...'
                : isEditing
                ? 'Save Changes'
                : 'Add Member'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
