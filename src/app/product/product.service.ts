import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'http://localhost:5000/api/products';

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
  return this.http.get(`/api/product/report/${type}`, {
    responseType: 'blob'   // important
  });
  
}
bulkUpload(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.apiUrl}/bulk-upload`, formData);
}

}
