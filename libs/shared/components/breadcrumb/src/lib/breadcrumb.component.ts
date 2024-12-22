import { Component, inject } from '@angular/core';
import { IonBreadcrumb, IonBreadcrumbs, IonIcon } from '@ionic/angular/standalone';
import { BreadcrumbStore } from './breadcrumb.store';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lpg-breadcrumb',
  imports: [IonIcon, IonBreadcrumbs, IonBreadcrumb, RouterLink, TitleCasePipe],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
  #breadcrumbStore = inject(BreadcrumbStore);
  breadcrumbs = this.#breadcrumbStore.breadcrumbs;
}
