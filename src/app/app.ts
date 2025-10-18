import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Chinese Learning App';
  // protected readonly title = signal('chinese-learning-website');
}
