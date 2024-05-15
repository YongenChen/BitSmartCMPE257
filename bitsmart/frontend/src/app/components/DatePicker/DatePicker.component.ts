import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { SharedService } from '../../services/SharedService.service';


@Component({
    selector: 'datepicker',
    templateUrl: 'DatePicker.component.html',
    styleUrl: 'DatePicker.component.css',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [MatCardModule, MatDatepickerModule],
})
export class DatePicker {
    selected: Date | null = null
    constructor(private sharedService: SharedService) {}

    onDateChange(newDate: Date | null): void {
        this.selected = newDate;
        try {
            const formattedDate = this.getFormattedDate();
            console.log('Date selected:', newDate);
            console.log('Formatted date:', formattedDate);
            this.sharedService.setSelectedDate(formattedDate);
        } catch (error) {
            console.error('Error formatting date:', error);
        }
    }

    getFormattedDate(): string {
        if (this.selected) {
            return moment(this.selected).format('YYYY-MM-DD');
        }
        return '';
    }

    myFilter = (d: Date | null): boolean => {
        const today = new Date();
        return !!d && (d <= today);
    }

}