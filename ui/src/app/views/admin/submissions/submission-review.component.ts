import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../_core/services/admin.service';
import { Submission, PagedResponse } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-submission-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="submission-review">
      <div class="page-header">
        <h1>Submission Review</h1>
        <p>Review, approve, or reject staff bank detail submissions</p>
      </div>

      <div class="neco-card">
        <div class="toolbar">
          <div class="filter-group">
            <label class="neco-label">Filter by Status</label>
            <select class="neco-select" [(ngModel)]="statusFilter" (change)="onFilterChange()">
              <option value="">ALL</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div class="neco-loading" *ngIf="loading">
          <div class="neco-spinner"></div>
        </div>

        <div class="desktop-table" *ngIf="!loading">
          <table>
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Account Name</th>
                <th>Bank</th>
                <th>Account No</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sub of submissions">
                <td class="staff-id">{{sub.staffId}}</td>
                <td>{{sub.fullName}}</td>
                <td>{{sub.accountName || 'N/A'}}</td>
                <td>{{sub.bankName || 'N/A'}}</td>
                <td class="account-no">{{sub.accountNumber || 'N/A'}}</td>
                <td>
                  <span class="neco-badge" [ngClass]="getBadgeClass(sub.submissionStatus)">
                    {{sub.submissionStatus}}
                  </span>
                </td>
                <td class="actions-cell">
                  <button
                    *ngIf="sub.submissionStatus === 'SUBMITTED'"
                    class="neco-btn neco-btn-primary neco-btn-sm"
                    (click)="approve(sub)"
                    [disabled]="actionLoading"
                  >
                    <i class="pi pi-check"></i> Approve
                  </button>
                  <button
                    *ngIf="sub.submissionStatus === 'SUBMITTED'"
                    class="neco-btn neco-btn-danger neco-btn-sm"
                    (click)="openRejectModal(sub)"
                    [disabled]="actionLoading"
                  >
                    <i class="pi pi-times"></i> Reject
                  </button>
                  <button
                    *ngIf="sub.submissionStatus === 'REJECTED'"
                    class="neco-btn neco-btn-outline neco-btn-sm"
                    style="border-color: #d97706; color: #d97706;"
                    (click)="reopen(sub)"
                    [disabled]="actionLoading"
                  >
                    <i class="pi pi-replay"></i> Reopen
                  </button>
                </td>
              </tr>
              <tr *ngIf="submissions.length === 0">
                <td colspan="7" class="empty-row">No submissions found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mobile-cards" *ngIf="!loading">
          <div class="submission-card neco-card" *ngFor="let sub of submissions">
            <div class="card-header">
              <div>
                <strong>{{sub.fullName}}</strong>
                <span class="staff-id-tag">{{sub.staffId}}</span>
              </div>
              <span class="neco-badge" [ngClass]="getBadgeClass(sub.submissionStatus)">
                {{sub.submissionStatus}}
              </span>
            </div>
            <div class="card-body">
              <div class="detail-row">
                <span class="detail-label">Account Name</span>
                <span class="detail-value">{{sub.accountName || 'N/A'}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bank</span>
                <span class="detail-value">{{sub.bankName || 'N/A'}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Account No</span>
                <span class="detail-value">{{sub.accountNumber || 'N/A'}}</span>
              </div>
              <div class="detail-row" *ngIf="sub.rejectionReason">
                <span class="detail-label">Rejection Reason</span>
                <span class="detail-value" style="color: #dc2626;">{{sub.rejectionReason}}</span>
              </div>
            </div>
            <div class="card-actions">
              <button
                *ngIf="sub.submissionStatus === 'SUBMITTED'"
                class="neco-btn neco-btn-primary neco-btn-sm"
                (click)="approve(sub)"
                [disabled]="actionLoading"
              >
                <i class="pi pi-check"></i> Approve
              </button>
              <button
                *ngIf="sub.submissionStatus === 'SUBMITTED'"
                class="neco-btn neco-btn-danger neco-btn-sm"
                (click)="openRejectModal(sub)"
                [disabled]="actionLoading"
              >
                <i class="pi pi-times"></i> Reject
              </button>
              <button
                *ngIf="sub.submissionStatus === 'REJECTED'"
                class="neco-btn neco-btn-outline neco-btn-sm"
                style="border-color: #d97706; color: #d97706;"
                (click)="reopen(sub)"
                [disabled]="actionLoading"
              >
                <i class="pi pi-replay"></i> Reopen
              </button>
            </div>
          </div>
          <div class="empty-state" *ngIf="submissions.length === 0">
            <i class="pi pi-inbox"></i>
            <p>No submissions found</p>
          </div>
        </div>

        <div class="pagination-bar" *ngIf="pagedData && pagedData.totalPages > 1">
          <button class="neco-btn neco-btn-outline neco-btn-sm" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 0">
            <i class="pi pi-chevron-left"></i>
          </button>
          <span class="page-info">
            Page {{currentPage + 1}} of {{pagedData.totalPages}}
            <span class="total-text">({{pagedData.totalElements}} total)</span>
          </span>
          <button class="neco-btn neco-btn-outline neco-btn-sm" (click)="goToPage(currentPage + 1)" [disabled]="pagedData.last">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Reject Modal -->
      <div class="neco-modal-overlay" *ngIf="showRejectModal" (click)="closeRejectModal()">
        <div class="neco-modal" (click)="$event.stopPropagation()">
          <div class="neco-modal-header">
            <h3 class="neco-modal-title">Reject Submission</h3>
            <button class="neco-modal-close" (click)="closeRejectModal()">&times;</button>
          </div>
          <div class="neco-modal-body">
            <p class="reject-info">
              Rejecting submission for <strong>{{selectedSubmission?.fullName}}</strong> ({{selectedSubmission?.staffId}}).
            </p>
            <div class="neco-form-group">
              <label class="neco-label">Rejection Reason *</label>
              <textarea
                class="neco-textarea"
                [(ngModel)]="rejectionReason"
                placeholder="Enter the reason for rejection..."
                rows="4"
              ></textarea>
            </div>
          </div>
          <div class="neco-modal-footer">
            <button class="neco-btn neco-btn-outline" (click)="closeRejectModal()">Cancel</button>
            <button
              class="neco-btn neco-btn-danger"
              (click)="confirmReject()"
              [disabled]="!rejectionReason.trim() || actionLoading"
            >
              <span class="neco-spinner" *ngIf="actionLoading"></span>
              <span *ngIf="!actionLoading"><i class="pi pi-times"></i> Reject</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="neco-modal-overlay" *ngIf="toastMessage" (click)="toastMessage = ''">
        <div class="neco-modal" (click)="$event.stopPropagation()" style="max-width: 400px;">
          <div class="neco-modal-header">
            <h3 class="neco-modal-title">Notification</h3>
            <button class="neco-modal-close" (click)="toastMessage = ''">&times;</button>
          </div>
          <div class="neco-modal-body">
            <p>{{toastMessage}}</p>
          </div>
          <div class="neco-modal-footer">
            <button class="neco-btn neco-btn-primary" (click)="toastMessage = ''">OK</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .submission-review { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .toolbar { margin-bottom: 20px; }
    .filter-group { max-width: 240px; }
    .desktop-table { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      padding: 12px 16px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #707B8A;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 2px solid #f0f1f3;
      white-space: nowrap;
    }
    td {
      padding: 14px 16px;
      font-size: 0.9rem;
      color: #2F3B52;
      border-bottom: 1px solid #f0f1f3;
    }
    tr:hover td { background: #f9fafb; }
    .staff-id { font-family: monospace; font-weight: 600; color: #1D7A43; }
    .account-no { font-family: monospace; }
    .actions-cell { white-space: nowrap; }
    .actions-cell .neco-btn { margin-right: 6px; }
    .empty-row { text-align: center; color: #707B8A; padding: 40px 16px !important; }
    .mobile-cards { display: none; }
    .submission-card { margin-bottom: 12px; padding: 16px; }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .card-header strong { font-size: 0.95rem; color: #2F3B52; }
    .staff-id-tag {
      display: inline-block;
      margin-left: 8px;
      font-size: 0.78rem;
      font-family: monospace;
      color: #1D7A43;
      background: #d1fae5;
      padding: 2px 8px;
      border-radius: 6px;
    }
    .card-body { margin-bottom: 12px; }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #f5f6f8;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-size: 0.82rem; color: #707B8A; }
    .detail-value { font-size: 0.88rem; font-weight: 500; color: #2F3B52; }
    .card-actions {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #f0f1f3;
    }
    .card-actions .neco-btn { flex: 1; }
    .empty-state { text-align: center; padding: 40px 20px; color: #9ca3af; }
    .empty-state i { font-size: 2.5rem; margin-bottom: 12px; display: block; }
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding-top: 20px;
      margin-top: 20px;
      border-top: 1px solid #f0f1f3;
    }
    .page-info { font-size: 0.88rem; color: #707B8A; }
    .total-text { margin-left: 4px; color: #9ca3af; }
    .reject-info { margin-bottom: 16px; color: #2F3B52; font-size: 0.9rem; }
    @media (max-width: 768px) {
      .desktop-table { display: none; }
      .mobile-cards { display: block; }
      .filter-group { max-width: 100%; }
    }
  `]
})
export class SubmissionReviewComponent implements OnInit {
  submissions: Submission[] = [];
  pagedData: PagedResponse<Submission> | null = null;
  statusFilter = '';
  currentPage = 0;
  pageSize = 10;
  loading = true;
  actionLoading = false;
  showRejectModal = false;
  selectedSubmission: Submission | null = null;
  rejectionReason = '';
  toastMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.loading = true;
    this.adminService.getAllSubmissions(this.statusFilter || undefined, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.pagedData = res.data;
          this.submissions = res.data.content;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadSubmissions();
  }

  goToPage(page: number): void {
    if (page < 0 || (this.pagedData && page >= this.pagedData.totalPages)) return;
    this.currentPage = page;
    this.loadSubmissions();
  }

  approve(sub: Submission): void {
    if (!confirm(`Approve submission from ${sub.fullName}?`)) return;
    this.actionLoading = true;
    this.adminService.approveSubmission(sub.id).subscribe({
      next: (res) => {
        this.actionLoading = false;
        if (res.success) {
          sub.submissionStatus = 'APPROVED';
          this.toastMessage = res.message || 'Submission approved successfully';
        }
      },
      error: (err) => {
        this.actionLoading = false;
        this.toastMessage = err.error?.message || 'Failed to approve submission';
      }
    });
  }

  openRejectModal(sub: Submission): void {
    this.selectedSubmission = sub;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedSubmission = null;
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.selectedSubmission || !this.rejectionReason.trim()) return;
    this.actionLoading = true;
    this.adminService.rejectSubmission(this.selectedSubmission.id, this.rejectionReason.trim()).subscribe({
      next: (res) => {
        this.actionLoading = false;
        if (res.success && this.selectedSubmission) {
          this.selectedSubmission.submissionStatus = 'REJECTED';
          this.selectedSubmission.rejectionReason = this.rejectionReason.trim();
          this.toastMessage = res.message || 'Submission rejected';
          this.closeRejectModal();
        }
      },
      error: (err) => {
        this.actionLoading = false;
        this.toastMessage = err.error?.message || 'Failed to reject submission';
      }
    });
  }

  reopen(sub: Submission): void {
    if (!confirm(`Reopen submission from ${sub.fullName}?`)) return;
    this.actionLoading = true;
    this.adminService.reopenSubmission(sub.id).subscribe({
      next: (res) => {
        this.actionLoading = false;
        if (res.success) {
          sub.submissionStatus = 'DRAFT';
          sub.rejectionReason = '';
          this.toastMessage = res.message || 'Submission reopened successfully';
        }
      },
      error: (err) => {
        this.actionLoading = false;
        this.toastMessage = err.error?.message || 'Failed to reopen submission';
      }
    });
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'neco-badge-approved';
      case 'SUBMITTED': return 'neco-badge-submitted';
      case 'REJECTED': return 'neco-badge-rejected';
      default: return 'neco-badge-draft';
    }
  }
}
