import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MENU_CONFIG } from './config/config';
import { Habilitaracciones } from 'src/app/core/services/habilitaracciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  menu = MENU_CONFIG;
  activeDropdowns: boolean[] = []; 
  
  @Input() menuVisible: boolean = false;
  @Output() visible = new EventEmitter<boolean>();
  
  constructor(
    private router: Router,
    private habilitarAcciones: Habilitaracciones,
  ) {
    this.activeDropdowns = new Array(this.menu.length).fill(false);
  }

  ngOnInit(): void {
    const resultados = this.habilitarAcciones.MostrarBotones('');

    if (resultados.length > 0) {
      resultados.forEach(resultado => {
        if (resultado.module) {
          switch (resultado.module) {
            case 'Permisos':
              this.menu[1].subMenu[2].permisos = resultado.listed;
              break;
            case 'Espacios':
              this.menu[3].subMenu[1].permisos = resultado.listed;
              break;
            case 'Roles':
              this.menu[1].subMenu[1].permisos = resultado.listed;
              break;
            case 'Usuarios':
              this.menu[1].subMenu[0].permisos = resultado.listed;
              break;
            case 'Censo':
              this.menu[3].subMenu[0].permisos = resultado.listed;
              break;
          }
        }
      });
    }
  }
  
  toggleDropdown(index: number): void {
    this.activeDropdowns[index] = !this.activeDropdowns[index];

    for (let i = 0; i < this.activeDropdowns.length; i++) {
      if (i !== index) {
        this.activeDropdowns[i] = false;
      }
    }
  }
    
  closeDropdown(index: number): void {
    this.activeDropdowns[index] = false;
    this.visible.emit(false);
  }

  closeAllDropdowns(): void {
    this.activeDropdowns.fill(false);
  }

  onSubItemClick(parentIndex: number, subItem: any): void {
    this.closeDropdown(parentIndex);
    subItem.ruta.startsWith('#') ? window.location.href = subItem.ruta : this.router.navigate([subItem.ruta]);
  }
}