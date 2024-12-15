import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonIcon, IonText
} from '@ionic/angular/standalone';
import { CdkTableModule } from '@angular/cdk/table';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandsStore } from '@lpg-manager/brand-store';

@Component({
  selector: 'lpg-roles-page',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    CdkTableModule,
    TitleCasePipe,
    IonText,
    RouterLink,
  ],
  template: `
    <h2>
      <ion-text class="ion-margin-bottom" color="lpg-title">Brands</ion-text>
    </h2>
    <div class="ion-margin-bottom ion-text-end">
      <ion-button [routerLink]="['new']">
        <ion-icon name="shield-plus" slot="start"></ion-icon>
        Create Brand
      </ion-button>
    </div>
    <div class="table-container">
      <table cdk-table [dataSource]="roles()" class="roles-table">
        <ng-container cdkColumnDef="name">
          <th cdk-header-cell *cdkHeaderCellDef>Name</th>
          <td cdk-cell *cdkCellDef="let role">
            {{ role.name | titlecase }}
          </td>
        </ng-container>

        <ng-container cdkColumnDef="actions">
          <th cdk-header-cell *cdkHeaderCellDef>Actions</th>
          <td cdk-cell *cdkCellDef="let role">
            <ion-button
              [routerLink]="[role.id]"
              shape="round"
              fill="clear"
              size="small"
            >
              <ion-icon name="eye" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button shape="round" fill="clear" size="small">
              <ion-icon name="pen-to-square" slot="icon-only"></ion-icon>
            </ion-button>
            <ion-button
              shape="round"
              fill="clear"
              size="small"
              color="danger"
            >
              <ion-icon name="trash-can" slot="icon-only"></ion-icon>
            </ion-button>
          </td>
        </ng-container>
        <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
        <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  providers: [BrandsStore],
})
export default class BrandsLandingPageComponent {
  brandsStore = inject(BrandsStore);
  displayedColumns = ['name', 'actions'];

  roles = this.brandsStore.items;
}
