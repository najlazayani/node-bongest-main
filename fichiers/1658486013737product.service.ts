import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'http://localhost:4000/api/product/';

  constructor(private http : HttpClient) {}

    getProducts():  Observable<any> {
      return this.http.get(this.url);
    }

    eliminateProduct(id : String):Observable<any>{
      return this.http.delete(this.url + id);

    }


    AddProduct(product : Product): Observable<any> {
      return this.http.post(this.url,product);

    }

    obtenerProduct(id: String): Observable<any>{
      return this.http.get(this.url+ id);
    }

    editProduct(id:string, product:Product):Observable<any>{
      return this.http.put(this.url+id, product);

    }
}
