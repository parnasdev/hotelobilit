import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { PublicService } from 'src/app/Core/Services/public.service';

@Component({
  selector: 'prs-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})

export class CheckboxComponent {
  @Input() name = ''

  checked: boolean = false;
  disabled = false;
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(
    public publicService: PublicService,
    public errorService: ErrorsService,
    ){
  }

  writeValue(obj: any): void {
    this.checked = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // Perform validation logic here
    if (!control.value || control.value === '') {
      return { required: true };
    }
    return null;
  }

  onModelChange(e: boolean){
    this.checked = e
    this.onChange(e);
  }

  hasError(name: string) {
    return this.errorService.hasError(name)
  }

  getError(name: string) {
    return this.errorService.getError(name)
  }
}
