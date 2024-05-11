import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { SharedService } from '../../services/SharedService.service';

@Component({
  selector: 'app-material-table',
  standalone: true,
  imports: [MatTableModule, HttpClientModule],
  templateUrl: './MaterialTable.component.html',
  styleUrl: './MaterialTable.component.css'
})
export class MaterialTableComponent implements OnInit {
  displayedColumns: string[] = ['date', 'open', 'high', 'low', 'close'];
  dataSource: Object[] = [];

  constructor(
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.predictionData$.subscribe(data => {
      this.dataSource = data;
      console.log('Material Table Data loaded:', this.dataSource);
    });
  }

}
