import { Component, computed, input } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { PaginatedResource } from '../paginated-resource.interface';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'lpg-data-table',
  standalone: true,
  imports: [
    CdkTableModule,
    IonText,
    IonButton,
    RouterLink,
    IonIcon,
    TitleCasePipe,
    PaginationComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
})
export class DataTableComponent<T> {
  pageTitle = input<string>();
  createNewIcon = input<string>('plus');
  store = input.required<PaginatedResource<T>>();
  displayedColumns = input(['id', 'name', 'actions']);
  items = computed(() => this.store().items());
}
