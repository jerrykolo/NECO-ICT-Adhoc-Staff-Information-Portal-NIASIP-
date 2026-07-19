import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../_core/services/admin.service';
import { DashboardStats } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of staff records and submission activity</p>
      </div>

      <div class="neco-loading" *ngIf="loading">
        <div class="neco-spinner"></div>
      </div>

      <div class="stats-grid" *ngIf="!loading && stats">
        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #d1fae5; color: #059669;">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-number">{{stats.totalStaff}}</div>
          <div class="stat-label">Total Staff</div>
        </div>

        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #dbeafe; color: #1d4ed8;">
            <i class="pi pi-send"></i>
          </div>
          <div class="stat-number">{{stats.submittedCount}}</div>
          <div class="stat-label">Submitted</div>
        </div>

        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706;">
            <i class="pi pi-file-edit"></i>
          </div>
          <div class="stat-number">{{stats.draftCount}}</div>
          <div class="stat-label">Pending / Draft</div>
        </div>

        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #d1fae5; color: #059669;">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-number">{{stats.approvedCount}}</div>
          <div class="stat-label">Approved</div>
        </div>

        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #fee2e2; color: #dc2626;">
            <i class="pi pi-times-circle"></i>
          </div>
          <div class="stat-number">{{stats.rejectedCount}}</div>
          <div class="stat-label">Rejected</div>
        </div>

        <div class="neco-card neco-stat-card">
          <div class="stat-icon" style="background: #ede9fe; color: #7c3aed;">
            <i class="pi pi-megaphone"></i>
          </div>
          <div class="stat-number">{{stats.totalAnnouncements}}</div>
          <div class="stat-label">Total Announcements</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .neco-stat-card .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 14px;
    }
    .neco-stat-card .stat-number { font-size: 2.2rem; }
    .neco-stat-card .stat-label { font-size: 0.88rem; }
    @media (max-width: 992px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 576px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.stats = res.data;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
