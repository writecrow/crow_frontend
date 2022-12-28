import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toggle]'
})
export class ToggleDirective {

  private _shown = false;

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.innerHTML = '<img src="/assets/eye-close.svg" alt="Hide password" />';
    span.addEventListener('click', () => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<img src="/assets/eye-open.svg" alt="Show password" />';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<img src="/assets/eye-close.svg" alt="Hide password"/>';
    }
  }
}
