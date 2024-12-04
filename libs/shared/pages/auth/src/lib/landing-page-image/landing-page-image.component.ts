import { Component, effect, HostBinding, input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  standalone: true,
  imports: [],
  selector: 'lpg-landing-page-image',
  templateUrl: './landing-page-image.component.svg',
  styles: `
    .floating {
      background: red !important;
      color: red !important;
      position: absolute;
    }
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
