import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../_core/services/auth.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="public-layout">
      <header class="public-header">
        <div class="header-content">
          <a routerLink="/" class="logo-section">
            <div class="neco-logo">
              <img src="assets/images/neco-logo.png" alt="NECO" class="neco-logo-img" />
            </div>
            <div class="logo-text">
              <span class="org-name">National Examinations Council</span>
              <span class="portal-name">NECO</span>
            </div>
          </a>
          <a routerLink="/" class="home-icon" title="Home">
            <i class="pi pi-home"></i>
          </a>
        </div>
      </header>
      <main class="public-main">
        <div class="public-content">
          <router-outlet></router-outlet>
        </div>
      </main>
      <footer class="public-footer">
        <p>&copy; {{currentYear}} National Examinations Council (NECO). All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f7f5;
    }
    .public-header {
      background: #1D7A43;
      height: 70px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    .neco-logo {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .neco-logo-img { width: 100%; height: 100%; object-fit: contain; }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .org-name {
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .portal-name {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.75rem;
      font-weight: 400;
    }
    .home-icon {
      color: rgba(255, 255, 255, 0.85);
      font-size: 1.2rem;
      text-decoration: none;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .home-icon:hover {
      background: rgba(255, 255, 255, 0.25);
      color: white;
    }
    .public-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }
    .public-content {
      width: 100%;
      max-width: 480px;
    }
    .public-footer {
      background: #fafafa;
      padding: 16px 24px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .public-footer p {
      margin: 0;
      font-size: 0.78rem;
      color: #707B8A;
    }
    @media (max-width: 480px) {
      .public-header { height: 60px; padding: 0 16px; }
      .org-name { font-size: 0.8rem; }
      .neco-logo { width: 36px; height: 36px; font-size: 1rem; }
      .public-main { padding: 20px 12px; }
    }
  `]
})
export class PublicLayoutComponent {
  currentYear = new Date().getFullYear();
}
