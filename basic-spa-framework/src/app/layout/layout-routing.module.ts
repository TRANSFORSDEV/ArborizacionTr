import { PermisosModule } from './../modules/permisos/permisos.module';
import { WorkspaceComponent } from './pages/workspace/workspace.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'reportes',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/reportes/reportes.module').then((m) => m.ReportesModule),
      },
      {
        path: 'usuarios',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'roles',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'modules',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/module/module.module').then((m) => m.ModuleModule),
      },
      {
        path: 'permisos',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/permisos/permisos.module').then((m) => m.PermisosModule),
      },
      {
        path: 'maestra',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/maestra/maestra.module').then((m) => m.MaestraModule),
      },
      {
        path: 'detalle',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/detalle/detalle.module').then((m) => m.DetalleModule),
      },
      {
        path: 'actividades',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/actividadessilviculturales/actividades-silviculturales.module').then((m) => m.ActividadesSilviculturalesModule),
      },
      {
        path: 'censo',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/censoarboreo/censoarboreo.module').then((m) => m.CensoArboreoModule),
      },
      {
        path: 'espacios',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/espaciopotenciales/espaciospotenciales.module').then((m) => m.EspaciosPotencialesModule),
      },

      {
        path: 'basictable',
        canActivate: [ AuthGuard ],
        loadChildren: () =>
          import('../modules/basic-table/basic-table.module').then((m) => m.BasicTableModule),
      }

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
