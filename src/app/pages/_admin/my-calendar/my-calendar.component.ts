import { Component } from '@angular/core';
import { CalendarComponent } from '../../../features/admin/calendar/calendar.component';

@Component({
  selector: 'app-my-calendar',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './my-calendar.component.html',
  styleUrl: './my-calendar.component.scss',
})
export class MyCalendarComponent {}
