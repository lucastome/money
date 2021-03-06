import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriaService {

  categoriaURL = 'http://localhost:8080/categorias';

  constructor(private http: Http) {}

  listarTodas(): Promise<any> {

    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AbW9uZXkuY29tOmFkbWlu');

    return this.http.get(this.categoriaURL, { headers })
      .toPromise()
      .then(response => response.json());
  }
}
