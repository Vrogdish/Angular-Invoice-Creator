import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
@Output() search = new EventEmitter<string>();

onChanges(event : Event) {
  const value = (event.target as HTMLInputElement).value;
  this.search.emit(value);
}

}
