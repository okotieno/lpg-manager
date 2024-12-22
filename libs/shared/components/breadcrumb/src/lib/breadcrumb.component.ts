import { Component, input } from '@angular/core';
import { IonIcon, IonText } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

export interface IBreadcrumb {
  label: string;
  path?: string;
}

@Component({
  selector: 'lpg-breadcrumb',
  imports: [IonIcon, RouterLink, IonText],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
  breadcrumbs = input<IBreadcrumb[]>([]);
}
