import { Routes } from '@angular/router';
import { authGuard } from './_core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'force-change-password',
    loadComponent: () => import('./views/force-change-password/force-change-password.component').then(m => m.ForceChangePasswordComponent)
  },
  {
    path: 'staff',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/staff-layout/staff-layout.component').then(m => m.StaffLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./views/staff/dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./views/staff/profile/staff-profile.component').then(m => m.StaffProfileComponent)
      },
      {
        path: 'bank-details',
        loadComponent: () => import('./views/staff/bank-details/bank-details.component').then(m => m.BankDetailsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./views/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./views/admin/staff-management/staff-management.component').then(m => m.StaffManagementComponent)
      },
      {
        path: 'submissions',
        loadComponent: () => import('./views/admin/submissions/submission-review.component').then(m => m.SubmissionReviewComponent)
      },
      {
        path: 'import',
        loadComponent: () => import('./views/admin/import/excel-import.component').then(m => m.ExcelImportComponent)
      },
      {
        path: 'announcements',
        loadComponent: () => import('./views/admin/announcements/announcement-management.component').then(m => m.AnnouncementManagementComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./views/admin/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
