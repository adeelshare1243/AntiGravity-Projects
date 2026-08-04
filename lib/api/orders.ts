import { Order, CartItem, Currency } from '@/types';

export async function createOrder(items: CartItem[], currency: Currency): Promise<Order> {
  throw new Error('Not implemented');
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  return [];
}
