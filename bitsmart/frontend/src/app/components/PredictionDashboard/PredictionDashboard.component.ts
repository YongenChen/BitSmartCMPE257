import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SharedService } from '../../services/SharedService.service';

@Component({
    selector: 'predictiondashboard',
    templateUrl: 'PredictionDashboard.component.html',
    styleUrl: 'PredictionDashboard.component.css',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
})
export class PredictionDashboard implements OnInit {
    dataSource: any;
    loadPrice: number | null = null;
    sellPrice: number | null = null;

    constructor(
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        this.sharedService.swingData$.subscribe(data => {
            if (data) {
                this.dataSource = data;
                console.log('Prediction Dashboard Data loaded:', this.dataSource);
            }
        });

        this.sharedService.loadPrice$.subscribe(price => {
            this.loadPrice = price;
            console.log('Best Load Price Generated:', this.loadPrice);
          });

        this.sharedService.sellPrice$.subscribe(price => {
            this.sellPrice = price;
            console.log('Best Sell Price Generated:', this.sellPrice);
          });
    }
}