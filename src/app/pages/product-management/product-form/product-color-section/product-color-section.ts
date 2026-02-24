import { Component, input, output, signal } from '@angular/core';
import { SystemColor } from '../../../../components/inno-store-color-selection/inno-store-color-selection';
import { InnoStoreCombobox } from '../../../../components/inno-store-combobox/inno-store-combobox';
import { SYSTEM_COLORS } from '../../../../core/constants/system-colors';

@Component({
  selector: 'app-product-color-section',
  imports: [InnoStoreCombobox],
  templateUrl: './product-color-section.html',
  styleUrl: './product-color-section.scss',
})
export class ProductColorSection {
  selectedColors = input.required<SystemColor[]>();
  activeColorId = input.required<string | undefined>();
  systemColors = input<SystemColor[]>(SYSTEM_COLORS);

  colorSelect = output<SystemColor>();
  colorAdded = output<SystemColor>();
  removeColor = output<SystemColor>();
  colorChanged = output<{ oldId: string; newColor: SystemColor }>();
  isSelecting = signal(false);

  editingColorId = signal<string | null>(null);

  startEdit(color: SystemColor) {
    this.editingColorId.set(color.id);
  }

  onSelectReplacement(newColor: SystemColor) {
    const oldId = this.editingColorId();
    if (oldId) {
      this.colorChanged.emit({ oldId, newColor });
      this.editingColorId.set(null);
    }
  }

  toggleSelection() {
    this.isSelecting.update((v) => !v);
  }

  onSelectNewColor(color: SystemColor) {
    if (color) {
      this.colorAdded.emit(color);
      this.isSelecting.set(false);
    }
  }
}
