import { Component, inject, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonButtons,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryStore } from '@lpg-manager/inventory-store';


@Component({
  selector: 'lpg-inventory-management',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonButtons,
    IonIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './inventory-management.component.html',
  providers: [InventoryStore],
})
export default class InventoryManagementComponent {
  #fb = inject(FormBuilder);
  #inventoryStore = inject(InventoryStore);
  #modalCtrl = inject(ModalController);

  mode = input<'create' | 'edit'>('create');

  inventoryForm = this.#fb.group({
    catalogueId: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  async dismiss() {
    await this.#modalCtrl.dismiss(null, 'cancel');
  }

  async save() {
    if (this.inventoryForm.valid) {
      // TODO: Implement save logic
      await this.#modalCtrl.dismiss(this.inventoryForm.value, 'confirm');
    }
  }
}
