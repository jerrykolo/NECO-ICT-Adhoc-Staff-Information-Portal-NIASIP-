export interface StaffProfile {
  id: number;
  staffId: string;
  fullName: string;
  designation: string;
  department: string;
  division: string;
  role: string;
  phoneNumber: string;
  email: string;
  passportPhoto: string;
  accountStatus: string;
  hasBankDetails: boolean;
  bankSubmissionStatus: string;
}

export interface StaffUpdateRequest {
  phoneNumber: string;
  email: string;
}
