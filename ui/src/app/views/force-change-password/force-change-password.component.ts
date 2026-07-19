import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_core/services/auth.service';

@Component({
  selector: 'app-force-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="change-password-page">
      <div class="change-card">
        <div class="change-header">
          <div class="change-icon">
            <i class="pi pi-key"></i>
          </div>
          <h2>Change Your Password</h2>
          <p>For security purposes, please change your default password before continuing.</p>
        </div>

        <form (ngSubmit)="onChangePassword()" class="change-form">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                [type]="showCurrent ? 'text' : 'password'"
                class="form-input"
                placeholder="Enter current password"
                [(ngModel)]="currentPassword"
                name="currentPassword"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                [type]="showNew ? 'text' : 'password'"
                class="form-input"
                placeholder="Enter new password (min 6 characters)"
                [(ngModel)]="newPassword"
                name="newPassword"
                required
                minlength="6"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                [type]="showConfirm ? 'text' : 'password'"
                class="form-input"
                placeholder="Confirm new password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <i class="pi pi-exclamation-circle"></i>
            {{errorMessage}}
          </div>

          <div class="success-message" *ngIf="successMessage">
            <i class="pi pi-check-circle"></i>
            {{successMessage}}
          </div>

          <button type="submit" class="change-btn" [disabled]="loading">
            <span class="spinner" *ngIf="loading"></span>
            <span *ngIf="!loading">Update Password</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .change-password-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 140px);
      padding: 20px;
    }
    .change-card {
      background: white;
      border-radius: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 420px;
      padding: 40px 32px;
    }
    .change-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .change-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #1D7A43 0%, #186A3A 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      color: white;
      font-size: 1.6rem;
    }
    .change-header h2 {
      margin: 0 0 8px;
      font-size: 1.4rem;
      color: #2F3B52;
    }
    .change-header p {
      margin: 0;
      font-size: 0.85rem;
      color: #707B8A;
    }
    .form-group { margin-bottom: 18px; }
    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: #2F3B52;
      margin-bottom: 6px;
    }
    .input-wrapper {
      position: relative;
    }
    .input-wrapper i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
    }
    .form-input {
      width: 100%;
      padding: 12px 14px 12px 44px;
      height: 48px;
      border: 1.5px solid #D8DDE3;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #2F3B52;
      background: #f9fafb;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #1D7A43;
      box-shadow: 0 0 0 3px rgba(29, 122, 67, 0.15);
      background: white;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fef2f2;
      color: #dc2626;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f0fdf4;
      color: #16a34a;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }
    .change-btn {
      width: 100%;
      height: 48px;
      background: #198754;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .change-btn:hover:not(:disabled) {
      background: #157347;
      transform: translateY(-1px);
    }
    .change-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2.5px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ForceChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onChangePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    this.loading = true;

    this.authService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          const user = this.authService.getCurrentUser();
          if (user) {
            user.firstLogin = false;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.successMessage = 'Password updated successfully!';
          setTimeout(() => {
            if (user?.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/staff/dashboard']);
            }
          }, 1500);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'Failed to change password';
      }
    });
  }
}
