import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../../../_core/services/staff.service';
import { AuthService } from '../../../_core/services/auth.service';
import { StaffProfile } from '../../../_core/models/staff.model';
import { BankDetails } from '../../../_core/models/bank.model';
import { Announcement } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome, {{profile?.fullName || 'Staff Member'}}</h1>
          <p>Manage your profile, bank details, and track your submission status.</p>
        </div>
        <div class="passport-section">
          <img
            *ngIf="profile?.passportPhoto"
            [src]="getPassportUrl()"
            alt="Passport"
            class="passport-photo"
            (error)="showPlaceholder = true"
          />
          <div *ngIf="!profile?.passportPhoto || showPlaceholder" class="passport-placeholder">
            {{getInitials()}}
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card neco-card">
          <div class="stat-icon" style="background: #d1fae5; color: #059669;">
            <i class="pi pi-user"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">Staff ID</div>
            <div class="stat-value">{{profile?.staffId}}</div>
          </div>
        </div>
        <div class="stat-card neco-card">
          <div class="stat-icon" style="background: #dbeafe; color: #1d4ed8;">
            <i class="pi pi-building"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">Department</div>
            <div class="stat-value">{{profile?.department || 'N/A'}}</div>
          </div>
        </div>
        <div class="stat-card neco-card">
          <div class="stat-icon" style="background: #fef3c7; color: #d97706;">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">Bank Status</div>
            <div class="stat-value">
              <span class="neco-badge" [ngClass]="getBadgeClass(profile?.bankSubmissionStatus)">
                {{profile?.bankSubmissionStatus || 'NONE'}}
              </span>
            </div>
          </div>
        </div>
        <div class="stat-card neco-card">
          <div class="stat-icon" style="background: #ede9fe; color: #7c3aed;">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-info">
            <div class="stat-label">Account Status</div>
            <div class="stat-value">{{profile?.accountStatus}}</div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="neco-card profile-summary">
          <div class="neco-card-header">
            <i class="pi pi-user"></i> Profile Summary
          </div>
          <div class="profile-fields">
            <div class="field">
              <span class="field-label">Full Name</span>
              <span class="field-value">{{profile?.fullName}}</span>
            </div>
            <div class="field">
              <span class="field-label">Designation</span>
              <span class="field-value">{{profile?.designation || 'N/A'}}</span>
            </div>
            <div class="field">
              <span class="field-label">Division</span>
              <span class="field-value">{{profile?.division || 'N/A'}}</span>
            </div>
            <div class="field">
              <span class="field-label">Role</span>
              <span class="field-value">{{profile?.role || 'N/A'}}</span>
            </div>
            <div class="field">
              <span class="field-label">Phone</span>
              <span class="field-value">{{profile?.phoneNumber || 'Not provided'}}</span>
            </div>
            <div class="field">
              <span class="field-label">Email</span>
              <span class="field-value">{{profile?.email || 'Not provided'}}</span>
            </div>
          </div>
        </div>

        <div class="announcements-section">
          <div class="neco-card">
            <div class="neco-card-header">
              <i class="pi pi-megaphone"></i> Announcements
            </div>
            <div *ngIf="announcements.length === 0" class="empty-state">
              <i class="pi pi-inbox"></i>
              <p>No announcements at this time</p>
            </div>
            <div *ngFor="let announcement of announcements" class="announcement-item">
              <h4>{{announcement.title}}</h4>
              <p>{{announcement.content}}</p>
              <small>{{announcement.publishedAt | date:'mediumDate'}}</small>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="profile?.bankSubmissionStatus === 'REJECTED'" class="rejection-notice neco-card">
        <div class="rejection-header">
          <i class="pi pi-exclamation-triangle"></i>
          <h3>Submission Rejected</h3>
        </div>
        <p>Your bank details submission has been rejected. Please update your information and resubmit.</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding: 28px;
      background: linear-gradient(135deg, #1D7A43 0%, #186A3A 100%);
      border-radius: 16px;
      color: white;
    }
    .welcome-text h1 {
      margin: 0 0 8px;
      font-size: 1.6rem;
      font-weight: 700;
    }
    .welcome-text p {
      margin: 0;
      opacity: 0.85;
      font-size: 0.9rem;
    }
    .passport-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(255,255,255,0.4);
    }
    .passport-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .stat-label {
      font-size: 0.78rem;
      color: #707B8A;
    }
    .stat-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #2F3B52;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .profile-fields {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #f0f1f3;
    }
    .field:last-child { border-bottom: none; }
    .field-label {
      font-size: 0.85rem;
      color: #707B8A;
    }
    .field-value {
      font-size: 0.9rem;
      font-weight: 500;
      color: #2F3B52;
    }
    .announcement-item {
      padding: 14px 0;
      border-bottom: 1px solid #f0f1f3;
    }
    .announcement-item:last-child { border-bottom: none; }
    .announcement-item h4 {
      margin: 0 0 4px;
      font-size: 0.95rem;
      color: #2F3B52;
    }
    .announcement-item p {
      margin: 0 0 4px;
      font-size: 0.85rem;
      color: #707B8A;
    }
    .announcement-item small {
      color: #9ca3af;
      font-size: 0.75rem;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
    }
    .empty-state i {
      font-size: 2.5rem;
      margin-bottom: 12px;
      display: block;
    }
    .rejection-notice {
      margin-top: 20px;
      border: 1px solid #fecaca;
      background: #fef2f2;
    }
    .rejection-header {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #dc2626;
    }
    .rejection-header h3 { margin: 0; }
    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        padding: 24px 16px;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StaffDashboardComponent implements OnInit {
  profile: StaffProfile | null = null;
  announcements: Announcement[] = [];
  showPlaceholder = false;

  constructor(
    private staffService: StaffService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAnnouncements();
  }

  loadProfile() {
    this.staffService.getProfile().subscribe({
      next: (res) => {
        if (res.success) this.profile = res.data;
      }
    });
  }

  loadAnnouncements() {
    this.staffService.getAnnouncements().subscribe({
      next: (res) => {
        if (res.success) this.announcements = res.data;
      }
    });
  }

  getPassportUrl(): string {
    return this.staffService.getPassportUrl(this.profile?.staffId || '');
  }

  getInitials(): string {
    if (!this.profile?.fullName) return '?';
    return this.profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
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
