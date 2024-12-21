import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader, IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
  IonToolbar, ModalController
} from '@ionic/angular/standalone';

@Component({
  selector: 'lpg-add-brand-item-modal',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    ReactiveFormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonFooter,
    IonIcon,
  ],
  templateUrl: './brand-item-modal.component.html',
  styles: `
   :host {
     border-radius: 30px !important;
   }
  `,
})
export class BrandItemModalComponent {
  itemForm: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      // Add other item fields as needed
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.itemForm.valid) {
      return this.modalCtrl.dismiss(this.itemForm.value, 'confirm');
    }
    return;
  }
}
