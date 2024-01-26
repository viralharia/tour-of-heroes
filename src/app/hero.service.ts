import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageServiceService } from './message-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private messageService:MessageServiceService,
    private httpClient:HttpClient) { }

  /* getHeroes(): Observable<Hero[]>{
    this.messageService.addMessage('HeroService: fetched Heroes');
    return of(HEROES);
  } */

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
                  .pipe(
                    catchError(this.handleError<Hero[]>('getHeroes', []))
                  );
  }

  /* getHero(id: Number): Observable<Hero> {
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.addMessage(`HeroService: fetched hero id=${id}`);
    return of(hero);
  } */

  getHero(id: Number): Observable<Hero> {
    const heroUrl = `${this.heroesUrl}/${id}`;
    this.log(heroUrl);
    this.log(`HeroService: fetched hero id=${id}`);
    return this.httpClient.get<Hero>(heroUrl)
              .pipe(
                catchError(this.handleError<Hero>('getHero'))
              );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
                  .pipe(
                    catchError(this.handleError<Hero>('updateHero'))
                  );
  }

  addNewHero(newHero: Hero):Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, newHero, this.httpOptions)
                  .pipe(
                    catchError(this.handleError<Hero>('addNewHero'))
                  );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }

    const url = `${this.heroesUrl}/?name=${term}`;
    this.log(url);

    return this.httpClient.get<Hero[]>(url)
                  .pipe(
                    tap(x => x.length ?
                        this.log(`found heroes matching term ${term}`) :
                        this.log(`no heroes matching term ${term}`)),
                    catchError(this.handleError<Hero[]>('searchHeroes', []))
                  );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
