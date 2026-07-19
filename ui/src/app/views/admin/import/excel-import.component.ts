import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../_core/services/admin.service';
import { ImportRow, ImportResult } from '../../../_core/models/admin.model';

@Component({
  selector: 'app-excel-import',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="excel-import">
      <div class="page-header">
        <h1>Import / Export</h1>
        <p>Import staff data from Excel files and export records</p>
      </div>

      <!-- Import Section -->
      <div class="neco-card">
        <div class="neco-card-header">
          <i class="pi pi-cloud-upload"></i> Import Staff Data
        </div>

        <!-- Step 1: Upload -->
        <div class="step" *ngIf="currentStep === 1">
          <div class="step-label">Step 1: Upload Excel File</div>
          <div
            class="upload-area"
            [class.drag-over]="isDragOver"
            (dragover)="onDragOver($event)"
            (dragleave)="isDragOver = false"
            (drop)="onDrop($event)"
            (click)="fileInput.click()"
          >
            <input
              #fileInput
              type="file"
              accept=".xlsx,.xls"
              (change)="onFileSelected($event)"
              style="display: none;"
            />
            <div class="upload-content" *ngIf="!selectedFile">
              <i class="pi pi-cloud-upload upload-icon"></i>
              <p class="upload-title">Click or drag Excel file here</p>
              <p class="upload-hint">Supports .xlsx and .xls files</p>
            </div>
            <div class="upload-content" *ngIf="selectedFile">
              <i class="pi pi-file-excel upload-icon" style="color: #059669;"></i>
              <p class="upload-title">{{selectedFile.name}}</p>
              <p class="upload-hint">{{formatFileSize(selectedFile.size)}}</p>
            </div>
          </div>
          <div class="step-actions">
            <button
              class="neco-btn neco-btn-primary"
              (click)="previewFile()"
              [disabled]="!selectedFile || previewLoading"
            >
              <span class="neco-spinner" *ngIf="previewLoading"></span>
              <span *ngIf="!previewLoading"><i class="pi pi-eye"></i> Preview Data</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Preview -->
        <div class="step" *ngIf="currentStep === 2">
          <div class="step-label">Step 2: Preview Results</div>
          <div class="preview-info">
            <span class="info-badge valid"><i class="pi pi-check"></i> {{validCount}} valid</span>
            <span class="info-badge duplicate"><i class="pi pi-copy"></i> {{duplicateCount}} duplicates</span>
            <span class="info-badge error" *ngIf="errorCount > 0"><i class="pi pi-exclamation-circle"></i> {{errorCount}} errors</span>
          </div>
          <div class="preview-table-wrap">
            <table class="preview-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Staff ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Division</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of previewRows" [class.error-row]="!row.valid" [class.duplicate-row]="row.duplicate">
                  <td>{{row.rowNumber}}</td>
                  <td class="staff-id-cell">{{row.staffId}}</td>
                  <td>{{row.fullName}}</td>
                  <td>{{row.department}}</td>
                  <td>{{row.division}}</td>
                  <td>
                    <span class="neco-badge neco-badge-approved" *ngIf="row.valid && !row.duplicate">Valid</span>
                    <span class="neco-badge neco-badge-submitted" *ngIf="row.duplicate">Duplicate</span>
                    <span class="neco-badge neco-badge-rejected" *ngIf="!row.valid">Error</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="error-list" *ngIf="allErrors.length > 0">
            <h4>Errors:</h4>
            <ul>
              <li *ngFor="let err of allErrors">{{err}}</li>
            </ul>
          </div>
          <div class="step-actions">
            <button class="neco-btn neco-btn-outline" (click)="resetImport()">
              <i class="pi pi-arrow-left"></i> Back
            </button>
            <button
              class="neco-btn neco-btn-primary"
              (click)="confirmImport()"
              [disabled]="confirmLoading || validCount === 0"
            >
              <span class="neco-spinner" *ngIf="confirmLoading"></span>
              <span *ngIf="!confirmLoading"><i class="pi pi-check"></i> Confirm Import ({{validCount}} rows)</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Result -->
        <div class="step" *ngIf="currentStep === 3 && importResult">
          <div class="step-label">Step 3: Import Complete</div>
          <div class="import-result">
            <div class="result-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <h3>Import Finished</h3>
            <div class="result-stats">
              <div class="result-stat">
                <span class="result-number">{{importResult.totalRows}}</span>
                <span class="result-label">Total Rows</span>
              </div>
              <div class="result-stat success">
                <span class="result-number">{{importResult.importedCount}}</span>
                <span class="result-label">Imported</span>
              </div>
              <div class="result-stat skipped">
                <span class="result-number">{{importResult.skippedCount}}</span>
                <span class="result-label">Skipped</span>
              </div>
            </div>
            <div class="error-list" *ngIf="importResult.errors.length > 0">
              <h4>Errors:</h4>
              <ul>
                <li *ngFor="let err of importResult.errors">{{err}}</li>
              </ul>
            </div>
          </div>
          <div class="step-actions">
            <button class="neco-btn neco-btn-primary" (click)="resetImport()">
              <i class="pi pi-refresh"></i> Import Another File
            </button>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="neco-card export-section">
        <div class="neco-card-header">
          <i class="pi pi-download"></i> Export Data
        </div>
        <div class="export-grid">
          <div class="export-item">
            <div class="export-info">
              <i class="pi pi-users export-icon" style="background: #d1fae5; color: #059669;"></i>
              <div>
                <h4>Export All Staff</h4>
                <p>Download complete staff list as Excel file</p>
              </div>
            </div>
            <button class="neco-btn neco-btn-primary neco-btn-sm" (click)="exportStaff()">
              <i class="pi pi-download"></i> Download
            </button>
          </div>
          <div class="export-item">
            <div class="export-info">
              <i class="pi pi-send export-icon" style="background: #dbeafe; color: #1d4ed8;"></i>
              <div>
                <h4>Export All Submissions</h4>
                <p>Download all bank detail submissions</p>
              </div>
            </div>
            <button class="neco-btn neco-btn-primary neco-btn-sm" (click)="exportSubmissions()">
              <i class="pi pi-download"></i> Download
            </button>
          </div>
          <div class="export-item">
            <div class="export-info">
              <i class="pi pi-check-circle export-icon" style="background: #d1fae5; color: #059669;"></i>
              <div>
                <h4>Export Approved Submissions</h4>
                <p>Download only approved submissions</p>
              </div>
            </div>
            <button class="neco-btn neco-btn-primary neco-btn-sm" (click)="exportSubmissions('APPROVED')">
              <i class="pi pi-download"></i> Download
            </button>
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
    .excel-import { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; color: #2F3B52; }
    .page-header p { margin: 0; color: #707B8A; font-size: 0.9rem; }
    .neco-card { margin-bottom: 20px; }
    .step-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1D7A43;
      margin-bottom: 16px;
    }
    .upload-area {
      border: 2px dashed #D8DDE3;
      border-radius: 16px;
      padding: 48px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #fafbfc;
    }
    .upload-area:hover, .upload-area.drag-over {
      border-color: #1D7A43;
      background: rgba(29, 122, 67, 0.03);
    }
    .upload-icon { font-size: 3rem; color: #9ca3af; margin-bottom: 12px; display: block; }
    .upload-title { margin: 0 0 4px; font-size: 1rem; font-weight: 600; color: #2F3B52; }
    .upload-hint { margin: 0; font-size: 0.82rem; color: #707B8A; }
    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      justify-content: flex-end;
    }
    .preview-info {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .info-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 500;
    }
    .info-badge.valid { background: #d1fae5; color: #059669; }
    .info-badge.duplicate { background: #dbeafe; color: #1d4ed8; }
    .info-badge.error { background: #fee2e2; color: #dc2626; }
    .preview-table-wrap { overflow-x: auto; }
    .preview-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .preview-table th {
      text-align: left;
      padding: 10px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #707B8A;
      text-transform: uppercase;
      border-bottom: 2px solid #f0f1f3;
      white-space: nowrap;
    }
    .preview-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #f0f1f3;
      color: #2F3B52;
    }
    .preview-table tr:hover td { background: #f9fafb; }
    .staff-id-cell { font-family: monospace; font-weight: 600; color: #1D7A43; }
    .error-row td { background: #fef2f2 !important; }
    .duplicate-row td { background: #eff6ff !important; }
    .error-list {
      margin-top: 16px;
      padding: 16px;
      background: #fef2f2;
      border-radius: 12px;
      border: 1px solid #fecaca;
    }
    .error-list h4 { margin: 0 0 8px; font-size: 0.9rem; color: #dc2626; }
    .error-list ul { margin: 0; padding-left: 20px; }
    .error-list li { font-size: 0.82rem; color: #991b1b; margin-bottom: 4px; }
    .import-result { text-align: center; padding: 20px 0; }
    .result-icon { font-size: 3rem; color: #059669; margin-bottom: 12px; }
    .import-result h3 { margin: 0 0 20px; color: #2F3B52; }
    .result-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 20px;
    }
    .result-stat { text-align: center; }
    .result-number { display: block; font-size: 2rem; font-weight: 700; color: #2F3B52; }
    .result-stat.success .result-number { color: #059669; }
    .result-stat.skipped .result-number { color: #d97706; }
    .result-label { font-size: 0.82rem; color: #707B8A; }
    .export-section { margin-top: 24px; }
    .export-grid { display: flex; flex-direction: column; gap: 14px; }
    .export-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1px solid #f0f1f3;
      border-radius: 12px;
    }
    .export-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .export-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .export-info h4 { margin: 0 0 2px; font-size: 0.9rem; color: #2F3B52; }
    .export-info p { margin: 0; font-size: 0.8rem; color: #707B8A; }
    @media (max-width: 640px) {
      .upload-area { padding: 32px 16px; }
      .step-actions { flex-direction: column; }
      .step-actions .neco-btn { width: 100%; }
      .result-stats { gap: 20px; }
      .export-item { flex-direction: column; gap: 12px; align-items: flex-start; }
      .export-item .neco-btn { width: 100%; }
    }
  `]
})
export class ExcelImportComponent {
  selectedFile: File | null = null;
  currentStep = 1;
  isDragOver = false;
  previewLoading = false;
  confirmLoading = false;
  previewRows: ImportRow[] = [];
  allErrors: string[] = [];
  importResult: ImportResult | null = null;
  toastMessage = '';

  get validCount(): number {
    return this.previewRows.filter(r => r.valid && !r.duplicate).length;
  }
  get duplicateCount(): number {
    return this.previewRows.filter(r => r.duplicate).length;
  }
  get errorCount(): number {
    return this.previewRows.filter(r => !r.valid).length;
  }

  constructor(private adminService: AdminService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.setFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files[0]);
    }
  }

  setFile(file: File): void {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      this.toastMessage = 'Please select an Excel file (.xlsx or .xls)';
      return;
    }
    this.selectedFile = file;
  }

  previewFile(): void {
    if (!this.selectedFile) return;
    this.previewLoading = true;
    this.adminService.previewImport(this.selectedFile).subscribe({
      next: (res) => {
        this.previewLoading = false;
        if (res.success) {
          this.previewRows = res.data;
          this.allErrors = this.previewRows
            .filter(r => r.errors && r.errors.length > 0)
            .flatMap(r => r.errors);
          this.currentStep = 2;
        }
      },
      error: (err) => {
        this.previewLoading = false;
        this.toastMessage = err.error?.message || 'Failed to preview file';
      }
    });
  }

  confirmImport(): void {
    if (!this.selectedFile) return;
    this.confirmLoading = true;
    this.adminService.confirmImport(this.selectedFile).subscribe({
      next: (res) => {
        this.confirmLoading = false;
        if (res.success) {
          this.importResult = res.data;
          this.currentStep = 3;
        }
      },
      error: (err) => {
        this.confirmLoading = false;
        this.toastMessage = err.error?.message || 'Failed to import file';
      }
    });
  }

  resetImport(): void {
    this.selectedFile = null;
    this.currentStep = 1;
    this.previewRows = [];
    this.allErrors = [];
    this.importResult = null;
  }

  exportStaff(): void {
    window.open(this.adminService.exportStaff(), '_blank');
  }

  exportSubmissions(status?: string): void {
    window.open(this.adminService.exportSubmissions(status), '_blank');
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
}
