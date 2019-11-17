import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Fractal, FractalTypes } from '../models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = `${environment.api_url}/image-presets`;

@Injectable({
  providedIn: 'root'
})
export class FractalService {

  constructor(private http: HttpClient) { }

  getImage(id: number): Observable<Fractal> {
    const url = `${apiUrl}/${id}`;
    console.log(url);
    return this.http.get<Fractal>(url).pipe(
      tap(_ => console.log(`fetched image by id=${id}`)),
      catchError(this.handleError<Fractal>(`getProduct id=${id}`))
    );
  }

  getAll(): Observable<Fractal[]> {
    return this.http.get<Fractal[]>(apiUrl)
    .pipe(
      tap(frac => console.log('fetched fractals')),
      catchError(this.handleError('getAll', []))
    );
  }

  getById(id: string): Observable<Fractal> {
    const url = `${apiUrl}/${id}`;
    console.log("url: "+url);
    return this.http.get<Fractal>(url).pipe(
      tap(_ => console.log(`fetched Fractal id=${id}`)),
      catchError(this.handleError<Fractal>(`getById id=${id}`))
    );
  }

  createFractal(fractal: Fractal): Observable<Fractal> {
    return this.http.post<Fractal>(apiUrl, fractal, httpOptions).pipe(
      tap((frac: any) => console.log(`create fractal with id=${frac.data.id}`)),
      catchError(this.handleError<Fractal>('createFractal'))
    )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
