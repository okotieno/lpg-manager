import { Component, Input, OnInit } from '@angular/core';
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
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';

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
export class BrandItemModalComponent implements OnInit {
  @Input() item?: IBrandItem;
  itemForm: FormGroup;
  isEditing = false;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit() {
    if (this.item) {
      this.isEditing = true;
      this.itemForm.patchValue({
        name: this.item.name,
        description: this.item.description
      });
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const result: IBrandItem = {
        ...formValue,
        id: this.item?.id
      };
      return this.modalCtrl.dismiss(result, 'confirm');
    }
    return;
  }
}
