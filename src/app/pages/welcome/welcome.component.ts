import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WelcomeComponent {
  userName = '';

  constructor(private userService: UserService, private router: Router) {}

  startLearning(): void {
    if (this.userName.trim()) {
      this.userService.setUser(this.userName.trim());
      this.router.navigate(['/']);
    }
  }
}
