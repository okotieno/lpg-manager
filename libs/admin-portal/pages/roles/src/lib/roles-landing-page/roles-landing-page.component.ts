import { Component, inject } from '@angular/core';
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
import { CdkTableModule } from '@angular/cdk/table';
import { TitleCasePipe } from '@angular/common';

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
                    <td cdk-cell *cdkCellDef="let role">
                      {{ role.name | titlecase }}
                    </td>
                  </ng-container>

                  <ng-container cdkColumnDef="actions">
                    <th cdk-header-cell *cdkHeaderCellDef>Actions</th>
                    <td cdk-cell *cdkCellDef="let role">
                      <ion-button shape="round" fill="clear" size="small">
                        <ion-icon name="pen-to-square" slot="icon-only"></ion-icon>
                      </ion-button>
                      <ion-button shape="round" fill="clear" size="small" color="danger">
                        <ion-icon name="trash-can" slot="icon-only"></ion-icon>
                      </ion-button>
                    </td>
                  </ng-container>
                  <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
                  <tr
                    cdk-row
                    *cdkRowDef="let row; columns: displayedColumns"
                  ></tr>
                </table>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
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
