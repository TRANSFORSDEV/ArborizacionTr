import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { MasReportesComponent } from './pages/masreportes/masreportes.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ReportesComponent,
    MasReportesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    FontAwesomeModule,
    ReactiveFormsModule,
   // BrowserModule,
    FormsModule
  ]
})
export class ReportesModule { }
