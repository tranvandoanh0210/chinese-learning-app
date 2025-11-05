import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Xác nhận';
  @Input() message: string = 'Bạn có chắc chắn muốn thực hiện hành động này?';
  @Input() confirmText: string = 'Xác nhận';
  @Input() cancelText: string = 'Hủy';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() show: boolean = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.onCancel();
    }
  }

  getIcon(): string {
    switch (this.type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-primary';
      default:
        return 'btn-primary';
    }
  }
}
