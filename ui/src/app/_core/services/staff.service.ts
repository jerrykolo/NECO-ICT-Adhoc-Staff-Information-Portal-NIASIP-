import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../config';
import { StaffProfile, StaffUpdateRequest } from '../models/staff.model';
import { BankDetails, BankDetailsRequest, BankListItem } from '../models/bank.model';
import { Announcement, ApiResponse } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<StaffProfile>> {
    return this.http.get<ApiResponse<StaffProfile>>(`${Config.apiUrl}/staff/profile`);
  }

  updateProfile(request: StaffUpdateRequest): Observable<ApiResponse<StaffProfile>> {
    return this.http.put<ApiResponse<StaffProfile>>(`${Config.apiUrl}/staff/profile`, request);
  }

  getBankDetails(): Observable<ApiResponse<BankDetails>> {
    return this.http.get<ApiResponse<BankDetails>>(`${Config.apiUrl}/staff/bank-details`);
  }

  saveDraftBankDetails(request: BankDetailsRequest): Observable<ApiResponse<BankDetails>> {
    return this.http.put<ApiResponse<BankDetails>>(`${Config.apiUrl}/staff/bank-details/draft`, request);
  }

  submitBankDetails(request: BankDetailsRequest): Observable<ApiResponse<BankDetails>> {
    return this.http.post<ApiResponse<BankDetails>>(`${Config.apiUrl}/staff/bank-details/submit`, request);
  }

  getBanks(): Observable<ApiResponse<BankListItem[]>> {
    return this.http.get<ApiResponse<BankListItem[]>>(`${Config.apiUrl}/banks`);
  }

  getAnnouncements(): Observable<ApiResponse<Announcement[]>> {
    return this.http.get<ApiResponse<Announcement[]>>(`${Config.apiUrl}/announcements/active`);
  }

  uploadPassport(staffId: string, file: File): Observable<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<any>>(`${Config.apiUrl}/files/passport/${staffId}`, formData);
  }

  getPassportUrl(staffId: string): string {
    return `${Config.apiUrl}/files/passport/${staffId}`;
  }
}
