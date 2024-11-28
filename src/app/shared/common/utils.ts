// form-utils.ts
import { FormGroup, Validators } from '@angular/forms';

export function setupConditionalValidation(form: FormGroup, mainControlName: string, dependentControls: string[]) {
  form.controls[mainControlName].valueChanges.subscribe(value => {
    if (value) {
      // If the main control has a value, remove validators from the dependent controls
      dependentControls.forEach(controlName => {
        form.controls[controlName].clearValidators();
        form.controls[controlName].updateValueAndValidity();
      });
    } else {
      // If the main control is empty, add required validators to the dependent controls
      dependentControls.forEach(controlName => {
        form.controls[controlName].setValidators([Validators.required]);
        form.controls[controlName].updateValueAndValidity();
      });
    }
  });
}
