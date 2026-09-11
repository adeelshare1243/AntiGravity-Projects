import React from 'react';
import { prisma } from '@/lib/prisma';
import OrdersClient from '@/components/admin/OrdersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders Management | Admin Panel | Soovia eSIM',
  description: 'Real-time customer transactions, fulfillment logs, and eSIM provisioning statuses.',
};

export default async function OrdersManagementPage() {
  // Step 1: Server-Side Fetching from Prisma
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      package: {
        include: {
          destination: true,
          supplier: true,
        },
      },
      userEsims: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculate the 4 key metrics directly on the server
  // 1. totalRevenue: Sum the totalPrice (or amount) of all orders where status is COMPLETED
  const totalRevenue = orders
    .filter((o) => (o.status || '').toUpperCase() === 'COMPLETED')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // 2. totalOrders: Total length of fetched orders
  const totalOrders = orders.length;

  // 3. pendingOrders: Count orders where status is PENDING or PROCESSING
  const pendingOrders = orders.filter((o) => {
    const s = (o.status || '').toUpperCase();
    return s === 'PENDING' || s === 'PROCESSING';
  }).length;

  // 4. failedOrders: Count orders where status is FAILED or REFUNDED
  const failedOrders = orders.filter((o) => {
    const s = (o.status || '').toUpperCase();
    return s === 'FAILED' || s === 'REFUNDED';
  }).length;

  // Serialize orders for client consumption
  const serializedOrders = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    user: o.user
      ? {
          ...o.user,
          createdAt: o.user.createdAt.toISOString(),
          updatedAt: o.user.updatedAt.toISOString(),
        }
      : null,
    package: o.package
      ? {
          ...o.package,
          createdAt: o.package.createdAt.toISOString(),
          updatedAt: o.package.updatedAt.toISOString(),
          destination: o.package.destination
            ? {
                ...o.package.destination,
                createdAt: o.package.destination.createdAt.toISOString(),
              }
            : null,
          supplier: o.package.supplier
            ? {
                ...o.package.supplier,
                createdAt: o.package.supplier.createdAt.toISOString(),
                updatedAt: o.package.supplier.updatedAt.toISOString(),
                lastSyncAt: o.package.supplier.lastSyncAt
                  ? o.package.supplier.lastSyncAt.toISOString()
                  : null,
              }
            : null,
        }
      : null,
    userEsims: (o.userEsims || []).map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    })),
  }));

  return (
    <OrdersClient
      orders={serializedOrders}
      metrics={{
        totalRevenue,
        totalOrders,
        pendingOrders,
        failedOrders,
      }}
    />
  );
}
