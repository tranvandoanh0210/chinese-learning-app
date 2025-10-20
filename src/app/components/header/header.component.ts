import { Component, OnInit } from '@angular/core';
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
  selectData() {
    this.router.navigate(['/data']);
  }
}
