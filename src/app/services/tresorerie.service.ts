import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TresorerieService {
private host:string='http://localhost:8082';
//private host:string='//4.222.22.46:8082/gest-fin';
///private host:string='http://localhost:8082';


constructor(private _http: HttpClient) {}


creerCategorie(categorie: any) {
  return this._http.post(this.host+'/api/categorie-tresorerie',categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
modifierCategorie(categorie: any) {
  return this._http.put(this.host+'/api/categorie-tresorerie',categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

getAllCategories(): Observable<any> {
  return this._http.get(this.host+'/api/categorie-tresoreries',{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
getCategorieParId(id:number) {
  return this._http.get(this.host+'/api/categorie-tresorerie/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

supprimerCategorie(id: number) {
  return this._http.delete(this.host+'/api/categorie-tresorerie/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}


creerNatureOperation(natureoperation: any) {
  return this._http.post(this.host+'/api/nature-operation',natureoperation,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
modifierNatureOperation(natureoperation: any, id: number): Observable<any> {
  return this._http.put(`${this.host}/api/nature-operation/${id}`, natureoperation, {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  })
}

getAllNatureOperations() {
  return this._http.get(this.host+'/api/nature-operations',{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
getNatureOperationParId(id:number) {
  return this._http.get(this.host+'/api/nature-operation/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

supprimerNatureOperation(id: number) {
  return this._http.delete(this.host+'/api/nature-operation/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

getSocieteParId(id:number) {
  return this._http.get(this.host+'/api/societe/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

getSocietes() {
  return this._http.get(this.host+'/api/societes',{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

allRoles(){
  let headers=new HttpHeaders().set('Accept','application/json');
  return this._http.get(this.host+'/api/roles',{headers:headers});
}
allSuperviseurs(){
  let headers=new HttpHeaders().set('Accept','application/json');
  return this._http.get(this.host+'/api/superviseurs',{headers:headers});
}



updateUtilisateur(id: number, value: any) {
  return this._http.put(this.host+'/api/utilisateur/'+id, value,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
updateUtilisateurr(value: any) {
  return this._http.put(this.host+'/api/utilisateurr', value,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
addUser(data:any){
  return this._http.post(this.host+'/api/utilisateur',data,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}



allUtilisateurs(){
  let headers=new HttpHeaders().set('Accept','application/json');
  return this._http.get(this.host+'/api/utilisateurs',{headers:headers});
}

addData(data:any){
  return this._http.post(this.host+'/api/donnees',data,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
activateUser(id: number, value: any) {
  return this._http.put(this.host+'/api/autilisateur/'+id, value,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
desactivateUser(id: number, value: any) {
  return this._http.put(this.host+'/api/dutilisateur/'+id, value,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

addAdmin(id: number) {
  return this._http.get(this.host+'/api/add-admin/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

removeAdmin(id: number) {
  return this._http.get(this.host+'/api/remove-admin/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

deleteUser(id: number){
  return this._http.delete(this.host+'/api/utilisateur/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
getUserById(id:number){
  return this._http.get(this.host+'/api/utilisateur/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

}
