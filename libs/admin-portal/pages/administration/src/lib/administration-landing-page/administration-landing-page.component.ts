import { Component, inject } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { IGetBrandCountGQL } from '@lpg-manager/brand-store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IGetTransporterCountGQL } from '@lpg-manager/transporter-store';
import { IGetStationCountGQL } from '@lpg-manager/station-store';

@Component({
  selector: 'lpg-user-table',
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    RouterLink,
    IonText,
  ],
  templateUrl: './administration-landing-page.component.html',
  styles: ``,
})
export default class UserTableComponent {
  private getBrandCountGQL = inject(IGetBrandCountGQL);
  private getTransporterCountGQL = inject(IGetTransporterCountGQL);
  private getStationCountGQL = inject(IGetStationCountGQL);
  brandCount = toSignal(
    this.getBrandCountGQL.fetch().pipe(
      map((response) => {
        if (response.data?.brandCount) {
          return response.data.brandCount.count;
        }
        return 0;
      })
    )
  );

  transporterCount = toSignal(
    this.getTransporterCountGQL.fetch().pipe(
      map((response) => {
        if (response.data?.transporterCount) {
          return response.data.transporterCount.count;
        }
        return 0;
      })
    )
  );
  stationCount = toSignal(
    this.getStationCountGQL.fetch().pipe(
      map((response) => {
        if (response.data?.stationCount) {
          return response.data.stationCount.count;
        }
        return 0;
      })
    )
  );
}
