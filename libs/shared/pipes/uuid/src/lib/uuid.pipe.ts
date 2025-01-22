import {
  computed,
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
  shortUUID = computed(() => this.lpgUUID().slice(0, 8));
  uuidChangedEffect = effect(() => {
    this.#renderer.setProperty(
      this.#el.nativeElement,
      'innerHTML',
      '#' +
        this.shortUUID() +
        '   <ion-icon name="copy" style="opacity: 0.2"></ion-icon>'
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

  @HostListener('mouseover') async onMouseOver() {
    // Set color of element to the primary color
    this.#renderer.setStyle(this.#el.nativeElement, 'color', 'var(--ion-color-primary)');
    // Set cursor to pointer
    this.#renderer.setStyle(this.#el.nativeElement, 'cursor', 'pointer');
    // Set icon opacity to 1
    const icon = this.#el.nativeElement.querySelector('ion-icon');
    if (icon) {
      this.#renderer.setStyle(icon, 'opacity', '1');
    }
  }

  @HostListener('mouseout') async onMouseOut() {
    // Remove primary color
    this.#renderer.removeStyle(this.#el.nativeElement, 'color');
    // Reset cursor style
    this.#renderer.removeStyle(this.#el.nativeElement, 'cursor');
    // Reset icon opacity
    const icon = this.#el.nativeElement.querySelector('ion-icon');
    if (icon) {
      this.#renderer.setStyle(icon, 'opacity', '0.2');
    }
  }
}
