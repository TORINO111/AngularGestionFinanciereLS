import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleDTO } from 'src/app/models/article.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private baseUrl = `${environment.apiUrl}/api/articles`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ArticleDTO[]> {
    return this.http.get<ArticleDTO[]>(this.baseUrl);
  }

  getArticleById(id: number) {
    return this.http.get<void>(`${this.baseUrl}/${id}`);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    designation?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (designation) params = params.set('designation', designation);

    return this.http.get<any>(`${this.baseUrl}/pageable`, { params });
  }

  create(article: ArticleDTO): Observable<ArticleDTO> {
    return this.http.post<ArticleDTO>(this.baseUrl, article);
  }

  update(id: number, article: ArticleDTO): Observable<ArticleDTO> {
    return this.http.put<ArticleDTO>(`${this.baseUrl}/${id}`, article);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
