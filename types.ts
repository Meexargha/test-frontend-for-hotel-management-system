export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department | string; // Can be ID or populated object
  role: 'admin' | 'staff' | 'manager';
  status: 'active' | 'inactive';
  joinedDate: string;
  salary?: number;
}

export interface Salary {
  _id: string;
  staff: Staff | string;
  amount: number;
  paymentDate: string;
  status: 'paid' | 'pending';
  month: string;
  year: number;
}

export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  totalDepartments: number;
  recentStaff: Staff[];
}
