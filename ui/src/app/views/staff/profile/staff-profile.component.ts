import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../_core/services/staff.service';
import { StaffProfile, StaffUpdateRequest } from '../../../_core/models/staff.model';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>View and update your personal information</p>
      </div>

      <div class="profile-card neco-card">
        <div class="profile-top">
          <div class="passport-section">
            <img
              *ngIf="profile?.passportPhoto && !showPlaceholder"
              [src]="getPassportUrl()"
              alt="Passport"
              class="passport-photo"
              (error)="showPlaceholder = true"
            />
            <div *ngIf="!profile?.passportPhoto || showPlaceholder" class="passport-placeholder">
              {{getInitials()}}
            </div>
            <label class="upload-btn">
              <i class="pi pi-camera"></i>
              <span>Change Photo</span>
              <input type="file" accept="image/*" (change)="onPassportUpload($event)" hidden />
            </label>
          </div>
          <div class="profile-meta">
            <h2>{{profile?.fullName}}</h2>
            <p class="staff-id">{{profile?.staffId}}</p>
            <span class="neco-badge" [ngClass]="getBadgeClass(profile?.accountStatus)">
              {{profile?.accountStatus}}
            </span>
          </div>
        </div>

        <div class="profile-grid">
          <div class="field-group readonly">
            <label>Full Name</label>
            <div class="field-value">{{profile?.fullName}}</div>
          </div>
          <div class="field-group readonly">
            <label>Staff ID</label>
            <div class="field-value">{{profile?.staffId}}</div>
          </div>
          <div class="field-group readonly">
            <label>Designation</label>
            <div class="field-value">{{profile?.designation || 'N/A'}}</div>
          </div>
          <div class="field-group readonly">
            <label>Department</label>
            <div class="field-value">{{profile?.department || 'N/A'}}</div>
          </div>
          <div class="field-group readonly">
            <label>Division</label>
            <div class="field-value">{{profile?.division || 'N/A'}}</div>
          </div>
          <div class="field-group readonly">
            <label>Role</label>
            <div class="field-value">{{profile?.role || 'N/A'}}</div>
          </div>
          <div class="field-group editable">
            <label>Phone Number</label>
            <input
              class="neco-input"
              [(ngModel)]="editPhone"
              placeholder="Enter phone number"
              maxlength="11"
            />
          </div>
          <div class="field-group editable">
            <label>Email Address</label>
            <input
              class="neco-input"
              [(ngModel)]="editEmail"
              placeholder="Enter email address"
              type="email"
            />
          </div>
        </div>

        <div class="profile-actions">
          <div class="success-message" *ngIf="successMessage">
            <i class="pi pi-check-circle"></i> {{successMessage}}
          </div>
          <div class="error-message" *ngIf="errorMessage">
            <i class="pi pi-exclamation-circle"></i> {{errorMessage}}
          </div>
          <button class="neco-btn neco-btn-primary" (click)="saveProfile()" [disabled]="saving">
            <span class="spinner" *ngIf="saving"></span>
            <span *ngIf="!saving"><i class="pi pi-check"></i> Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 {
      margin: 0 0 4px;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2F3B52;
    }
    .page-header p {
      margin: 0;
      color: #707B8A;
      font-size: 0.9rem;
    }
    .profile-top {
      display: flex;
      gap: 24px;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid #f0f1f3;
    }
    .passport-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #1D7A43;
    }
    .passport-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #e8f5e9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 600;
      color: #1D7A43;
    }
    .upload-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 10px;
      font-size: 0.8rem;
      color: #1D7A43;
      cursor: pointer;
      font-weight: 500;
    }
    .profile-meta h2 {
      margin: 0 0 4px;
      font-size: 1.3rem;
      color: #2F3B52;
    }
    .staff-id {
      margin: 0 0 8px;
      font-size: 0.9rem;
      color: #707B8A;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 24px;
    }
    .field-group label {
      display: block;
      font-size: 0.82rem;
      font-weight: 500;
      color: #707B8A;
      margin-bottom: 6px;
    }
    .field-group.readonly .field-value {
      padding: 12px 14px;
      background: #f5f6f8;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #2F3B52;
      min-height: 48px;
      display: flex;
      align-items: center;
    }
    .profile-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      justify-content: flex-end;
    }
    .success-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #16a34a;
      font-size: 0.88rem;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #dc2626;
      font-size: 0.88rem;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 640px) {
      .profile-top { flex-direction: column; text-align: center; }
      .profile-grid { grid-template-columns: 1fr; }
      .profile-actions { flex-direction: column-reverse; }
      .profile-actions .neco-btn { width: 100%; }
    }
  `]
})
export class StaffProfileComponent implements OnInit {
  profile: StaffProfile | null = null;
  editPhone = '';
  editEmail = '';
  saving = false;
  successMessage = '';
  errorMessage = '';
  showPlaceholder = false;

  constructor(private staffService: StaffService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.staffService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profile = res.data;
          this.editPhone = res.data.phoneNumber || '';
          this.editEmail = res.data.email || '';
        }
      }
    });
  }

  saveProfile() {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.staffService.updateProfile({
      phoneNumber: this.editPhone,
      email: this.editEmail
    }).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.profile = res.data;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.error || 'Failed to update profile';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  onPassportUpload(event: any) {
    const file = event.target.files[0];
    if (file && this.profile) {
      this.staffService.uploadPassport(this.profile.staffId, file).subscribe({
        next: () => {
          this.showPlaceholder = false;
          this.loadProfile();
        }
      });
    }
  }

  getPassportUrl(): string {
    return this.staffService.getPassportUrl(this.profile?.staffId || '') + '?t=' + Date.now();
  }

  getInitials(): string {
    if (!this.profile?.fullName) return '?';
    return this.profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getBadgeClass(status: string | undefined): string {
    return status === 'ACTIVE' ? 'neco-badge-approved' : 'neco-badge-rejected';
  }
}
