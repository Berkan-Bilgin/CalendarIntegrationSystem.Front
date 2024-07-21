import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() confirmButtonText: string = 'Save';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() showForm: boolean = false;
  @Input() confirmButtonClass: string = '';
  @Input() itemType: string = '';

  @Output() confirm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      eventName: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  openModal() {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.showModal();
  }

  closeModal() {
    const dialog = document.getElementById('my_modal_1') as HTMLDialogElement;
    dialog.close();
    this.close.emit();
  }

  onConfirm() {
    if (this.showForm) {
      this.confirm.emit(this.form.value);
    } else {
      this.confirm.emit();
    }
    this.closeModal();
  }
}
