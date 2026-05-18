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
    { id: 'theme-azure',  label: 'Azure',  primary: '#0078D4', accent: '#60a5fa' },
    { id: 'theme-violet', label: 'Violet', primary: '#7C3AED', accent: '#a78bfa' },
    { id: 'theme-rose',   label: 'Rose',   primary: '#E11D48', accent: '#fb7185' },
    { id: 'theme-green',  label: 'Green',  primary: '#16A34A', accent: '#4ade80' },
    { id: 'theme-orange', label: 'Orange', primary: '#EA580C', accent: '#fb923c' },
  ];

  currentTheme = signal<string>('theme-azure');

  constructor() {
    const saved = localStorage.getItem('app-theme');
    const initial = saved && this.themes.find(t => t.id === saved) ? saved : 'theme-azure';
    this.currentTheme.set(initial);
    this.apply(initial);
  }

  setTheme(id: string): void {
    this.currentTheme.set(id);
    localStorage.setItem('app-theme', id);
    this.apply(id);
  }

  private apply(id: string): void {
    const html = document.documentElement;
    this.themes.forEach(t => html.classList.remove(t.id));
    html.classList.add(id);
  }
}
