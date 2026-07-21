import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <img src="assets/images/neco-logo.png" alt="NECO Logo" />
          </div>
          <h1>NECO</h1>
          <p class="subtitle">NECO ICT Adhoc Staff Information Portal</p>
          <p class="tagline">Profile Management &bull; Information Verification &bull; Bank Details Update</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label class="form-label">Staff ID</label>
            <div class="input-wrapper">
              <i class="pi pi-user"></i>
              <input
                type="text"
                class="form-input"
                placeholder="Enter your Staff ID"
                [(ngModel)]="username"
                name="username"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <i class="pi pi-lock"></i>
              <input
                [type]="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Enter your password"
                [(ngModel)]="password"
                name="password"
                required
                autocomplete="current-password"
              />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            <i class="pi pi-exclamation-circle"></i>
            {{errorMessage}}
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="loading"
          >
            <span class="spinner" *ngIf="loading"></span>
            <span *ngIf="!loading">
              <i class="pi pi-sign-in"></i> Sign In
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p>Secure Portal Access &mdash; National Examinations Council</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%);
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 420px;
      padding: 40px 32px;
      animation: slideUp 0.4s ease;
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 4px 16px rgba(29, 122, 67, 0.2);
      overflow: hidden;
      background: white;
    }
    .login-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
    .login-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1D7A43;
      letter-spacing: 0.02em;
    }
    .subtitle {
      margin: 4px 0 0;
      font-size: 0.9rem;
      color: #2F3B52;
      font-weight: 500;
    }
    .tagline {
      margin: 8px 0 0;
      font-size: 0.75rem;
      color: #707B8A;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: #2F3B52;
      margin-bottom: 6px;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .input-wrapper > i {
      position: absolute;
      left: 20px;
      color: #6b7280;
      font-size: 1rem;
      pointer-events: none;
    }
    .form-input {
      width: 100%;
      padding: 12px 48px 12px 44px;
      height: 48px;
      border: 1.5px solid #D8DDE3;
      border-radius: 10px;
      font-size: 0.9rem;
      color: #2F3B52;
      background: #f9fafb;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #1D7A43;
      box-shadow: 0 0 0 3px rgba(29, 122, 67, 0.15);
      background: white;
    }
    .form-input::placeholder {
      color: #9ca3af;
    }
    .toggle-password,
    button.toggle-password {
      position: absolute !important;
      right: 20px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: none !important;
      border: none !important;
      color: #6b7280;
      cursor: pointer;
      padding: 6px;
      font-size: 1rem;
      z-index: 1;
      border-radius: 50%;
      transition: color 0.2s;
      line-height: 1;
      width: auto;
      height: auto;
    }
    .toggle-password:hover,
    button.toggle-password:hover {
      color: #374151;
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
      border: 1px solid #fecaca;
    }
    .login-btn {
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
      gap: 8px;
    }
    .login-btn:hover:not(:disabled) {
      background: #157347;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
    }
    .login-btn:focus {
      box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.15);
    }
    .login-btn:disabled {
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
    .login-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #f0f1f3;
    }
    .login-footer p {
      margin: 0;
      font-size: 0.75rem;
      color: #707B8A;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 480px) {
      .login-card { padding: 32px 20px; border-radius: 14px; }
      .login-header h1 { font-size: 1.7rem; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both Staff ID and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            const user = response.data;
            if (user.firstLogin) {
              this.router.navigate(['/force-change-password']);
            } else if (user.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/staff/dashboard']);
            }
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid Staff ID or password';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server';
          } else {
            this.errorMessage = error.error?.error || 'An error occurred during login';
          }
        }
      });
  }
}
