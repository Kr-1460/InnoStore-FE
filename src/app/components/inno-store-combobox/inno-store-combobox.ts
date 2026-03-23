import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, forwardRef, effect } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-inno-store-combobox',
  imports: [CommonModule, FormsModule],
  templateUrl: './inno-store-combobox.html',
  styleUrl: './inno-store-combobox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InnoStoreCombobox),
      multi: true,
    },
  ],
})
export class InnoStoreCombobox<T extends { id: string | number }> implements ControlValueAccessor {
  // --- Inputs ---
  options = input.required<T[]>();
  // We don't strictly need 'alreadySelected' for the form logic,
  // but if you use it for filtering visuals, keep it.
  alreadySelected = input<T[]>([]);

  labelKey = input.required<keyof T>();
  colorKey = input<keyof T>();
  placeholder = input<string>('Поиск...');

  // --- Signals ---
  searchQuery = signal('');
  isOpened = signal(false);

  // Store the actual value (ID) separately from the search query
  private innerValue = signal<string | number | null>(null);

  itemSelected = output<T>();
  close = output<void>();

  // --- CVA Callbacks ---
  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Effect: Sync the display text (searchQuery) when options load
    // or when the value changes programmatically (e.g. loading saved data)
    effect(
      () => {
        const val = this.innerValue();
        const opts = this.options();

        if (val && opts.length > 0) {
          const found = opts.find((o) => o.id === val);
          if (found) {
            // Set the input text to the Label (e.g. "Sneakers")
            this.searchQuery.set(String(found[this.labelKey()]));
          }
        }
      },
      { allowSignalWrites: true },
    );
  }

  // --- Filtering Logic ---
  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    // Use innerValue to exclude currently selected if needed,
    // or keep your existing 'alreadySelected' logic
    return this.options().filter((item) => {
      const label = String(item[this.labelKey()]).toLowerCase();
      return label.includes(query);
    });
  });

  // --- User Actions ---

  selectOption(item: T) {
    // 1. Update Internal State
    this.innerValue.set(item.id);
    this.searchQuery.set(String(item[this.labelKey()])); // Show label in input
    this.isOpened.set(false);

    // 2. Notify Angular Form
    this.onChange(item.id);

    this.itemSelected.emit(item);
  }

  onInputFocus() {
    this.isOpened.set(true);
    this.searchQuery.set('');
    // Optional: Clear text on focus to allow fresh search?
    // Or keep it to refine search. Up to UX preference.
    this.onTouched();
  }

  onInputBlur() {
    // Optional delay to allow click event to register
    setTimeout(() => {
      this.isOpened.set(false);
      this.onTouched();

      // If user typed garbage and didn't select, revert to valid label or clear
      const val = this.innerValue();
      const opts = this.options();
      const found = opts.find((o) => o.id === val);

      if (found) {
        this.searchQuery.set(String(found[this.labelKey()]));
      } else {
        // If required, maybe clear?
        // this.searchQuery.set('');
      }
    }, 200);
  }

  // --- ControlValueAccessor Implementation ---

  // Called by Angular to write a value from the Form Model to the View
  writeValue(value: string | number | null): void {
    this.innerValue.set(value);
  }

  // Called by Angular to register the function to call when the View changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Called by Angular to register the function to call on blur/touch
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disable state if needed (e.g. disable the input)
  }
}
