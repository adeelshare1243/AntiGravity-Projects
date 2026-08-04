export type Role = 'customer' | 'admin' | 'superadmin';
export type OrderStatus = 'pending' | 'active' | 'completed' | 'failed' | 'refunded';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';
export type Language = 'en' | 'es' | 'de' | 'fr' | 'ja' | 'tr';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  country?: string;
  soovia_points?: number;
  created_at: string;
}

export interface eSIMPackage {
  id: string;
  title: string;
  country_code: string;
  country_name: string;
  region: string;
  flag_url?: string;
  data_gb: number | 'unlimited';
  duration_days: number;
  price_usd: number;
  provider_id: string;
  is_unlimited: boolean;
  speed_type: '5G' | '4G/LTE' | '3G';
  fair_usage_policy?: string;
  supported_networks: string[];
}

export interface CartItem {
  package: eSIMPackage;
  quantity: number;
  custom_label?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  currency: Currency;
  status: OrderStatus;
  esim_iccid?: string;
  qr_code_url?: string;
  activation_code?: string;
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  api_status: 'operational' | 'degraded' | 'maintenance' | 'offline';
  latency_ms: number;
  active_sims: number;
  total_revenue: number;
  supported_countries: string[];
}

export interface CountryRestriction {
  country_code: string;
  country_name: string;
  is_blocked: boolean;
  require_kyc: boolean;
  max_sims_per_user: number;
  risk_level: 'low' | 'medium' | 'high';
}
