export interface Announcement {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  active: boolean;
}

export interface DashboardStats {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  totalSubmissions: number;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  draftCount: number;
  totalAnnouncements: number;
}

export interface AdminStaff {
  id: number;
  staffId: string;
  fullName: string;
  designation: string;
  department: string;
  division: string;
  role: string;
  phoneNumber: string;
  email: string;
  accountStatus: string;
  hasUserAccount: boolean;
  hasBankDetails: boolean;
  bankSubmissionStatus: string;
}

export interface Submission {
  id: number;
  staffId: string;
  fullName: string;
  department: string;
  division: string;
  passportPhoto: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  submissionStatus: string;
  rejectionReason: string;
  submittedAt: string;
  approvedAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ImportRow {
  rowNumber: number;
  staffId: string;
  fullName: string;
  designation: string;
  department: string;
  division: string;
  role: string;
  phoneNumber: string;
  email: string;
  duplicate: boolean;
  valid: boolean;
  errors: string[];
}

export interface ImportResult {
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  errors: string[];
}
