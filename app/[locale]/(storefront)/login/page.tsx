'use client';

import React, { Suspense } from 'react';
import SignUp from '@/components/storefront/SignUp';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">Loading...</div>}>
      <SignUp initialTab="login" />
    </Suspense>
  );
}
