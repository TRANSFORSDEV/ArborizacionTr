import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestraRoutingModule } from './maestra-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { FormularioMaestraComponent } from './components/formulario-maestra/formulario-maestra.component';
import { ListaMaestraComponent } from './components/lista-maestra/lista-maestra.component';
import { MaestraComponent } from './containers/maestra/maestra.component';


@NgModule({
  declarations: [
    ListaMaestraComponent,
    FormularioMaestraComponent,
    MaestraComponent    
  ],
  imports: [
    CommonModule,
    MaestraRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MaestraModule { }
