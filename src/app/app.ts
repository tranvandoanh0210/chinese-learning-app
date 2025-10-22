import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  hasUser = false;
  isMobileNavOpen = false;
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.hasUser = !!user;

      if (!user && !window.location.hash.includes('welcome')) {
        this.router.navigate(['/welcome']);
      }
    });
  }
  onMobileMenuToggle() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }
}
