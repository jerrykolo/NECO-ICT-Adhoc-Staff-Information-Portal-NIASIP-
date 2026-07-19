import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../config';
import { Announcement, ApiResponse } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Announcement[]>> {
    return this.http.get<ApiResponse<Announcement[]>>(`${Config.apiUrl}/announcements`);
  }

  create(title: string, content: string): Observable<ApiResponse<Announcement>> {
    return this.http.post<ApiResponse<Announcement>>(`${Config.apiUrl}/announcements`, { title, content });
  }

  update(id: number, title: string, content: string, active: boolean): Observable<ApiResponse<Announcement>> {
    return this.http.put<ApiResponse<Announcement>>(`${Config.apiUrl}/announcements/${id}`, { title, content, active });
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${Config.apiUrl}/announcements/${id}`);
  }
}
