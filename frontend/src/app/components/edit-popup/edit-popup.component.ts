import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../../types';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent {
  productForm: any;

  constructor(private formBuilder: FormBuilder) {}

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Input() header!: string;

  @Input() product: Product = {
    name: '',
    price: '',
    image: '',
    rating: 0,
  };

  specialCharacterValidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  ngOnChanges() {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, this.specialCharacterValidator()]],
      price: ['', [Validators.required]],
      rating: [0],
      image: [''],
    });

    this.productForm.patchValue(this.product);
  }

  onConfirm() {
    this.confirm.emit(this.productForm.value);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
