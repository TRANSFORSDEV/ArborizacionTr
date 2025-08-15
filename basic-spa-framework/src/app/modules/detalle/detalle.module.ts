import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleRoutingModule } from './detalle-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { FormularioDetalleComponent } from './components/formulario-detalle/formulario-detalle.component';
import { ListaDetalleComponent } from './components/lista-detalle/lista-detalle.component';
import { DetalleComponent } from './containers/detalle/detalle.component';



@NgModule({
  declarations: [
    ListaDetalleComponent,
    FormularioDetalleComponent,
    DetalleComponent
       
  ],
  imports: [
    CommonModule,
    DetalleRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DetalleModule { }
