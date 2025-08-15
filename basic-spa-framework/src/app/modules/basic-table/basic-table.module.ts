import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaBasicTableComponent } from './components/lista-basic-table/lista-basic-table.component';
import { FormularioBasicTableComponent } from './components/formulario-basic-table/formulario-basic-table.component';
import { BasicTableComponent } from './containers/basic-table/basic-table.component';
import { BasicTableRoutingModule } from './basic-table-routing.module';








@NgModule({
  declarations: [
    ListaBasicTableComponent,
    FormularioBasicTableComponent,
    BasicTableComponent    
  ],
  imports: [
    CommonModule,
    BasicTableRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BasicTableModule { }
