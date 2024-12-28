import { Component, inject } from '@angular/core';
import { InventoryStore } from '@lpg-manager/inventory';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
    ReactiveFormsModule
  ],
  templateUrl: './inventory-management.component.html'
})
export default class InventoryManagementComponent {
  #fb = inject(FormBuilder);
  #inventoryStore = inject(InventoryStore);

  inventoryForm = this.#fb.group({
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  async updateInventory() {
    if (this.inventoryForm.valid) {
      // Implement update logic
    }
  }
} 