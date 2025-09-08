export interface MenuConfig {
  id?: number;
  titulo: string;
  icono?: string;
  ruta: string;
  permisos?: boolean;
  subMenu?: MenuConfig[];
}

export const menuAdmin: MenuConfig[] = [
  { titulo: 'Usuarios', ruta: '#/app/usuarios', permisos: false },
  { titulo: 'Roles', ruta: '#/app/roles', permisos: false },
  { titulo: 'Permisos', ruta: '#/app/permisos', permisos: false }
]

export const menuArbol: MenuConfig[] = [
  { titulo: 'Censo', ruta: '#/app/censo', permisos: false },
  { titulo: 'Espacios', ruta: '#/app/espacios', permisos: false }
]

export const menuConfig: MenuConfig[] = [
  { titulo: 'Tipo de individuo (forestal, arbusto, palma, frutal, bambú y guadua)', ruta: '#/app/detalle/by/0475362b-ab82-4d1e-8a32-cbfc0f5bd942', permisos: true },
  { titulo: 'Características edáficas o del suelo', ruta: '#/app/detalle/by/08bc8ed9-870a-4973-9908-4360702fff55', permisos: true },
  { titulo: 'Infraestructura afectada', ruta: '#/app/detalle/by/1bbd9baf-b6c1-46a8-b175-c9ad299646ee', permisos: true },
  { titulo: 'Tipo de emplazamiento', ruta: '#/app/detalle/by/3600546b-7820-4384-b05f-c0d77d17932c', permisos: true },
  { titulo: 'Distanciamiento de siembra', ruta: '#/app/detalle/by/3bb50b22-9b46-4662-876d-6bbcdacce005', permisos: true },
  { titulo: 'Especies potenciales para siembra (Al menos tres opciones)', ruta: '#/app/detalle/by/5ed945fe-351d-4315-8c46-aeed0b730f4a', permisos: true },
  { titulo: 'Estado de madurez', ruta: '#/app/detalle/by/77dcb515-3652-4387-8952-9070642aa296', permisos: true },
  { titulo: 'Pendiente del terreno', ruta: '#/app/detalle/by/7e60de52-ff90-4ab0-a379-0633bda93618', permisos: true },
  { titulo: 'Poda sanitaria', ruta: '#/app/detalle/by/961d1612-d404-4fc0-b951-93552ee10b88', permisos: true },
  { titulo: 'Estado fitosanitario', ruta: '#/app/detalle/by/a6207503-a3bd-460d-8b2c-d9e7360f68cc', permisos: true },
  { titulo: 'Recomendaciones para manejo silvicultural', ruta: '#/app/detalle/by/abe3625e-670d-4c49-851c-2b5c6555d6de', permisos: true },
  { titulo: 'Alturas potenciales de árboles', ruta: '#/app/detalle/by/b0bb7f80-7997-4130-9ad4-301101b4f6ea', permisos: true },
  { titulo: 'Estructuras cercanas (Tipo de emplazamiento)', ruta: '#/app/detalle/by/b4f84511-f07a-412e-9fa0-f68180daf435', permisos: true },
  { titulo: 'Limpieza', ruta: '#/app/detalle/by/e2b9fb66-ecc8-45e6-96dc-2bcde2267d76', permisos: true },
  { titulo: 'Forma de copa', ruta: '#/app/detalle/by/e34711a0-b522-429f-af9b-307c9eead211', permisos: true },
  { titulo: 'Orden', ruta: '#/app/basictable/Orden', permisos: true },
  { titulo: 'Familia', ruta: '#/app/basictable/Familia', permisos: true },
  { titulo: 'Genero', ruta: '#/app/basictable/Genero', permisos: true },
  { titulo: 'Especie', ruta: '#/app/basictable/Especie', permisos: true },
  { titulo: 'Comuna', ruta: '#/app/basictable/Comuna', permisos: true },
  { titulo: 'Barrio', ruta: '#/app/basictable/Barrio', permisos: true },
]

export const menuActividades: MenuConfig[] = [
  { titulo: 'Actividades de Siembra', ruta: '#/app/actividades/lista/Siembra', permisos: true },
  { titulo: 'Actividades de Poda', ruta: '#/app/actividades/lista/Poda', permisos: true },
  { titulo: 'Actividades de Tala', ruta: '#/app/actividades/lista/Tala', permisos: true },
  { titulo: 'Actividades Solicitada', ruta: '#/app/actividades/intervenciones/Solicitada', permisos: true },
  { titulo: 'Actividades Aprobada', ruta: '#/app/actividades/intervenciones/Aprobada', permisos: true },
  { titulo: 'Actividades Ejecutada', ruta: '#/app/actividades/intervenciones/Ejecutada', permisos: true },
  { titulo: 'Actividades Rechazada', ruta: '#/app/actividades/intervenciones/Rechazada', permisos: true },
]

export const menuReportes: MenuConfig[] = [
  { titulo: 'Reportes', ruta: '#/app/reportes/masreportes', permisos: true }
]

export const MENU_CONFIG: MenuConfig[] = [
  {
    id: 1,
    titulo: 'Dashboard',
    icono: 'dash',
    ruta: '#/app/home',
    permisos: true
  },
  {
    id: 2,
    titulo: 'Administracion',
    icono: 'admin',
    ruta: '/app/',
    permisos: true,
    subMenu: menuAdmin
  },
  {
    id: 3,
    titulo: 'Configuraciones',
    icono: 'config',
    ruta: '/app/',
    permisos: true,
    subMenu: menuConfig
  },
  {
    id: 4,
    titulo: 'Arborización',
    icono: 'arbol',
    ruta: '/app/',
    permisos: true,
    subMenu: menuArbol
  },
  {
    id: 5,
    titulo: 'Actividades Silviculturales',
    icono: 'actividad',
    ruta: '/app/',
    permisos: true,
    subMenu: menuActividades
  },
  {
    id: 6,
    titulo: 'Reportes',
    icono: 'reporte',
    ruta: '/app/',
    permisos: true,
    subMenu: menuReportes
  },
]
