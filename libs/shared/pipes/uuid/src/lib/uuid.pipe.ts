import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastController } from '@ionic/angular';

@Directive({
  selector: '[lpgUUID]',
})
export class UUIDDirective {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);
  #clipboard = inject(Clipboard);
  #toastCtrl = inject(ToastController);
  lpgUUID = input('');
  uuidChangedEffect = effect(() => {
    const shortUUID = this.lpgUUID().slice(0, 8);
    this.#renderer.setProperty(
      this.#el.nativeElement,
      'innerHTML',
      '#' + shortUUID + '   <ion-icon name="copy" style="opacity: 0.2"></ion-icon>'
    );
    this.#renderer.setAttribute(
      this.#el.nativeElement,
      'title',
      this.lpgUUID()
    );
  });

  @HostListener('click') async onClick() {
    this.#clipboard.copy(this.lpgUUID());
    const toast = await this.#toastCtrl.create({
      message: 'ID copied to clipboard',
      duration: 3000,
      color: 'success',
      icon: 'check',
    });
    await toast.present();
  }
}
