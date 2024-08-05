import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Observable, map, startWith } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-select-autocomplete',
  standalone: true,
  imports: [FormsModule, MatFormField, MatAutocompleteModule, MatInputModule, MatFormFieldModule, AsyncPipe, ReactiveFormsModule],
  templateUrl: './select-autocomplete.component.html',
  styleUrl: './select-autocomplete.component.scss',
})
export class SelectAutocompleteComponent implements OnInit {
  @Input() options!: {name : string, value : string}[];
  filteredOptions!: Observable<{name : string, value : string}[]>;
  myControl = new FormControl();


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): {name : string, value : string}[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  
}
