import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaDetalleComponent } from './components/lista-detalle/lista-detalle.component';
import { DetalleComponent } from './containers/detalle/detalle.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ListaDetalleComponent
  },
  {
    path: 'by/:maestraId',
    canActivate: [ AuthGuard ],
    component: ListaDetalleComponent
  },
  {
    path: 'create/:idMaestra',
    canActivate: [ AuthGuard ],
    component: DetalleComponent
  },
  {
    path: 'edit/:id/:idMaestra',
    canActivate: [ AuthGuard ],
    component: DetalleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class DetalleRoutingModule { }
