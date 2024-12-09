import { Component, HostBinding, input } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'lpg-landing-page-image',
  templateUrl: './landing-page-image.component.svg',
  styles: `
    :host {
      /*width: 100%;*/
      opacity: 0.4;
    }
  `,
  host: {
    '[class]': '{backgroundColor: "red"}',
  },
})
export class LandingPageImageComponent {
  smallDevice = input(false);
  @HostBinding('style.position')
  get floating() {
    return !this.smallDevice() ? 'unset' : 'absolute';
  }

}
