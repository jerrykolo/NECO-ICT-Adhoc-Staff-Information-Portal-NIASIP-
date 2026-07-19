import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../../../_core/services/announcement.service';
import { Announcement } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-announcement-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="announcement-management">
      <div class="page-header">
        <h1>Announcements</h1>
        <p>Create and manage announcements for staff members</p>
      </div>

      <div class="content-grid">
        <!-- Create / Edit Form -->
        <div class="neco-card form-card">
          <div class="neco-card-header">
            <i class="pi pi-plus-circle"></i>
            {{editingId ? 'Edit Announcement' : 'Create Announcement'}}
          </div>
          <form (ngSubmit)="saveAnnouncement()">
            <div class="neco-form-group">
              <label class="neco-label">Title *</label>
              <input
                class="neco-input"
                [(ngModel)]="formData.title"
                name="title"
                placeholder="Announcement title"
                required
              />
            </div>
            <div class="neco-form-group">
              <label class="neco-label">Content *</label>
              <textarea
                class="neco-textarea"
                [(ngModel)]="formData.content"
                name="content"
                placeholder="Write the announcement content..."
                rows="5"
                required
              ></textarea>
            </div>
            <div class="form-actions">
              <button
                *ngIf="editingId"
                type="button"
                class="neco-btn neco-btn-outline"
                (click)="cancelEdit()"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="neco-btn neco-btn-primary"
                [disabled]="!formData.title.trim() || !formData.content.trim() || saving"
              >
                <span class="neco-spinner" *ngIf="saving"></span>
                <span *ngIf="!saving">
                  <i [class]="editingId ? 'pi pi-check' : 'pi pi-plus'"></i>
                  {{editingId ? 'Update' : 'Create'}}
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Announcements List -->
        <div class="list-card">
          <div class="neco-card-header">
            <i class="pi pi-megaphone"></i> All Announcements
          </div>

          <div class="neco-loading" *ngIf="loading">
            <div class="neco-spinner"></div>
          </div>

          <div class="announcement-list" *ngIf="!loading">
            <div class="announcement-item neco-card" *ngFor="let ann of announcements" [class.inactive-item]="!ann.active">
              <div class="ann-header">
                <div class="ann-title-row">
                  <h3>{{ann.title}}</h3>
                  <span class="neco-badge" [ngClass]="ann.active ? 'neco-badge-approved' : 'neco-badge-draft'">
                    {{ann.active ? 'Active' : 'Inactive'}}
                  </span>
                </div>
                <small class="ann-date">{{ann.publishedAt | date:'medium'}}</small>
              </div>
              <p class="ann-content">{{ann.content}}</p>
              <div class="ann-actions">
                <button
                  class="neco-btn neco-btn-outline neco-btn-sm"
                  (click)="toggleActive(ann)"
                  [disabled]="saving"
                >
                  <i [class]="ann.active ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  {{ann.active ? 'Deactivate' : 'Activate'}}
                </button>
                <button
                  class="neco-btn neco-btn-outline neco-btn-sm"
                  (click)="editAnnouncement(ann)"
                  [disabled]="saving"
                >
                  <i class="pi pi-pencil"></i> Edit
                </button>
                <button
                  class="neco-btn neco-btn-danger neco-btn-sm"
                  (click)="deleteAnnouncement(ann)"
                  [disabled]="saving"
                >
                  <i class="pi pi-trash"></i> Delete
                </button>
              </div>
            </div>

            <div class="empty-state" *ngIf="announcements.length === 0">
              <i class="pi pi-inbox"></i>
              <p>No announcements yet</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast -->
      <div class="neco-modal-overlay" *ngIf="toastMessage" (click)="toastMessage = ''">
        <div class="neco-modal" (click)="$event.stopPropagation()" style="max-width: 400px;">
          <div class="neco-modal-header">
            <h3 class="neco-modal-title">Notification</h3>
            <button class="neco-modal-close" (click)="toastMessage = ''">&times;</button>
          </div>
          <div class="neco-modal-body">
            <p>{{toastMessage}}</p>
          </div>
          <div class="neco-modal-footer">
            <button class="neco-btn neco-btn-primary" (click)="toastMessage = ''">OK</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .announcement-management { max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .content-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
      align-items: start;
    }
    .form-card { position: sticky; top: 20px; }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .list-card .neco-card-header {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2F3B52;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #D8DDE3;
    }
    .announcement-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .announcement-item {
      padding: 18px;
      transition: opacity 0.2s;
    }
    .inactive-item { opacity: 0.7; }
    .ann-header { margin-bottom: 10px; }
    .ann-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;
    }
    .ann-title-row h3 { margin: 0; font-size: 1rem; color: #2F3B52; }
    .ann-date { color: #9ca3af; font-size: 0.78rem; }
    .ann-content {
      margin: 0 0 14px;
      font-size: 0.88rem;
      color: #707B8A;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .ann-actions {
      display: flex;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #f0f1f3;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #9ca3af;
    }
    .empty-state i { font-size: 2.5rem; margin-bottom: 12px; display: block; }
    @media (max-width: 768px) {
      .content-grid { grid-template-columns: 1fr; }
      .form-card { position: static; }
      .ann-title-row { flex-direction: column; align-items: flex-start; gap: 6px; }
      .ann-actions { flex-wrap: wrap; }
    }
  `]
})
export class AnnouncementManagementComponent implements OnInit {
  announcements: Announcement[] = [];
  formData = { title: '', content: '' };
  editingId: number | null = null;
  loading = true;
  saving = false;
  toastMessage = '';

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.loading = true;
    this.announcementService.getAll().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) this.announcements = res.data;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  saveAnnouncement(): void {
    if (!this.formData.title.trim() || !this.formData.content.trim()) return;
    this.saving = true;

    if (this.editingId) {
      this.announcementService.update(this.editingId, this.formData.title.trim(), this.formData.content.trim(), true).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.toastMessage = 'Announcement updated successfully';
            this.cancelEdit();
            this.loadAnnouncements();
          }
        },
        error: (err) => {
          this.saving = false;
          this.toastMessage = err.error?.message || 'Failed to update announcement';
        }
      });
    } else {
      this.announcementService.create(this.formData.title.trim(), this.formData.content.trim()).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.success) {
            this.toastMessage = 'Announcement created successfully';
            this.formData = { title: '', content: '' };
            this.loadAnnouncements();
          }
        },
        error: (err) => {
          this.saving = false;
          this.toastMessage = err.error?.message || 'Failed to create announcement';
        }
      });
    }
  }

  editAnnouncement(ann: Announcement): void {
    this.editingId = ann.id;
    this.formData = { title: ann.title, content: ann.content };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.formData = { title: '', content: '' };
  }

  toggleActive(ann: Announcement): void {
    this.saving = true;
    this.announcementService.update(ann.id, ann.title, ann.content, !ann.active).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          ann.active = !ann.active;
          this.toastMessage = `Announcement ${ann.active ? 'activated' : 'deactivated'}`;
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastMessage = err.error?.message || 'Failed to update announcement';
      }
    });
  }

  deleteAnnouncement(ann: Announcement): void {
    if (!confirm(`Delete announcement "${ann.title}"? This cannot be undone.`)) return;
    this.saving = true;
    this.announcementService.delete(ann.id).subscribe({
      next: (res) => {
        this.saving = false;
        if (res.success) {
          this.toastMessage = 'Announcement deleted';
          if (this.editingId === ann.id) this.cancelEdit();
          this.loadAnnouncements();
        }
      },
      error: (err) => {
        this.saving = false;
        this.toastMessage = err.error?.message || 'Failed to delete announcement';
      }
    });
  }
}
