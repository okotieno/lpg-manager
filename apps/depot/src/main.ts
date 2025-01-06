import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader before the bootstrapModule/bootstrapApplication call


const startApp = async () => {
  await defineCustomElements(window);

  await bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
}

startApp();
