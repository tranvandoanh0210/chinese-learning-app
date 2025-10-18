import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  countLession: number = 0;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.countLession = this.dataService.countLessons();
  }
}
