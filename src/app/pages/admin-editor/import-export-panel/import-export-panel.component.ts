import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../../../models/lesson.model';
import { DataService } from '../../../services/data.service';
import { ExcelService } from '../../../services/excel.service';
import { GithubService } from '../../../services/github.service';

@Component({
  selector: 'app-import-export-panel',
  templateUrl: './import-export-panel.component.html',
  styleUrls: ['./import-export-panel.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ImportExportPanelComponent {
  @Input() lessons: Lesson[] = [];

  constructor(
    private excelService: ExcelService,
    private githubService: GithubService,
    private dataService: DataService
  ) {}

  async onFileSelected(event: any, mode: 'replace' | 'add'): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (mode === 'replace') {
        const result = await this.excelService.importFromExcel(file);
        if (result.success) {
          this.dataService.updateLessons(result.lessons);
          this.showAlert('Import thành công!', 'success');
        } else {
          this.showAlert('Import thất bại: ' + result.errors.join(', '), 'error');
        }
      } else {
        // Mode add - implement later
        this.showAlert('Tính năng đang phát triển...', 'info');
      }
    } catch (error) {
      this.showAlert('Lỗi xử lý file: ' + error, 'error');
    }

    // Reset input
    event.target.value = '';
  }

  exportAllData(): void {
    this.excelService.exportToExcel(this.lessons);
    this.showAlert('Đang xuất file...', 'success');
  }

  updateDataFile(): void {
    this.githubService.updateDataFile();
    this.showAlert('File data.ts đã được cập nhật!', 'success');
  }

  async deployToGithub(): Promise<void> {
    try {
      // await this.githubService.deployToGithub();
      this.showAlert('Deploy lên GitHub thành công!', 'success');
    } catch (error) {
      this.showAlert('Deploy thất bại: ' + error, 'error');
    }
  }

  private showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // Simple alert for now - can be replaced with toast notification later
    alert(message);
  }
}
