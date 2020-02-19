import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneratorComponent } from './components/generator/generator.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: 'generator', component: GeneratorComponent },
  { path: 'payments', component: PaymentsComponent }
];

@NgModule({
  declarations: [
    GeneratorComponent,
    PaymentsComponent
  ],
  imports: [RouterModule.forRoot(routes), CommonModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
