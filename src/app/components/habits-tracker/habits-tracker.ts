import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-habits-tracker',
  imports: [CommonModule, FormsModule],
  templateUrl: './habits-tracker.html',
  styleUrl: './habits-tracker.css',
})
export class HabitsTracker {
  // Abitudini (demo data)
  habits = signal<Habit[]>([
    {
      id: 1,
      nome: 'Meditazione',
      emoji: '🧘',
      frequenza: 'giornaliero',
      obiettivo: 7,
      categoria: 'mindfulness',
      completamenti: this.getLast7Days().map(d => ({
        data: d,
        completato: Math.random() > 0.3
      })),
      streak: 3,
      totalCompletamenti: 45
    },
    {
      id: 2,
      nome: 'Esercizio Fisico',
      emoji: '💪',
      frequenza: 'giornaliero',
      obiettivo: 5,
      categoria: 'sport',
      completamenti: this.getLast7Days().map(d => ({
        data: d,
        completato: Math.random() > 0.5
      })),
      streak: 2,
      totalCompletamenti: 28
    },
    {
      id: 3,
      nome: 'Leggere',
      emoji: '📚',
      frequenza: 'giornaliero',
      obiettivo: 7,
      categoria: 'studio',
      completamenti: this.getLast7Days().map(d => ({
        data: d,
        completato: Math.random() > 0.4
      })),
      streak: 5,
      totalCompletamenti: 62
    },
    {
      id: 4,
      nome: 'Bere 2L Acqua',
      emoji: '💧',
      frequenza: 'giornaliero',
      obiettivo: 7,
      categoria: 'salute',
      completamenti: this.getLast7Days().map(d => ({
        data: d,
        completato: Math.random() > 0.3
      })),
      streak: 7,
      totalCompletamenti: 89
    }
  ]);
  
  constructor(private toastService: ToastService) {}
  
  // Ultimi 7 giorni
  private getLast7Days(): Date[] {
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }
  
  // Toggle completamento oggi
  toggleToday(habit: Habit) {
    const today = new Date().toDateString();
    const todayLog = habit.completamenti.find(c => 
      new Date(c.data).toDateString() === today
    );
    
    if (todayLog) {
      todayLog.completato = !todayLog.completato;
      
      if (todayLog.completato) {
        this.toastService.success(`✅ ${habit.nome} completato oggi!`);
      } else {
        this.toastService.info(`${habit.nome} segnato come non completato`);
      }
      
      // Aggiorna streak e salva
      this.updateHabitStreak(habit);
    }
  }
  
  private updateHabitStreak(habit: Habit) {
    // Calcola streak (giorni consecutivi)
    let streak = 0;
    const sorted = [...habit.completamenti].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
    
    for (const log of sorted) {
      if (log.completato) {
        streak++;
      } else {
        break;
      }
    }
    
    habit.streak = streak;
  }
  
  // Verifica se oggi è completato
  isTodayCompleted(habit: Habit): boolean {
    const today = new Date().toDateString();
    const todayLog = habit.completamenti.find(c => 
      new Date(c.data).toDateString() === today
    );
    return todayLog?.completato || false;
  }
  
  // Ottieni colore categoria
  getCategoryColor(categoria: string): string {
    const colors: { [key: string]: string } = {
      'salute': '#10b981',
      'studio': '#8b5cf6',
      'sport': '#f59e0b',
      'mindfulness': '#06b6d4',
      'produttivita': '#3b82f6',
      'altro': '#6b7280'
    };
    return colors[categoria] || colors['altro'];
  }
}
