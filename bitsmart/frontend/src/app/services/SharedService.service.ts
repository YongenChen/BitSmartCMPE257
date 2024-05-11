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

  private predictionData = new BehaviorSubject<any[]>([]);
  predictionData$ = this.predictionData.asObservable();

  private swingData = new BehaviorSubject<any>(null);
  swingData$ = this.swingData.asObservable();

  private dummyData = {
    "predictions": [
      { "Date": "2024-05-13", "Open": 63006.764883005744, "High": 66868.10350543886, "Low": 58744.2809742571, "Close": 63089.351537011 },
      { "Date": "2024-05-14", "Open": 61826.93041739949, "High": 65602.75945367797, "Low": 57661.35954844687, "Close": 61910.104200903144 },
      { "Date": "2024-05-15", "Open": 61568.9580689533, "High": 65326.090322421966, "Low": 57424.57736285834, "Close": 61652.260229089414 },
      { "Date": "2024-05-16", "Open": 61557.46719403719, "High": 65313.766635796026, "Low": 57414.03036240132, "Close": 61640.77507245993 },
      { "Date": "2024-05-17", "Open": 64104.385758286255, "High": 68045.27546143114, "Low": 59751.741934169855, "Close": 64186.42619533255 },
      { "Date": "2024-05-18", "Open": 60307.62524242558, "High": 63973.341241204456, "Low": 56266.85195074066, "Close": 60391.55508867473 },
      { "Date": "2024-05-19", "Open": 63068.13506893649, "High": 66933.92155194173, "Low": 58800.610138379474, "Close": 63150.69118285539 }
    ],
    "swing": {
      "profit_loss": -131.08124003243938,
      "total_investment_amount": 10000,
      "total_exit_amount": 9868.91875996756,
      "average_closing_price": 62246.74179779846,
      "sell_day": "2024-05-16",
      "load_day": "2024-05-18",
      "final_bitcoins": 0.15832113301961429
    }
  };

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

  // async fetchData(): Promise<Object> {
  //   const baseUrl = import.meta.env['NG_APP_PREDICT_API'];
  //   const date = this.selectedDateSource.value ?? 'YYYY-MM-DD';
  //   const initialInvestment = this.initialInvestmentSource.value ?? 0;

  //   const params = new URLSearchParams({
  //     date: date,
  //     initial_investment: initialInvestment.toString()
  //   });

  //   try {
  //     const response = await fetch(`${baseUrl}?${params}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     this.predictionData.next(data.predictions);
  //     this.swingData.next(data.swing);
  //     console.log('API Response:', data);
  //     return data;
  //   } catch (error) {
  //     console.error('Failed to fetch data:', error);
  //     throw error;
  //   }
  // }

  //comment this method and revert back to original fetchData() above this line when not using dummyData
  fetchData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.predictionData.next(this.dummyData.predictions);
        this.swingData.next(this.dummyData.swing);
        console.log('Data fetched using dummy data:', this.dummyData);
        resolve(this.dummyData);
      }, 1000);
    });
  }
  
}
