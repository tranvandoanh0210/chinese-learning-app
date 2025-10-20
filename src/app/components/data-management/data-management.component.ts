import { Component, inject, OnInit } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { ExcelImportResult, ExcelService } from '../../services/excel.service';
import { DeploymentResult, GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [HttpClient],
})
export class DataManagementComponent implements OnInit {
  importResult: ExcelImportResult | null = null;
  importedLessons: Lesson[] = [];
  deploymentStatus: DeploymentResult | null = null;
  isDeploying = false;
  githubConnected = false;
  private excelService = inject(ExcelService);
  private dataService = inject(DataService);
  private githubService = inject(GithubService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  constructor() {
    console.log('DataManagementComponent constructor called');
  }

  async ngOnInit() {
    console.log('DataManagementComponent ngOnInit called');
    // Kiểm tra kết nối GitHub
    try {
      this.githubConnected = await this.githubService.testConnection();
      console.log('GitHub connection:', this.githubConnected);
    } catch (error) {
      console.error('GitHub connection error:', error);
      this.githubConnected = false;
    }
  }
  async exportData() {
    try {
      const lessons = this.dataService.getAllLessons();
      await this.excelService.exportToExcel(lessons);
      console.log('Export successful');
    } catch (error) {
      console.error('Export error:', error);
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      this.importResult = await this.excelService.importFromExcel(file);
      console.log(this.importResult);

      this.importedLessons = this.importResult.lessons;
      this.deploymentStatus = null;
      console.log('Import result:', this.importResult);
    } catch (error) {
      console.error('Import error:', error);
    }
  }

  async saveAndDeploy() {
    if (!this.importedLessons.length) return;

    this.isDeploying = true;
    this.deploymentStatus = null;

    try {
      // 1. Lưu dữ liệu cục bộ
      this.dataService.updateLessons(this.importedLessons);

      // 2. Tạo commit message
      const lessonNames = this.importedLessons.map((lesson) => lesson.name_vi).join(', ');
      const commitMessage = `Feat (data) : Update data ${lessonNames} - ${new Date().toLocaleString(
        'vi-VN'
      )}`;

      // 3. Deploy lên GitHub
      this.deploymentStatus = await this.githubService.commitAndDeploy(
        this.importedLessons,
        commitMessage
      );

      // 4. Reset form nếu thành công
      if (this.deploymentStatus.success) {
        setTimeout(() => {
          this.importResult = null;
          this.importedLessons = [];
        }, 3000);
      }
    } catch (error) {
      this.deploymentStatus = {
        success: false,
        message: `Lỗi deploy: ${error}`,
      };
    } finally {
      this.isDeploying = false;
    }
  }

  saveLocally() {
    if (!this.importedLessons.length) return;

    this.dataService.updateLessons(this.importedLessons);
    this.importResult = null;
    this.importedLessons = [];

    this.deploymentStatus = {
      success: true,
      message: 'Đã lưu dữ liệu cục bộ thành công!',
    };
  }
}
