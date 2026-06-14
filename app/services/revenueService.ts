import { api } from './api';

export interface RevenueReport {
  id_revenue: number;
  period: string;
  total_revenue: number;
  total_booking: number;
  total_review: number;
  detail_income: string;
}

export function getRevenueReports() {
  return api.list<RevenueReport[]>('revenue_reports');
}
