import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IHasUnsavedChanges } from './has-unsaved-changes.interface';

@Injectable({
  providedIn: 'root',
})
export class FormExitGuardService {
  constructor(private alertController: AlertController) {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  hasUnsavedChanges = async (component: IHasUnsavedChanges) => {
    if (component.hasUnsavedChanges) {
      const alert = await this.alertController.create({
        header: 'Unsaved Changes',
        subHeader: 'You have unsaved changes',
        message: 'Continue?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Confirm',
            role: 'destructive',
          },
        ],
      });

      await alert.present();

      const { role } = await alert.onWillDismiss();

      return role === 'destructive';
    }
    return true;
  };
}
