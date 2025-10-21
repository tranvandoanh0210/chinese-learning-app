import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  countLession: number = 0;
  user: User | null = null;
  showDropdown = false;
  @Output() mobileMenuToggle = new EventEmitter<void>();
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.countLession = this.dataService.countLessons();
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  toggleMobileNav() {
    this.mobileMenuToggle.emit();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  goToWelcome(): void {
    window.location.href = '/#/welcome';
  }
  goToHome() {
    this.router.navigate(['/']);
    this.showDropdown = false;
  }
  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }
  renameUser() {
    const newName = prompt('Nhập tên mới:', this.user?.name || '');
    this.showDropdown = false;
    if (newName && newName.trim() !== '') {
      this.userService.setUser(newName.trim());
    }
  }
  goToDataManagement() {
    this.showDropdown = false;
    this.router.navigate(['/data']);
  }
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/welcome']);
    this.showDropdown = false;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-info') && !target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }
  }
}
