import { inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthStore } from './auth.store';

export const showAccessDeniedAlert = async ({ app }: { app: string }) => {
  const alertCtrl = inject(AlertController);
  const authStore = inject(AuthStore);

  const alert = await alertCtrl.create({
    backdropDismiss: false,
    header: 'Permission Denied!',
    message: `
                 You are not authorized to access ${app}. Please contact administrator if this is an error.
                `,
    buttons: [
      {
        text: 'Logout',
        handler: () => {
          authStore.logout();
        },
      },
    ],
  });
  await alert.present();
  return true;
};
