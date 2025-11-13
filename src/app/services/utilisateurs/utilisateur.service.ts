import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UtilisateurService {
  private baseUrl = `${environment.apiUrl}/api/utilisateurs`;

  constructor(private _http: HttpClient) {}

  getAllPageable(
    page: number = 0,
    size: number = 20,
    username?: string,
    nom?: string,
    prenom?: string,
    role?: string
  ): Observable<any> {
    let params = new HttpParams().set("page", page).set("size", size);

    if (username) params = params.set("username", username);
    if (nom) params = params.set("nom", nom);
    if (prenom) params = params.set("prenom", prenom);
    if (role) params = params.set("role", role);

    return this._http.get<any>(`${this.baseUrl}/pageable`, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
      params: params,
    });
  }

  allRoles(): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this._http.get(`${this.baseUrl}/roles`, { headers });
  }

  updateUtilisateur(id: number, value: any): Observable<any> {
    return this._http.put(`${this.baseUrl}/update/${id}`, value, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  addUser(data: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/create`, data, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  deleteUser(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    });
  }

  allUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this._http.get<any[]>(`${this.baseUrl}`, { headers });
  }
}
