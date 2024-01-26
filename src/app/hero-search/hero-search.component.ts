import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe],
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.css'
})
export class HeroSearchComponent {
  heroes$!:Observable<Hero[]>
  private searchTerms = new Subject<string>();

  constructor(private heroService:HeroService){}

  search(term:string){
    this.searchTerms.next(term);
  }

  ngOnInit(): void{
    this.heroes$ = this.searchTerms.pipe(
      debounceTime(300),

      distinctUntilChanged(),

      switchMap((term) => this.heroService.searchHeroes(term))


    );
  }
}
