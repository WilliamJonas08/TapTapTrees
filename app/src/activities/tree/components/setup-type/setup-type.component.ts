import { Component, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TYPE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SetupTypeComponent),
  multi: true
};

@Component({
  selector: 'setup-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TYPE_CONTROL_ACCESSOR],
  templateUrl: './setup-type.component.html',
  styleUrls: ['./setup-type.component.scss']
})
export class SetupTypeComponent implements ControlValueAccessor {

  constructor() { }

  selectors = ['easy', 'moderate', 'hard'];

  value: string;

  // Implementation of the ControlValueAccessorInterface
  private onTouch: Function;
  private onModelChange: Function;

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }
  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }
  writeValue(value: string) {
    this.value = value;
  }

  setSelected(value: string) {
    this.value = value;
    this.onModelChange(value);
    this.onTouch();
  }

}