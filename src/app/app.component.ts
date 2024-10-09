import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookSearchComponent } from "./components/book-search/book-search.component";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookSearchComponent,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'book-library';
}