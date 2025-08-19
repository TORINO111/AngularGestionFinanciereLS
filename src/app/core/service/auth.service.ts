import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/auth.models';
import { loggedInUser } from '../helpers/utils';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User | null = null;
    private host:string='http://localhost:8082/gest-fin';
    //private host:String="http://localhost:8082";
    //private host:string='http://4.222.22.46:8082/gest-fin';
    //private host:String="//4.222.22.46:8082/gest-fin";
    
    private roles:any;
    private jwtToken:any;
    helper=new JwtHelperService();
    current_user_roles:string[];
    constructor(private _http:HttpClient,private router: Router) { }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        if (!this.user) {
            this.user = loggedInUser();
        }
        return this.user;
    }

    getUserRoles():string[] {
        return this.current_user_roles;
      }
    
      getRoles(): string[] {
        const authorities = [{ authority: 'ADMIN' }]; // Exemple des rôles
        return authorities.map(auth => auth.authority); // Transformation en tableau de string
      }

      getRolesFromToken(): string[] {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1])); // Décodage de la charge utile du JWT
          payload.roles= payload.roles
        .filter(auth => auth && auth.authority)
        .map(auth => auth.authority);
          return payload.roles || []; // Assure-toi que le token contient les rôles
        }
        return [];
      }

    /**
     * Performs the login auth
     * @param email email of user
     * @param password password of user
     */
    loginn(email: string, password: string): any {

        return this._http.post<any>(`/api/login`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    this.user = user;
                    // store user details and jwt in session
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    login(utilisateur:any){

        return this._http.post(this.host+'/login',utilisateur,{
          headers:new HttpHeaders().set('Content-Type','application/json'),
          observe:'response'
        });
      }

    /**
     * Performs the signup auth
     * @param name name of user
     * @param email email of user
     * @param password password of user
     */
    signup(name: string, email: string, password: string): any {
        return this._http.post<any>(`/api/signup`, { name, email, password })
            .pipe(map(user => user));

    }



    /**
     * Logout the user
     */
    logout(): void {
        
        // remove user from session storage to log user out
        sessionStorage.removeItem('currentUser');
        this.user = null;

        let removeToken = localStorage.removeItem('token');
        sessionStorage.clear();
        localStorage.clear();
        if (removeToken == null) {
        this.router.navigate(['auth/login']);
        }
    }
    

    saveToken(jwt:string,){

        this.jwtToken=jwt;
        localStorage.setItem('token',jwt);
        
        let helper= new JwtHelperService();
        this.roles=helper.decodeToken(this.jwtToken).roles;
        let rolea=false;
        let roleb=false;
        let rolec=false;
        this.current_user_roles= this.roles
        .filter(auth => auth && auth.authority)
        .map(auth => auth.authority);
    
      //console.log(this.current_user_roles);
        let userRoles = this.getUserRoles();
        //console.log('userRoles:'+userRoles);
    
        for(let r of this.roles){
          if(r.authority =='ADMIN') rolea= true;
          if(r.authority =='SUPERVISEUR') roleb= true;
          if(r.authority =='COMPTABLE') rolec= true;
          }
    
        
        let res:any;
        
        if(rolea){
          res="a";
        }
         if (roleb) {
          res="b";
        }
    
        if (rolec) {
          res="c";
        }
        sessionStorage.setItem('role',res);
        sessionStorage.setItem('roles',this.roles);
        //console.log(sessionStorage.getItem('role'))
        
      }
    
      isAdmin(){
        
        let role=sessionStorage.getItem('role');
        //console.log(role)
        if(role==null || undefined){
          this.router.navigate(['/auth/login']);
        }
       
        if(role ==='a') return true;
        
        return false;
      }
    
      isSuperviseur(){
        let role=sessionStorage.getItem('role');
        if(role==null || undefined){
          this.router.navigate(['/auth/login']);
          
        }
       
        if(role =='b') return true;
        
        return false;
      }
      isComptable(){
        let role=sessionStorage.getItem('role');
        if(role==null || undefined){
          this.router.navigate(['/auth/login']);
          
        }
       
        if(role =='c') return true;
        
        return false;
      }
    
      
     /* saveToken(jwt:string){
        console.log(jwt)
        localStorage.setItem('token',jwt);
        console.log(localStorage.getItem('token'))
      }*/
    
      public  getToken(): any {
        return localStorage.getItem('token');
      }
      loadToken(){
        this.jwtToken=localStorage.getItem('token');
      }
      
    
      get isLoggedIn(): boolean {
        let authToken = localStorage.getItem('token');
        return (authToken !== null) ? true : false;
      }
      logout2() {
        let removeToken = localStorage.removeItem('token');
        /*sessionStorage.removeItem('user');
        sessionStorage.removeItem('database');
        localStorage.removeItem('database');
        localStorage.removeItem('user');
        sessionStorage.removeItem('role');
        localStorage.removeItem('role');*/
        sessionStorage.clear();
        localStorage.clear();
        if (removeToken == null) {
          this.router.navigate(['/login']);
        }
      }
    
      
    
      getUserByUsername(username: string) {
        const token = localStorage.getItem('token'); // Récupère le token stocké
        //console.log(token)
        return this._http.get(this.host+'/api/utilisateur-username?username='+username,{
          headers:new HttpHeaders()
          .set('Content-Type','application/json')
          .set('Authorization', token) // Ajoute le token dans l'Authorization header
        });
      }
      getUserByEmail(email: string) {
        const token = localStorage.getItem('token'); // Récupère le token stocké
        //console.log(token)
        return this._http.get(this.host+'/api/utilisateur?email='+email,{
          headers:new HttpHeaders()
          .set('Content-Type','application/json')
          .set('Authorization', token) // Ajoute le token dans l'Authorization header
        });
      }
      sendResetPassword(email: string) {
        return this._http.get(this.host+'/api/forgot?email='+email,{
          headers:new HttpHeaders().set('Content-Type','application/json')
        });
      }
      sendNewPassword(password:any,token:any){
        return this._http.post(this.host+'/api/reset?password='+password+'&token='+token,{
          headers:new HttpHeaders().set('Content-Type','application/json')
        });
      }

      sendPassword(mn){
        return this._http.post(this.host+'/api/new-password',mn,{
          headers:new HttpHeaders().set('Content-Type','application/json')
        });
      }

      resetPasswordWhatsApp(telephone){
        return this._http.post(this.host+'/api/auth/request-reset',{ telephone },{
          headers:new HttpHeaders().set('Content-Type','application/json')
        });
      }
      renouvelerMotDePasse(payload:any){
        return this._http.post(this.host+'/api/reset-password',payload,{
          headers:new HttpHeaders().set('Content-Type','application/json')
        });
      }


    }
    
    

