import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedDateSource = new BehaviorSubject<string | null>(null);
  selectedDate$ = this.selectedDateSource.asObservable();

  private initialInvestmentSource = new BehaviorSubject<number | null>(null);
  initialInvestment$ = this.initialInvestmentSource.asObservable();

  setSelectedDate(date: string | null): void {
    try {
      console.log('Setting selected date in service:', date);
      this.selectedDateSource.next(date);
    } catch (error) {
      console.error('Error in setting selected date:', error);
    }
  }

  setInitialInvestment(amount: number | null): void {
    try {
      console.log('Setting Initial Investment amount in service:', amount);
      this.initialInvestmentSource.next(amount);
    } catch (error) {
      console.error('Error in setting initial investment input', error);
    }
  }

  async fetchData(): Promise<Object> {
    const baseUrl = import.meta.env['NG_APP_PREDICT_API'];
    const date = this.selectedDateSource.value ?? 'YYYY-MM-DD';
    const initialInvestment = this.initialInvestmentSource.value ?? 0;

    const params = new URLSearchParams({
      date: date,
      initial_investment: initialInvestment.toString()
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }
  
}
