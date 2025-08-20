import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.scss']
})
export class DropdownMenuComponent {
  @Input() label: string;
  @Input() dropdownId: string;
  @Input() isActive: boolean = false;

  isDropdownOpen = false;
  @Output() closed = new EventEmitter<void>();

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.closed.emit();
  }
}
