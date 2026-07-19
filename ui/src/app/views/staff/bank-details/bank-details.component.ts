import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../_core/services/staff.service';
import { BankDetails, BankDetailsRequest, BankListItem } from '../../../_core/models/bank.model';

@Component({
  selector: 'app-bank-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bank-page">
      <div class="page-header">
        <h1>Bank Details</h1>
        <p>Submit and manage your bank account information for payment processing</p>
      </div>

      <div class="neco-card">
        <div class="bank-status-section" *ngIf="bankDetails?.submissionStatus">
          <div class="status-info">
            <span class="status-label">Current Status</span>
            <span class="neco-badge" [ngClass]="getBadgeClass(bankDetails?.submissionStatus)">
              {{bankDetails?.submissionStatus}}
            </span>
          </div>
          <div *ngIf="bankDetails?.submissionStatus === 'REJECTED' && bankDetails?.rejectionReason" class="rejection-reason">
            <i class="pi pi-info-circle"></i>
            <div>
              <strong>Rejection Reason:</strong>
              <p>{{bankDetails?.rejectionReason}}</p>
            </div>
          </div>
          <div *ngIf="bankDetails?.submittedAt" class="status-detail">
            Submitted: {{bankDetails?.submittedAt | date:'medium'}}
          </div>
          <div *ngIf="bankDetails?.approvedAt" class="status-detail approved">
            Approved: {{bankDetails?.approvedAt | date:'medium'}}
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="bank-form" *ngIf="canEdit">
          <h3>Account Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="neco-label">Bank Name *</label>
              <select class="neco-select" [(ngModel)]="formData.bankName" name="bankName" required>
                <option value="">Select Bank</option>
                <option *ngFor="let bank of banks" [value]="bank.name">
                  {{bank.name}}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="neco-label">Account Name *</label>
              <input
                class="neco-input"
                [(ngModel)]="formData.accountName"
                name="accountName"
                placeholder="Account holder name"
                required
              />
            </div>
            <div class="form-group full-width">
              <label class="neco-label">Account Number *</label>
              <input
                class="neco-input"
                [(ngModel)]="formData.accountNumber"
                name="accountNumber"
                placeholder="10-digit account number"
                maxlength="10"
                required
              />
              <small class="field-hint" *ngIf="formData.accountNumber && formData.accountNumber.length !== 10">
                Account number must be exactly 10 digits
              </small>
            </div>
          </div>

          <div class="form-actions">
            <div class="messages">
              <div class="success-message" *ngIf="successMessage">
                <i class="pi pi-check-circle"></i> {{successMessage}}
              </div>
              <div class="error-message" *ngIf="errorMessage">
                <i class="pi pi-exclamation-circle"></i> {{errorMessage}}
              </div>
            </div>
            <div class="action-buttons">
              <button
                type="button"
                class="neco-btn neco-btn-outline"
                (click)="onSaveDraft()"
                [disabled]="saving"
              >
                <i class="pi pi-save"></i> Save Draft
              </button>
              <button
                type="submit"
                class="neco-btn neco-btn-primary"
                [disabled]="saving || !isFormValid()"
              >
                <span class="spinner" *ngIf="saving"></span>
                <span *ngIf="!saving"><i class="pi pi-send"></i> Submit</span>
              </button>
            </div>
          </div>
        </form>

        <div *ngIf="!canEdit && bankDetails?.submissionStatus === 'APPROVED'" class="approved-view">
          <div class="approved-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3>Bank Details Approved</h3>
          <p>Your bank details have been verified and approved.</p>
          <div class="approved-details">
            <div class="detail">
              <span>Bank</span>
              <strong>{{bankDetails?.bankName}}</strong>
            </div>
            <div class="detail">
              <span>Account Name</span>
              <strong>{{bankDetails?.accountName}}</strong>
            </div>
            <div class="detail">
              <span>Account Number</span>
              <strong>{{bankDetails?.accountNumber}}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div class="neco-modal-overlay" *ngIf="showConfirmModal" (click)="showConfirmModal = false">
        <div class="neco-modal" (click)="$event.stopPropagation()">
          <div class="neco-modal-header">
            <h3 class="neco-modal-title">Confirm Submission</h3>
            <button class="neco-modal-close" (click)="showConfirmModal = false">&times;</button>
          </div>
          <div class="neco-modal-body">
            <p>Are you sure you want to submit your bank account information?</p>
            <p class="note">After submission, changes may require administrator approval.</p>
          </div>
          <div class="neco-modal-footer">
            <button class="neco-btn neco-btn-secondary" (click)="showConfirmModal = false">Cancel</button>
            <button class="neco-btn neco-btn-primary" (click)="confirmSubmit()">
              <i class="pi pi-send"></i> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bank-page { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .bank-status-section {
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
    }
    .status-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .status-label { font-weight: 500; color: #2F3B52; }
    .rejection-reason {
      display: flex;
      gap: 10px;
      padding: 12px;
      background: #fef2f2;
      border-radius: 8px;
      margin-top: 10px;
      border: 1px solid #fecaca;
      color: #dc2626;
      font-size: 0.88rem;
    }
    .rejection-reason p { margin: 4px 0 0; }
    .status-detail { font-size: 0.82rem; color: #707B8A; margin-top: 4px; }
    .status-detail.approved { color: #059669; }
    .bank-form h3 {
      margin: 0 0 20px;
      font-size: 1.1rem;
      color: #2F3B52;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
    }
    .full-width { grid-column: 1 / -1; }
    .field-hint {
      color: #dc2626;
      font-size: 0.78rem;
      margin-top: 4px;
      display: block;
    }
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f0f1f3;
    }
    .action-buttons {
      display: flex;
      gap: 12px;
    }
    .messages {
      display: flex;
      gap: 12px;
    }
    .success-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #16a34a;
      font-size: 0.85rem;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #dc2626;
      font-size: 0.85rem;
    }
    .spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .approved-view {
      text-align: center;
      padding: 40px 20px;
    }
    .approved-icon {
      color: #059669;
      font-size: 3rem;
      margin-bottom: 12px;
    }
    .approved-view h3 { margin: 0 0 8px; color: #2F3B52; }
    .approved-view p { margin: 0 0 20px; color: #707B8A; }
    .approved-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 320px;
      margin: 0 auto;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f1f3;
    }
    .detail span { color: #707B8A; font-size: 0.88rem; }
    .detail strong { color: #2F3B52; }
    .note { color: #707B8A; font-size: 0.85rem; }
    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-actions { flex-direction: column; gap: 12px; }
      .action-buttons { width: 100%; }
      .action-buttons .neco-btn { flex: 1; }
    }
  `]
})
export class BankDetailsComponent implements OnInit {
  bankDetails: BankDetails | null = null;
  banks: BankListItem[] = [];
  formData: BankDetailsRequest = { bankName: '', accountName: '', accountNumber: '' };
  saving = false;
  successMessage = '';
  errorMessage = '';
  showConfirmModal = false;

  get canEdit(): boolean {
    return !this.bankDetails?.submissionStatus ||
           this.bankDetails.submissionStatus === 'DRAFT' ||
           this.bankDetails.submissionStatus === 'REJECTED';
  }

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.loadBankDetails();
    this.loadBanks();
  }

  loadBankDetails() {
    this.staffService.getBankDetails().subscribe({
      next: (res) => {
        if (res.success && res.data?.id) {
          this.bankDetails = res.data;
          this.formData = {
            bankName: res.data.bankName || '',
            accountName: res.data.accountName || '',
            accountNumber: res.data.accountNumber || ''
          };
        }
      }
    });
  }

  loadBanks() {
    this.staffService.getBanks().subscribe({
      next: (res) => {
        if (res.success) this.banks = res.data;
      }
    });
  }

  isFormValid(): boolean {
    return !!this.formData.bankName &&
           !!this.formData.accountName &&
           !!this.formData.accountNumber &&
           this.formData.accountNumber.length === 10;
  }

  onSaveDraft() {
    if (!this.isFormValid()) return;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.staffService.saveDraftBankDetails(this.formData).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.bankDetails = res.data;
          this.successMessage = 'Draft saved successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.error || 'Failed to save draft';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    this.showConfirmModal = true;
  }

  confirmSubmit() {
    this.showConfirmModal = false;
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.staffService.submitBankDetails(this.formData).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.bankDetails = res.data;
          this.successMessage = 'Bank details submitted for approval!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.error || 'Failed to submit';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  getBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'APPROVED': return 'neco-badge-approved';
      case 'SUBMITTED': return 'neco-badge-submitted';
      case 'REJECTED': return 'neco-badge-rejected';
      default: return 'neco-badge-draft';
    }
  }
}
