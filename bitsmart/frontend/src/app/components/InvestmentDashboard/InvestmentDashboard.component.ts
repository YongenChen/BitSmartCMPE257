import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePicker } from '../DatePicker/DatePicker.component';
import { SharedService } from '../../services/SharedService.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'investmentdashboard',
    templateUrl: 'InvestmentDashboard.component.html',
    styleUrl: 'InvestmentDashboard.component.css',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        DatePicker,
        MatButtonModule,
    ],
})
export class InvestmentDashboard { 
    initialInvestment: number | null = null;

    constructor(private sharedService: SharedService) {}

    onInitialInvestmentChange(newInvestment: number): void {
        this.initialInvestment = newInvestment;
    }

    submitData(): void {
        this.sharedService.setInitialInvestment(this.initialInvestment);

        this.sharedService.fetchData().then((response: any) => { 
            console.log('API Response received:', response);
        }).catch((error: any) => {
            console.error('Error fetching data from API:', error);
        });

        console.log('Data submitted:', this.initialInvestment);
    }

}