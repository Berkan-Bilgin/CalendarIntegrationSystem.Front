import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient) {}

  getCalendarItems(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/calendarItems`);
  }
  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, task);
  }

  updateTask(task: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${taskId}`);
  }
}
