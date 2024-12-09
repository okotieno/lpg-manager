import { Component, inject } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon, IonText
} from '@ionic/angular/standalone';
import { RolesStore } from '@lpg-manager/roles-store';
import { CdkTableModule } from '@angular/cdk/table';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lpg-roles-page',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    CdkTableModule,
    TitleCasePipe,
    IonText,
    RouterLink,
  ],
  template: `
    <h2>
      <ion-text class="ion-margin-bottom" color="lpg-title">Roles</ion-text>
    </h2>
    <ion-card class="ion-no-margin">
      <ion-card-content>
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
      </ion-card-content>
    </ion-card>
  `,
  styles: `

  `,
  providers: [RolesStore],
})
export default class RolesLandingPageComponent {
  rolesStore = inject(RolesStore);
  displayedColumns = ['name', 'actions'];

  roles = this.rolesStore.items;
}
