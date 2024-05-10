import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'predictiondashboard',
    templateUrl: 'PredictionDashboard.component.html',
    styleUrls: ['PredictionDashboard.component.css'],
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
export class PredictionDashboard {
    bestLoadPrice: number;
    bestSellPrice: number;
    profitLoss: number = 0;
    profitLossPrefix: string = ''; // + or -
    profitLossColor: string = 'black'; // green = profit, red = loss

    constructor() {
        // example initial vals, replace with actual data fetching logic later
        this.bestLoadPrice = 30000; // get both load/sell from model
        this.bestSellPrice = 35000;
        this.calculateProfitLoss();
    }

    calculateProfitLoss() {
        this.profitLoss = this.bestSellPrice - this.bestLoadPrice;
        if (this.profitLoss > 0) {
            this.profitLossPrefix = '+';
            this.profitLossColor = 'green';
        } else if (this.profitLoss < 0) {
            this.profitLossPrefix = '-';
            this.profitLossColor = 'red';
        } else {
            this.profitLossPrefix = '';
            this.profitLossColor = 'black'; // black if we broke even
        }
    }
}
