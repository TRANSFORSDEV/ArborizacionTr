import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    debugger
    if (+value === 0 || (value >= min && value <= max)) {
      return null; // El valor es válido
    }
    return { rangeError: { min, max } }; // El valor no es válido
  };
}
