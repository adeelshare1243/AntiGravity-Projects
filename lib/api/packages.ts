import { eSIMPackage } from '@/types';

export async function fetchPackages(query?: { country?: string; region?: string }): Promise<eSIMPackage[]> {
  return [];
}

export async function fetchPackageById(id: string): Promise<eSIMPackage | null> {
  return null;
}
