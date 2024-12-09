import { Component, inject, signal } from '@angular/core';
import {
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { RolesStore } from '@lpg-manager/roles-store';
import { CdkTableModule, DataSource } from '@angular/cdk/table';
import { IGetRolesQuery } from '@lpg-manager/roles-store';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

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
  ],
  template: `
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <ion-card>
            <ion-card-content>
              <div class="table-container">
                <table cdk-table [dataSource]="roles()" class="roles-table">
                  <ng-container cdkColumnDef="name">
                    <th cdk-header-cell *cdkHeaderCellDef>Name</th>
                    <td cdk-cell *cdkCellDef="let role">{{role.name}}</td>
                  </ng-container>

                  <ng-container cdkColumnDef="actions">
                    <th cdk-header-cell *cdkHeaderCellDef>Actions</th>
                    <td cdk-cell *cdkCellDef="let role">
                      <ion-button fill="clear" size="small">
                        <ion-icon name="create" slot="icon-only"></ion-icon>
                      </ion-button>
                      <ion-button fill="clear" size="small" color="danger">
                        <ion-icon name="trash" slot="icon-only"></ion-icon>
                      </ion-button>
                    </td>
                  </ng-container>

                  <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
                  <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
                </table>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
  styles: `
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .roles-table {
      width: 100%;
      border-collapse: collapse;
    }

    .roles-table th, .roles-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--ion-color-light);
    }

    .roles-table th {
      font-weight: bold;
      background-color: var(--ion-color-light);
    }

    .roles-table tr:hover {
      background-color: var(--ion-color-light-shade);
    }
  `,
  providers: [RolesStore],
})
export default class RolesLandingPageComponent {
  rolesStore = inject(RolesStore);
  displayedColumns = ['name', 'actions'];

  roles = this.rolesStore.items
}
