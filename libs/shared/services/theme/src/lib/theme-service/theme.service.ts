import {
  effect,
  inject,
  Injectable,
  RendererFactory2,
  signal,
  untracked,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  document = inject(DOCUMENT);
  renderer = inject(RendererFactory2).createRenderer(null,null);
  theme = signal<Theme>(this.getInitialTheme());
  themeChangeEffect = effect(() => {
    const theme = this.theme();
    untracked(() => {
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
    })
  })
  constructor() {
    this.applyTheme(this.theme());
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  }

  private applyTheme(theme: Theme) {
    if (theme === 'system') {
      this.applySystemTheme();
    } else {
      this.document.querySelector('body')?.classList.toggle('dark', theme === 'dark');
    }
  }

  private applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.document.querySelector('body')?.classList.toggle('dark', prefersDark.matches);

    prefersDark.addEventListener('change', (e) => {
      if (this.theme() === 'system') {
        this.document.querySelector('body')?.classList.toggle('dark', e.matches);
      }
    });
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
  }
}
