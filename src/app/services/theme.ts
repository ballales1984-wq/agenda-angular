import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal per il tema corrente
  public isDarkMode = signal<boolean>(false);
  
  constructor() {
    // Carica il tema salvato da localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Rileva preferenza di sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
    
    // Effect per applicare il tema quando cambia
    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
  
  // Toggle tra dark/light mode
  toggleTheme() {
    this.isDarkMode.update(current => !current);
  }
  
  // Imposta esplicitamente il tema
  setTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
  }
}
