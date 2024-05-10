import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedDateSource = new BehaviorSubject<string | null>(null);
  selectedDate$ = this.selectedDateSource.asObservable();

  private initialInvestmentSource = new BehaviorSubject<number | null>(null);
  initialInvestment$ = this.initialInvestmentSource.asObservable();

  private profitLossSource = new BehaviorSubject<number>(0);
  profitLoss$ = this.profitLossSource.asObservable();

  private totalExitAmountSource = new BehaviorSubject<number>(0);
  totalExitAmount$ = this.totalExitAmountSource.asObservable();

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
      this.updateTotalExitAmount();
    } catch (error) {
      console.error('Error in setting initial investment input', error);
    }
  }

  setProfitLoss(profitOrLoss: number): void {
    console.log('Setting profit/loss in service:', profitOrLoss);
    this.profitLossSource.next(profitOrLoss);
    this.updateTotalExitAmount();
  }

  updateTotalExitAmount(): void {
    const investment = this.initialInvestmentSource.value ?? 0;
    const profitOrLoss = this.profitLossSource.value ?? 0;
    const total = investment + profitOrLoss;
    console.log('Updating Total Exit Amount:', total);
    this.totalExitAmountSource.next(total);
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
      this.setProfitLoss(data.profitOrLoss) // api has to return object w/ 'profitOrLoss' field
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

}
