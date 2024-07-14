import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createEvent(event: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, event);
  }

  updateEvent(event: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}`, event);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${eventId}`);
  }
}
