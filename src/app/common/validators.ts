import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export function ValidatePhone(control: AbstractControl) {
    if (!control.value.match(/0{1}[1-9]{1}[0-9]{8}$/)) {
      return { invalidPhone: true };
    }
    return null;
  }

  export function ValidateToday(control: AbstractControl) {
    // let today: Date = new Date();
    var yesterday = new Date(new Date().setDate(new Date().getDate()-1));
    if (new Date(control.value) < yesterday) {
      return { invalidDate: true };
    }
    return null;
  }

export function ConfirmedValidator(controlNewPass :string,controlRepeatNewPass :string){
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlNewPass];
    const matchingControl = formGroup.controls[controlRepeatNewPass];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
        return;
    }
    if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
    } else {
        matchingControl.setErrors(null);
    }
}
}
export function validateAllFormFields(formGroup:FormGroup){
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormArray) {
      control.markAsTouched({
        onlySelf: true
      });
    }
    if (control instanceof FormControl) {
      control.markAsTouched({
        onlySelf: true
      });
    } else if (control instanceof FormGroup) {
       validateAllFormFields(control);
    }
  });
}

export function findInvalidControlsRecursive(formToInvestigate:FormGroup|FormArray):string[] {
  var invalidControls:string[] = [];
  let recursiveFunc = (form:FormGroup|FormArray) => {
    Object.keys(form.controls).forEach(field => { 
      const control = form.get(field);
      if (control?.invalid) invalidControls.push(field);
      if (control instanceof FormGroup) {
        recursiveFunc(control);
      } else if (control instanceof FormArray) {
        recursiveFunc(control);
      }        
    });
  }
  recursiveFunc(formToInvestigate);
  return invalidControls;
}