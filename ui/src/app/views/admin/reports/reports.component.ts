import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../_core/services/admin.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <h1>Reports</h1>
        <p>Download staff and submission reports in Excel format</p>
      </div>

      <div class="reports-grid">
        <div class="neco-card report-card">
          <div class="report-icon" style="background: #d1fae5; color: #059669;">
            <i class="pi pi-check-circle"></i>
          </div>
          <h3>Approved Staff Report</h3>
          <p>Download all staff with approved bank details</p>
          <button class="neco-btn neco-btn-primary" (click)="downloadReport('approved-staff')">
            <i class="pi pi-download"></i> Download Report
          </button>
        </div>

        <div class="neco-card report-card">
          <div class="report-icon" style="background: #dbeafe; color: #1d4ed8;">
            <i class="pi pi-send"></i>
          </div>
          <h3>Submitted Staff Report</h3>
          <p>Download all staff with pending submissions</p>
          <button class="neco-btn neco-btn-primary" (click)="downloadReport('submitted-staff')">
            <i class="pi pi-download"></i> Download Report
          </button>
        </div>

        <div class="neco-card report-card">
          <div class="report-icon" style="background: #fef3c7; color: #d97706;">
            <i class="pi pi-clock"></i>
          </div>
          <h3>Pending Staff Report</h3>
          <p>Download staff with draft submissions</p>
          <button class="neco-btn neco-btn-primary" (click)="downloadReport('pending-staff')">
            <i class="pi pi-download"></i> Download Report
          </button>
        </div>

        <div class="neco-card report-card">
          <div class="report-icon" style="background: #fee2e2; color: #dc2626;">
            <i class="pi pi-times-circle"></i>
          </div>
          <h3>Rejected Staff Report</h3>
          <p>Download staff with rejected submissions</p>
          <button class="neco-btn neco-btn-primary" (click)="downloadReport('rejected-staff')">
            <i class="pi pi-download"></i> Download Report
          </button>
        </div>

        <div class="neco-card report-card">
          <div class="report-icon" style="background: #ede9fe; color: #7c3aed;">
            <i class="pi pi-users"></i>
          </div>
          <h3>All Staff Report</h3>
          <p>Download complete staff list with details</p>
          <button class="neco-btn neco-btn-primary" (click)="downloadReport('all-staff')">
            <i class="pi pi-download"></i> Download Report
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .report-card {
      text-align: center;
      padding: 32px 20px;
    }
    .report-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin: 0 auto 16px;
    }
    .report-card h3 {
      margin: 0 0 6px;
      font-size: 1rem;
      font-weight: 600;
      color: #2F3B52;
    }
    .report-card p {
      margin: 0 0 20px;
      font-size: 0.82rem;
      color: #707B8A;
      line-height: 1.4;
    }
    @media (max-width: 992px) {
      .reports-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 576px) {
      .reports-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ReportsComponent {
  constructor(private adminService: AdminService, private http: HttpClient) {}

  downloadReport(type: string): void {
    let url: string;
    let filename: string;
    switch (type) {
      case 'all-staff':
        url = this.adminService.exportStaff();
        filename = 'all-staff-report.xlsx';
        break;
      case 'approved-staff':
        url = this.adminService.exportSubmissions('APPROVED');
        filename = 'approved-staff-report.xlsx';
        break;
      case 'submitted-staff':
        url = this.adminService.exportSubmissions('SUBMITTED');
        filename = 'submitted-staff-report.xlsx';
        break;
      case 'rejected-staff':
        url = this.adminService.exportSubmissions('REJECTED');
        filename = 'rejected-staff-report.xlsx';
        break;
      case 'pending-staff':
        url = this.adminService.exportSubmissions('DRAFT');
        filename = 'pending-staff-report.xlsx';
        break;
      default:
        url = this.adminService.exportStaff();
        filename = 'all-staff-report.xlsx';
    }
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      },
      error: () => alert('Failed to download report')
    });
  }
}
