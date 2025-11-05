import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lesson } from '../models/lesson.model';
import { environment } from '../../environments/environment.prod';
import { DataService } from './data.service';

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  dataPath: string;
}

export interface DeploymentResult {
  success: boolean;
  message: string;
  commitSha?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private http = inject(HttpClient);
  private config: GitHubConfig;

  constructor(private dataService: DataService) {
    this.config = environment.github;
  }

  async commitAndDeploy(
    lessons: Lesson[],
    commitMessage: string,
    token: String
  ): Promise<DeploymentResult> {
    try {
      // 1. Get current file SHA
      const fileSha = await this.getFileSha(token);

      // 2. Convert data to TypeScript file content
      const fileContent = this.generateDataFileContent(lessons);
      const content = btoa(unescape(encodeURIComponent(fileContent)));

      // 3. Create commit
      const commit = await this.createCommit(content, fileSha, commitMessage, token);
      return {
        success: true,
        message: 'Deploy thành công! Ứng dụng sẽ được update trong vài phút.',
        commitSha: commit.sha,
      };
    } catch (error: any) {
      console.error('GitHub deployment error:', error);
      let errorMessage = `Lỗi deploy: ${error.message || error}`;

      if (error.status === 401) {
        errorMessage = 'Lỗi xác thực: GitHub token không hợp lệ hoặc đã hết hạn.';
      } else if (error.status === 403) {
        errorMessage = 'Lỗi quyền truy cập: Token không có quyền commit vào repository.';
      } else if (error.status === 404) {
        errorMessage = 'Repository không tồn tại hoặc không thể truy cập.';
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  }
  async updateDataFile(): Promise<void> {
    const lessons = this.dataService.getAllLessons();
    const dataContent = this.generateDataFileContent(lessons);

    // Tạo file download
    this.downloadFile(dataContent, 'data.ts', 'text/typescript');
  }
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  private generateDataFileContent(lessons: Lesson[]): string {
    return `import { Lesson } from '../app/models/lesson.model';

export const SAMPLE_DATA: Lesson[] = ${JSON.stringify(lessons, null, 2)};
`;
  }

  private async getFileSha(token: String): Promise<string> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.dataPath}?ref=${this.config.branch}`;

    const response = await this.http
      .get<any>(url, {
        headers: this.getHeaders(token),
      })
      .toPromise();

    return response.sha;
  }

  private async createCommit(
    content: string,
    sha: string,
    message: string,
    token: String
  ): Promise<any> {
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.dataPath}`;

    const body = {
      message,
      content,
      sha,
      branch: this.config.branch,
    };

    return this.http
      .put(url, body, {
        headers: this.getHeaders(token),
      })
      .toPromise();
  }

  private getHeaders(token: String) {
    return new HttpHeaders({
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    });
  }
}
