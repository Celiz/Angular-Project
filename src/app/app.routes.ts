import { Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  {
    path: 'todo',
    component: TodoComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  
  {
    path: '**',
    redirectTo: 'todo',
    pathMatch: 'full',
  },
];
