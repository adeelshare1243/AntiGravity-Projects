import { redirect } from 'next/navigation';

export default function StaffRedirect() {
  redirect('/admin/team-roles');
}
