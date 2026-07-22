import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../_core/services/admin.service';
import { AdminStaff, PagedResponse } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="staff-management">
      <div class="page-header">
        <h1>Staff Management</h1>
        <p>View and manage staff accounts and access</p>
      </div>

      <div class="neco-card">
        <div class="toolbar">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input
              class="neco-input"
              [(ngModel)]="searchTerm"
              placeholder="Search by name, staff ID, or department..."
              (input)="onSearch()"
            />
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
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let staff of staffList">
                <td class="staff-id">{{staff.staffId}}</td>
                <td>{{staff.fullName}}</td>
                <td>{{staff.phoneNumber || 'N/A'}}</td>
                <td>
                  <span class="neco-badge" [ngClass]="staff.accountStatus === 'ACTIVE' ? 'neco-badge-approved' : 'neco-badge-rejected'">
                    {{staff.accountStatus}}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="neco-btn neco-btn-outline neco-btn-sm" (click)="resetPassword(staff)" [disabled]="actionLoading">
                    <i class="pi pi-key"></i> Reset
                  </button>
                  <button
                    class="neco-btn neco-btn-sm"
                    [class.neco-btn-danger]="staff.accountStatus === 'ACTIVE'"
                    [class.neco-btn-primary]="staff.accountStatus !== 'ACTIVE'"
                    (click)="toggleStatus(staff)"
                    [disabled]="actionLoading"
                  >
                    <i [class]="staff.accountStatus === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-check'"></i>
                    {{staff.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}}
                  </button>
                </td>
              </tr>
              <tr *ngIf="staffList.length === 0">
                <td colspan="5" class="empty-row">No staff members found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mobile-cards" *ngIf="!loading">
          <div class="staff-card neco-card" *ngFor="let staff of staffList">
            <div class="card-header">
              <strong>{{staff.fullName}}</strong>
              <span class="neco-badge" [ngClass]="staff.accountStatus === 'ACTIVE' ? 'neco-badge-approved' : 'neco-badge-rejected'">
                {{staff.accountStatus}}
              </span>
            </div>
            <div class="card-body">
              <div class="detail-row">
                <span class="detail-label">Staff ID</span>
                <span class="detail-value">{{staff.staffId}}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone Number</span>
                <span class="detail-value">{{staff.phoneNumber || 'N/A'}}</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="neco-btn neco-btn-outline neco-btn-sm" (click)="resetPassword(staff)" [disabled]="actionLoading">
                <i class="pi pi-key"></i> Reset
              </button>
              <button
                class="neco-btn neco-btn-sm"
                [class.neco-btn-danger]="staff.accountStatus === 'ACTIVE'"
                [class.neco-btn-primary]="staff.accountStatus !== 'ACTIVE'"
                (click)="toggleStatus(staff)"
                [disabled]="actionLoading"
              >
                {{staff.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}}
              </button>
            </div>
          </div>
          <div class="empty-state" *ngIf="staffList.length === 0">
            <i class="pi pi-inbox"></i>
            <p>No staff members found</p>
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
    .staff-management { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .toolbar { margin-bottom: 20px; }
    .search-box {
      position: relative;
      max-width: 400px;
    }
    .search-box i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #707B8A;
      z-index: 1;
    }
    .search-box .neco-input { padding-left: 40px; }
    .desktop-table { overflow-x: auto; }
    table {
      width: 100%;
      border-collapse: collapse;
    }
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
    .actions-cell { white-space: nowrap; }
    .actions-cell .neco-btn { margin-right: 6px; }
    .actions-cell .neco-btn:last-child { margin-right: 0; }
    .empty-row {
      text-align: center;
      color: #707B8A;
      padding: 40px 16px !important;
    }
    .mobile-cards { display: none; }
    .staff-card { margin-bottom: 12px; padding: 16px; }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .card-header strong { font-size: 0.95rem; color: #2F3B52; }
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
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
    }
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
    @media (max-width: 768px) {
      .desktop-table { display: none; }
      .mobile-cards { display: block; }
    }
  `]
})
export class StaffManagementComponent implements OnInit {
  staffList: AdminStaff[] = [];
  pagedData: PagedResponse<AdminStaff> | null = null;
  searchTerm = '';
  currentPage = 0;
  pageSize = 10;
  loading = true;
  actionLoading = false;
  toastMessage = '';
  private searchTimeout: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.loading = true;
    this.adminService.getAllStaff(this.searchTerm || undefined, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.pagedData = res.data;
          this.staffList = res.data.content;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadStaff();
    }, 400);
  }

  goToPage(page: number): void {
    if (page < 0 || (this.pagedData && page >= this.pagedData.totalPages)) return;
    this.currentPage = page;
    this.loadStaff();
  }

  resetPassword(staff: AdminStaff): void {
    if (!confirm(`Reset password for ${staff.fullName} (${staff.staffId})?`)) return;
    this.actionLoading = true;
    this.adminService.resetPassword(staff.staffId).subscribe({
      next: (res) => {
        this.actionLoading = false;
        if (res.success) {
          this.toastMessage = res.message || 'Password reset successfully. A new temporary password has been sent.';
        }
      },
      error: (err) => {
        this.actionLoading = false;
        this.toastMessage = err.error?.message || 'Failed to reset password';
      }
    });
  }

  toggleStatus(staff: AdminStaff): void {
    const action = staff.accountStatus === 'ACTIVE' ? 'deactivate' : 'activate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} account for ${staff.fullName}?`)) return;
    this.actionLoading = true;
    this.adminService.toggleStaffStatus(staff.staffId).subscribe({
      next: (res) => {
        this.actionLoading = false;
        if (res.success) {
          staff.accountStatus = staff.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          this.toastMessage = res.message || `Account ${action}d successfully`;
        }
      },
      error: (err) => {
        this.actionLoading = false;
        this.toastMessage = err.error?.message || `Failed to ${action} account`;
      }
    });
  }
}
