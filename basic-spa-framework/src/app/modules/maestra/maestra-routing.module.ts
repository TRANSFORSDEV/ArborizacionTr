import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaMaestraComponent } from './components/lista-maestra/lista-maestra.component';
import { MaestraComponent } from './containers/maestra/maestra.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ListaMaestraComponent
  },
  {
    path: 'create',
    canActivate: [ AuthGuard ],
    component: MaestraComponent
  },
  {
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: MaestraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class MaestraRoutingModule { }
