import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePicker } from '../DatePicker/DatePicker.component';


@Component({
    selector: 'investmentdashboard',
    templateUrl: 'InvestmentDashboard.component.html',
    styleUrl: 'InvestmentDashboard.component.css',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, DatePicker],
})
export class InvestmentDashboard { }