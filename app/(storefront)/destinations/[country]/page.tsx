import React from 'react';

export default async function CountryPackageDetailPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  return <div className="p-8">Package Details for: {country}</div>;
}
