import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';
import { LanguageService } from './services/language';
import { ChatInterface } from './components/chat-interface/chat-interface';
import { CalendarView } from './components/calendar-view/calendar-view';
import { DiaryBook } from './components/diary-book/diary-book';
import { StatsDashboard } from './components/stats-dashboard/stats-dashboard';
import { CommunityFeed } from './components/community-feed/community-feed';
import { PomodoroTimer } from './components/pomodoro-timer/pomodoro-timer';
import { HabitsTracker } from './components/habits-tracker/habits-tracker';
import { GlobalSearch } from './components/global-search/global-search';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ChatInterface, CalendarView, DiaryBook, StatsDashboard, CommunityFeed, PomodoroTimer, HabitsTracker, GlobalSearch, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Vista attiva
  activeView = signal<'chat' | 'calendar' | 'diary' | 'stats' | 'community' | 'pomodoro' | 'habits'>('chat');
  
  constructor(
    public themeService: ThemeService,
    public langService: LanguageService
  ) {}
  
  // Cambia vista
  setView(view: 'chat' | 'calendar' | 'diary' | 'stats' | 'community' | 'pomodoro' | 'habits') {
    this.activeView.set(view);
  }
}
