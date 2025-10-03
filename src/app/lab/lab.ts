import { HttpClient } from '@angular/common/http';
import { Component, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, retry } from 'rxjs';
import {MatTableModule} from '@angular/material/table';

export interface ApiCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string; };
  location: { name: string; url: string; };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RickAndMortyApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: ApiCharacter[];
}

export interface CharacterDisplay {
  name: string;
  status: string;
  image: string;
}

@Component({
  selector: 'app-lab',
  imports: [MatTableModule],
  templateUrl: './lab.html',
  styleUrl: './lab.scss'
})
export class Lab {
  characters: WritableSignal<CharacterDisplay[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(private http: HttpClient) { }

  private getRickAndMortyCharacters(): Observable<CharacterDisplay[]> {
    const apiUrl = 'https://rickandmortyapi.com/api/character';

    return this.http.get<RickAndMortyApiResponse>(apiUrl).pipe(
      retry(2),
      map(response => response.results),
      map(results => results.map(char => ({
        name: char.name,
        status: char.status,
        image: char.image
      } as CharacterDisplay))),
      map(characters => characters.filter(char => char.status === 'Alive')),
      catchError(err => {
        console.error('Erro ao buscar personagens:', err);
        return of([]);
      })
    );
  }

  limparPersonagens(): void {
    this.characters.set([]);
  }

  carregarPersonagens(): void {
    this.isLoading.set(true);
    this.characters.set([]); // Limpa antes de carregar

    this.getRickAndMortyCharacters().subscribe({
      next: (data) => {
        this.characters.set(data); // Atualiza o signal com os novos dados
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar personagens:', err);
        this.isLoading.set(false); // Garante que termina em erro também
      }
    });
  }
}
