export interface BankDetails {
  id: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  submissionStatus: string;
  rejectionReason: string;
  submittedAt: string;
  approvedAt: string;
}

export interface BankDetailsRequest {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface BankListItem {
  name: string;
}
