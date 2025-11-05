import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { Router, RouterOutlet } from '@angular/router';
import { BackToTopComponent } from '../../components/back-to-top/back-to-top.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main-layout-without-navigation',
  templateUrl: './main-layout-without-navigation.component.html',
  styleUrls: ['./main-layout-without-navigation.component.css'],
  imports: [RouterOutlet, HeaderComponent, BackToTopComponent],
})
export class MainLayoutWithoutNavigationComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (!user && !window.location.hash.includes('welcome')) {
        this.router.navigate(['/welcome']);
      }
    });
  }
}
