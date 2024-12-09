import { Component, input } from '@angular/core';
import { IonIcon, IonRow, IonText } from '@ionic/angular/standalone';
import { IRoleModel } from '@lpg-manager/types';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'lpg-role-page',
  standalone: true,
  imports: [IonText, TitleCasePipe, IonIcon, IonRow],
  templateUrl: './role-page.component.html',
  styleUrl: './role-page.component.scss',
})
export default class RolePageComponent {
  role = input<IRoleModel>();
}
