import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Impegno } from '../../models/impegno';
import { ApiService } from '../../services/api';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-calendar-view',
  imports: [CommonModule],
  templateUrl: './calendar-view.html',
  styleUrl: './calendar-view.css',
})
export class CalendarView {
  // Settimana corrente
  currentWeekStart = signal<Date>(this.getWeekStart(new Date()));
  
  // Computed per i giorni della settimana
  weekDays = computed(() => {
    const start = this.currentWeekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  });
  
  // Ore della giornata (8:00 - 23:00)
  hours = Array.from({ length: 16 }, (_, i) => i + 8);
  
  // Giorni della settimana
  dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  
  constructor(
    public apiService: ApiService,
    public langService: LanguageService
  ) {}
  
  // Ottieni l'inizio della settimana (Lunedì)
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }
  
  // Settimana precedente
  previousWeek() {
    this.currentWeekStart.update(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 7);
      return newDate;
    });
  }
  
  // Settimana successiva
  nextWeek() {
    this.currentWeekStart.update(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 7);
      return newDate;
    });
  }
  
  // Torna ad oggi
  goToToday() {
    this.currentWeekStart.set(this.getWeekStart(new Date()));
  }
  
  // Ottieni impegni per un giorno e ora specifici
  getImpegniForDayAndHour(day: Date, hour: number): Impegno[] {
    return this.apiService.impegni().filter(impegno => {
      const impegnoDate = new Date(impegno.data);
      const impegnoHour = parseInt(impegno.ora_inizio.split(':')[0]);
      
      return (
        impegnoDate.toDateString() === day.toDateString() &&
        impegnoHour === hour
      );
    });
  }
  
  // Verifica se un giorno è oggi
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  // Formatta data per l'header
  formatDate(date: Date): string {
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  }
  
  // Ottieni colore per categoria
  getCategoryColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'lavoro': '#3b82f6',
      'studio': '#8b5cf6',
      'personale': '#ec4899',
      'sport': '#10b981',
      'altro': '#6b7280'
    };
    return colors[categoria] || colors['altro'];
  }
}
