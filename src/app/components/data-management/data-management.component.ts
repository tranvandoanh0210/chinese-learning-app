import { Component, inject } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { ExcelImportResult, ExcelService } from '../../services/excel.service';
import { DeploymentResult, GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [HttpClient],
})
export class DataManagementComponent {
  importResult: ExcelImportResult | null = null;
  deploymentStatus: DeploymentResult | null = null;
  isDeploying = false;

  showTokenDialog = false;
  tokenForm: FormGroup;
  isSubmittingToken = false;

  private excelService = inject(ExcelService);
  private dataService = inject(DataService);
  private githubService = inject(GithubService);
  constructor(private fb: FormBuilder) {
    this.tokenForm = this.fb.group({
      githubToken: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  async copyToken(tokenToCopy: string) {
    try {
      await navigator.clipboard.writeText(tokenToCopy);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  }
  async exportData() {
    try {
      const lessons = this.dataService.getAllLessons();
      await this.excelService.exportToExcel(lessons);
    } catch (error) {
      console.error('Export error:', error);
    }
  }

  async onFileSelected(event: any, mode: 'replace' | 'add') {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (mode === 'replace') {
        this.importResult = await this.excelService.importFromExcel(file);
      } else {
        this.importResult = await this.excelService.importLessons(file);
      }
      this.deploymentStatus = null;
      this.dataService.updateLessons(this.importResult.lessons);
    } catch (error) {
      console.error('Import error:', error);
    }
  }
  openDeployDialog() {
    if (!this.dataService.countLessons()) return;
    this.showTokenDialog = true;
    this.tokenForm.reset();
  }
  closeTokenDialog() {
    this.showTokenDialog = false;
    this.tokenForm.reset();
    this.isSubmittingToken = false;
  }
  async saveAndDeploy() {
    if (this.tokenForm.invalid) return;
    this.isSubmittingToken = true;
    const token = this.tokenForm.value.githubToken;

    this.isDeploying = true;
    this.deploymentStatus = null;

    try {
      const lessons = this.dataService.getAllLessons();
      //  Tạo commit message
      const lessonNames = lessons.map((lesson) => lesson.name_vi).join(', ');
      const commitMessage = `Feat (data) : Update data ${lessonNames} - ${new Date().toLocaleString(
        'vi-VN'
      )}`;

      //  Deploy lên GitHub
      this.deploymentStatus = await this.githubService.commitAndDeploy(
        lessons,
        commitMessage,
        token
      );

      //  Reset form nếu thành công
      if (this.deploymentStatus.success) {
        this.closeTokenDialog();
        setTimeout(() => {
          this.importResult = null;
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

  async deployToGithub(): Promise<void> {
    try {
      // await this.githubService.deployToGithub();
    } catch (error) {
      console.error('Deploy error:', error);
    }
  }
}
