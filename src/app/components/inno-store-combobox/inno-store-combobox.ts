import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inno-store-combobox',
  imports: [CommonModule, FormsModule],
  templateUrl: './inno-store-combobox.html',
  styleUrl: './inno-store-combobox.scss',
})
export class InnoStoreCombobox<T extends { id: string | number }> {
  // Универсальные входные данные
  options = input.required<T[]>();
  alreadySelected = input<T[]>([]);

  // Ключ, по которому будет идти поиск и отображение текста
  labelKey = input.required<keyof T>();

  colorKey = input<keyof T>();

  // Плейсхолдер для гибкости
  placeholder = input<string>('Поиск...');

  select = output<T>();
  close = output<void>();

  searchQuery = signal('');
  isOpened = signal(true);

  // Универсальная фильтрация
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selectedIds = new Set(this.alreadySelected().map((item) => item.id));

    return this.options().filter((item) => {
      const label = String(item[this.labelKey()]).toLowerCase();
      return !selectedIds.has(item.id) && label.includes(query);
    });
  });

  selectOption(item: T) {
    this.select.emit(item);
    this.isOpened.set(false);
    this.searchQuery.set('');
  }
}
