import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputformComponent } from './pages/inputform/inputform.component';

const routes: Routes = [
  { path: '', redirectTo: 'inputform', pathMatch: 'full' },
  { path: 'inputform', component: InputformComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
