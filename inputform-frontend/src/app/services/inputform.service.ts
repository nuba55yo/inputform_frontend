import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InputformResponse {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class InputformService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/inputform`;

  constructor(private http: HttpClient) {}

  getOccupations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/occupations`);
  }

  create(formData: FormData): Observable<InputformResponse> {
    return this.http.post<InputformResponse>(`${this.baseUrl}`, formData);
  }
}
