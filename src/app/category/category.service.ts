import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.APIURL}/api/category`;

  constructor(private http: HttpClient) {}

  // getAll(): Observable<any> {
  //   return this.http.get(this.apiUrl);
  // }
getAll(page: number = 1): Observable<any> {
  return this.http.get(`${this.apiUrl}?page=${page}&limit=10`);
}

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
