import { HttpClient, HttpParams } from '@angular/common/http';

import { Book } from '../../Book.interface';
import { Observable } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component, inject, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss',
})
export class BookSearchComponent {
  /* ------------------------------------------  Types and Constants ------------------------------------------ */
  private apiUrl = 'https://openlibrary.org/search.json';
  protected isShow: boolean = false;
  protected isLoading: boolean = false;
  imgSrc: string | null = null;
  /* ------------------------------------------ PROVIDERS / SERVICES ------------------------------------------ */
   private readonly http=inject(HttpClient);
  /* ------------------------------------------------  Inputs ------------------------------------------------ */
  /* ------------------------------------------------  Outputs ------------------------------------------------ */

  /* ------------------------------------------------  Signals ------------------------------------------------ */

  /* -------------------------------------------------- Data -------------------------------------------------- */
  protected book: WritableSignal<Book> = signal<Book>({
    numFound: 0,
    start: 0,
    numFoundExact: false,
    docs: [],
    num_found: 0,
    q: '',
  });
  protected bookName = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  /* ------------------------------------------------  Constructor ------------------------------------------------ */
  constructor() { }
  /* ----------------------------------------------- Lifecycle Hooks ----------------------------------------------- */
  /* ------------------------------------------------  Methods ------------------------------------------------ */
  searchBooks(queryString: string): Observable<Book> {
    const queryParams: HttpParams = new HttpParams({
      fromObject: { q: queryString },
    });
    return this.http.get<Book>(this.apiUrl, { params: queryParams });
  }
  onSearchBook() {
    this.isLoading = true;
    if (this.bookName.valid) {
      const searchTerm = this.bookName.value || '';
      this.searchBooks(searchTerm).subscribe({
        next: (data) => {
          this.book.set(data);

          if (
            this.book().docs &&
            this.book().docs.length > 0 &&
            this.book().docs[0].cover_i
          ) {
            this.imgSrc =`https://covers.openlibrary.org/a/olid/OL${this.book().docs[0].cover_i}A-S.jpg`;
            //"https://covers.openlibrary.org/a/olid/OL23919A-M.jpg"


          } else {
            this.imgSrc = 'assets/defaultImage.png';
          }

          this.isShow = true;
          this.bookName.reset();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }
  goBack() {
    this.isShow = false;
    this.isLoading = false;
  }

}
