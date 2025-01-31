import {
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { FileUploadComponent } from '@lpg-manager/file-upload-component';
import { ISelectCategory } from '@lpg-manager/types';

export interface IBrandItem {
  id?: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'lpg-add-brand-item-modal',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonTextarea,
    IonFooter,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonNote,
    FileUploadComponent,
  ],
  templateUrl: './brand-item-modal.component.html',
  styles: `
   :host {
     border-radius: 30px !important;
   }
  `,
})
export class BrandItemModalComponent {
  #fb = inject(FormBuilder);
  #modalCtrl = inject(ModalController);
  itemForm = this.#fb.group({
    name: ['', Validators.required],
    description: [''],
    unit: ['KG', Validators.required],
    pricePerUnit: [null, [Validators.min(0)]],
    quantityPerUnit: [null, [Validators.min(0)]],
    images: [[] as ISelectCategory[]],

  });
  isEditing = signal(false);
  item = input<IBrandItem>();
  itemChangeEffect = effect(() => {
    const item = this.item();
    untracked(() => {
      if (item) {
        this.isEditing.set(true);
        this.itemForm.patchValue({ ...item });
      }
    });
  });

  cancel() {
    return this.#modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const result = {
        ...formValue,
        id: this.item()?.id,
      };
      return this.#modalCtrl.dismiss(result, 'confirm');
    }
    return;
  }
}
