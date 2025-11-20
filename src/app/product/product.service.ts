import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = `${environment.APIURL}/api/products`;
  constructor(private http: HttpClient) {}

getAll(): Observable<any> {
  return this.http.get(this.apiUrl);
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
downloadReport(type: 'csv' | 'xlsx') {
  return this.http.get(`${this.apiUrl}/report/${type}`, {
    responseType: 'blob'   // important
  });
  
}

bulkUpload(formData: FormData) {
  return this.http.post(`${this.apiUrl}/bulk-upload`, formData, {
    reportProgress: true,
    observe: "events"
  });
}


}
