import { Routes } from '@angular/router';
import { InputformComponent } from './pages/inputform/inputform.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inputform', pathMatch: 'full' },
  { path: 'inputform', component: InputformComponent },
  { path: '**', redirectTo: 'inputform' }
];
