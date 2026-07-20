import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../_core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img src="assets/images/neco-logo.png" alt="NECO" class="sidebar-logo-img" />
            <div>
              <span class="logo-title">NECO</span>
              <span class="logo-subtitle">Admin Portal</span>
            </div>
          </div>
          <button class="sidebar-close" (click)="sidebarOpen = false">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-home"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/staff" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-users"></i>
            <span>Staff Management</span>
          </a>
          <a routerLink="/admin/submissions" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-check-circle"></i>
            <span>Submissions</span>
          </a>
          <a routerLink="/admin/import" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-file-import"></i>
            <span>Import / Export</span>
          </a>
          <a routerLink="/admin/announcements" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-megaphone"></i>
            <span>Announcements</span>
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item" (click)="sidebarOpen = false">
            <i class="pi pi-chart-bar"></i>
            <span>Reports</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <i class="pi pi-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div class="main-area">
        <header class="top-header">
          <button class="menu-toggle" (click)="sidebarOpen = !sidebarOpen">
            <i class="pi pi-bars"></i>
          </button>
          <div class="header-spacer"></div>
          <div class="header-user" (click)="showUserMenu = !showUserMenu">
            <div class="user-avatar">AD</div>
            <span class="user-name">{{userName}}</span>
            <i class="pi pi-chevron-down"></i>
          </div>
          <div class="user-dropdown" *ngIf="showUserMenu">
            <button (click)="logout()">
              <i class="pi pi-sign-out"></i> Logout
            </button>
          </div>
        </header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; background: #F4F5F5; }
    .sidebar {
      width: 260px; background: #1a1f2e; color: white; display: flex;
      flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 200;
      transition: transform 0.3s ease;
    }
    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sidebar-logo {
      display: flex; align-items: center; gap: 12px;
    }
    .sidebar-logo-img { width: 36px; height: 36px; border-radius: 50%; object-fit: contain; background: white; padding: 2px; }
    .logo-title { font-size: 1.2rem; font-weight: 700; display: block; }
    .logo-subtitle { font-size: 0.7rem; color: rgba(255,255,255,0.5); display: block; }
    .sidebar-close {
      background: none; border: none; color: white; font-size: 1.2rem;
      cursor: pointer; display: none; padding: 4px;
    }
    .sidebar-nav { flex: 1; padding: 16px 12px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      color: rgba(255,255,255,0.7); text-decoration: none; border-radius: 10px;
      font-size: 0.9rem; transition: all 0.2s; margin-bottom: 4px; border: none;
      background: none; width: 100%; cursor: pointer;
    }
    .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-item.active { background: #1D7A43; color: white; font-weight: 500; }
    .sidebar-footer { padding: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn { color: #fca5a5; }
    .logout-btn:hover { background: rgba(220,38,38,0.2); color: #fca5a5; }
    .main-area { flex: 1; margin-left: 260px; display: flex; flex-direction: column; }
    .top-header {
      height: 64px; background: white; border-bottom: 1px solid #e5e7eb;
      display: flex; align-items: center; padding: 0 24px; gap: 12px;
      position: sticky; top: 0; z-index: 100;
    }
    .menu-toggle {
      display: none; background: none; border: none; font-size: 1.3rem;
      color: #2F3B52; cursor: pointer; padding: 8px;
    }
    .header-spacer { flex: 1; }
    .header-user {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      padding: 6px 12px; border-radius: 10px; position: relative;
    }
    .header-user:hover { background: #f3f4f6; }
    .user-avatar {
      width: 36px; height: 36px; background: #7c3aed; color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 600;
    }
    .user-name { font-size: 0.88rem; font-weight: 500; color: #2F3B52; }
    .user-dropdown {
      position: absolute; top: 100%; right: 0; background: white;
      border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      min-width: 200px; padding: 8px; margin-top: 8px; z-index: 200;
    }
    .user-dropdown button {
      display: flex; align-items: center; gap: 10px; padding: 10px 14px;
      color: #2F3B52; border: none; background: none;
      width: 100%; font-size: 0.88rem; border-radius: 8px; cursor: pointer;
    }
    .user-dropdown button:hover { background: #f3f4f6; }
    .main-content { flex: 1; padding: 24px; }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .sidebar-close { display: block; }
      .main-area { margin-left: 0; }
      .menu-toggle { display: block; }
      .user-name { display: none; }
      .main-content { padding: 16px; }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = false;
  showUserMenu = false;
  userName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.fullName;
    }
  }

  logout() {
    this.authService.logout();
  }
}
