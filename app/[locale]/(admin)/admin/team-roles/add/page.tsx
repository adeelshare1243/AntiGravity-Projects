import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MemberForm from '@/components/admin/MemberForm';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AddTeamMemberPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="text-sm font-medium text-gray-500 flex items-center gap-1.5"
        >
          <Link
            href={`/${locale}/admin`}
            className="hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link
            href={`/${locale}/admin/team-roles`}
            className="hover:text-gray-900 transition-colors"
          >
            Team &amp; Roles
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold">Add Member</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
          Add New Team Member
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Create a new team member account, assign roles, and set up login credentials.
        </p>
      </div>

      {/* Shared Member Form */}
      <MemberForm />
    </div>
  );
}
