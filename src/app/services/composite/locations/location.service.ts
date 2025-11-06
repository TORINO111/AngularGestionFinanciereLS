import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private paysUrl = 'assets/pays/pays.json';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any[]> {
    return this.http.get<any>(this.paysUrl).pipe(
      map(data => data.countries)
    );
  }

  getCitiesByCountry(countryName: string): Observable<string[]> {
    return this.http.get<any>(this.paysUrl).pipe(
      map(data => {
        const country = data.countries.find((c: any) => c.name === countryName);
        return country ? country.cities : [];
      })
    );
  }
}
