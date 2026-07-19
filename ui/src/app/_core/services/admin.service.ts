import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../config';
import { DashboardStats, AdminStaff, Submission, PagedResponse, ApiResponse, ImportRow, ImportResult } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${Config.apiUrl}/admin/dashboard`);
  }

  getAllStaff(search?: string, page: number = 0, size: number = 10): Observable<ApiResponse<PagedResponse<AdminStaff>>> {
    let params: any = { page, size };
    if (search) params.search = search;
    return this.http.get<ApiResponse<PagedResponse<AdminStaff>>>(`${Config.apiUrl}/admin/staff`, { params });
  }

  resetPassword(staffId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/admin/staff/${staffId}/reset-password`, {});
  }

  toggleStaffStatus(staffId: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/admin/staff/${staffId}/toggle-status`, {});
  }

  getAllSubmissions(status?: string, page: number = 0, size: number = 10): Observable<ApiResponse<PagedResponse<Submission>>> {
    let params: any = { page, size };
    if (status) params.status = status;
    return this.http.get<ApiResponse<PagedResponse<Submission>>>(`${Config.apiUrl}/admin/submissions`, { params });
  }

  approveSubmission(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/admin/submissions/${id}/approve`, {});
  }

  rejectSubmission(id: number, reason: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/admin/submissions/${id}/reject`, { reason });
  }

  reopenSubmission(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/admin/submissions/${id}/reopen`, {});
  }

  previewImport(file: File): Observable<ApiResponse<ImportRow[]>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<ImportRow[]>>(`${Config.apiUrl}/admin/import/preview`, formData);
  }

  confirmImport(file: File): Observable<ApiResponse<ImportResult>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<ImportResult>>(`${Config.apiUrl}/admin/import/confirm`, formData);
  }

  exportStaff(): string {
    return `${Config.apiUrl}/admin/export/staff`;
  }

  exportSubmissions(status?: string): string {
    let url = `${Config.apiUrl}/admin/export/submissions`;
    if (status) url += `?status=${status}`;
    return url;
  }
}
