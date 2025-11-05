import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BackToTopComponent } from '../../components/back-to-top/back-to-top.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  imports: [RouterOutlet, BackToTopComponent, NavigationComponent, HeaderComponent],
})
export class MainLayoutComponent implements OnInit {
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
