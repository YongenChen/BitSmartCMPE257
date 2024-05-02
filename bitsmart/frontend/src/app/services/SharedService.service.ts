import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedDateSource = new BehaviorSubject<string | null>(null);
  selectedDate$ = this.selectedDateSource.asObservable();

  setSelectedDate(date: string | null): void {
    try {
      console.log('Setting selected date in service:', date);
      this.selectedDateSource.next(date);
    } catch (error) {
      console.error('Error in setting selected date:', error);
    }
  }

  //Ethan To-Do; Implement GET method for API

}
