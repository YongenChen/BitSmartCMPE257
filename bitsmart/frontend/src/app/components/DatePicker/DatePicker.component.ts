import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';

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

}