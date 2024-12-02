import { Injectable } from '@angular/core';
import { addIcons } from 'ionicons';



@Injectable({
  providedIn: 'root'
})
export class IconService {
  private readonly basePath = '/svg/';

  registerIcons(icons: string[]): void {
    icons.forEach(icon => {
      addIcons({ [icon]: this.#getIconPath(icon)  });
    });
  }

  #getIconPath(name: string): string {
    return `${this.basePath}${name}.svg`;
  }

}
