import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaEspaciosPotencialesComponent } from './components/lista-espaciospotenciales/lista-espaciospotenciales.component';
import { EspaciosPotencialesComponent } from './containers/espaciospotenciales/espaciospotenciales.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ListaEspaciosPotencialesComponent
  },
  {
    path: 'create',
    canActivate: [ AuthGuard ],
    component: EspaciosPotencialesComponent
  },
  {
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: EspaciosPotencialesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class EspaciosPotencialesRoutingModule { }
