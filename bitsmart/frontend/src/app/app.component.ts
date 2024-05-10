import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatePicker } from './components/DatePicker/DatePicker.component'
import { MaterialTableComponent } from './components/MaterialTable/MaterialTable.component';
import { InvestmentDashboard } from './components/InvestmentDashboard/InvestmentDashboard.component';
import { PredictionDashboard } from './components/PredictionDashboard/PredictionDashboard.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DatePicker,
    MaterialTableComponent,
    InvestmentDashboard,
    PredictionDashboard,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  // template: `<div><datepicker></datepicker></div>`,
})
export class AppComponent {
  title = 'Bitcoin?';
}