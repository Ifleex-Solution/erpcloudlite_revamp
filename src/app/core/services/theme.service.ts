import { Injectable, signal } from '@angular/core';

export interface ThemeOption {
  id: string;
  label: string;
  primary: string;
  accent: string;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly themes: ThemeOption[] = [
    { id: 'theme-azure',   label: 'Azure',   primary: '#0078D4', accent: '#60a5fa' },
    { id: 'theme-violet',  label: 'Violet',  primary: '#7C3AED', accent: '#a78bfa' },
    { id: 'theme-rose',    label: 'Rose',    primary: '#E11D48', accent: '#fb7185' },
    { id: 'theme-green',   label: 'Green',   primary: '#16A34A', accent: '#4ade80' },
    { id: 'theme-orange',  label: 'Orange',  primary: '#EA580C', accent: '#fb923c' },
    { id: 'theme-teal',    label: 'Teal',    primary: '#0D9488', accent: '#2dd4bf' },
  ];

  currentTheme = signal<string>('theme-azure');
  isDark        = signal<boolean>(false);

  constructor() {
    // Priority: company object in session → separate session keys → defaults
    let initial = 'theme-azure';
    let dark    = false;

    try {
      const company = JSON.parse(sessionStorage.getItem('company') ?? '{}');
      if (company?.theme_color && this.themes.find(t => t.id === company.theme_color)) {
        initial = company.theme_color;
      } else {
        const saved = sessionStorage.getItem('app-theme');
        if (saved && this.themes.find(t => t.id === saved)) initial = saved;
      }
      dark = company?.theme_dark ? !!+company.theme_dark
           : sessionStorage.getItem('app-dark') === 'true';
    } catch {}

    this.currentTheme.set(initial);
    this.isDark.set(dark);
    this.applyTheme(initial);
    this.applyDark(dark);
  }

  setTheme(id: string): void {
    this.currentTheme.set(id);
    sessionStorage.setItem('app-theme', id);
    this.applyTheme(id);
  }

  toggleDark(): void {
    this.setDark(!this.isDark());
  }

  setDark(dark: boolean): void {
    this.isDark.set(dark);
    sessionStorage.setItem('app-dark', String(dark));
    this.applyDark(dark);
  }

  private applyTheme(id: string): void {
    const html = document.documentElement;
    this.themes.forEach(t => html.classList.remove(t.id));
    html.classList.add(id);
  }

  private applyDark(dark: boolean): void {
    document.documentElement.classList.toggle('dark-mode', dark);
  }
}
