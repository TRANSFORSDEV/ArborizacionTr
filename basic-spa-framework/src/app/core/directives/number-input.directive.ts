import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective {

  
  constructor(private el: ElementRef, private renderer: Renderer2 ) {}
  
  ngOnInit() {
    // Aplicar estilos CSS aquí
    this.renderer.setStyle(this.el.nativeElement, 'text-align', 'right');
    // También puedes agregar clases CSS
    this.renderer.addClass(this.el.nativeElement, 'tu-clase-css');
  }


  @HostListener('input', ['$event'])
  onInput(event: any): void {

    const inputValue = event.target.value;
    let formattedValue = inputValue.replace(/[^0-9.]/g, ''); // Permite solo números y un punto
    const decimalCount = (formattedValue.match(/\./g) || []).length; // Contar la cantidad de puntos
    if (decimalCount > 1) {
      const parts = formattedValue.split('.');
      formattedValue = parts[0] + '.' + parts.slice(1).join(''); // Elimina puntos adicionales
    }
    this.el.nativeElement.value = formattedValue;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === '.' && this.el.nativeElement.value.includes('.')) {
      event.preventDefault(); // Evitar la entrada de más de un punto
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any): void {
    // Formatear el valor al perder el foco, por ejemplo, para mostrar un número con una cantidad fija de decimales
    const inputValue = event.target.value;
    if (inputValue !== '') {
      const numberValue = parseFloat(inputValue.replace(',', '.')); // Convertir coma a punto
      this.el.nativeElement.value = numberValue.toFixed(2); // Mostrar siempre dos decimales
    }
  }
}
