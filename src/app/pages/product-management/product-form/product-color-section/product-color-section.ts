import { Component, input, output, signal } from '@angular/core';
import { SystemColor } from '../../../../components/inno-store-color-selection/inno-store-color-selection';
import { InnoStoreCombobox } from '../../../../components/inno-store-combobox/inno-store-combobox';

@Component({
  selector: 'app-product-color-section',
  imports: [InnoStoreCombobox],
  templateUrl: './product-color-section.html',
  styleUrl: './product-color-section.scss',
})
export class ProductColorSection {
  selectedColors = input.required<SystemColor[]>();
  activeColorId = input.required<string | undefined>();

  // Весь справочник системных цветов для выбора
  systemColors = input<SystemColor[]>([
    // --- БАЗОВЫЕ И СЕРЫЕ ---
    { id: '1', name: 'Черный (Black)', hex: '#000000' },
    { id: '2', name: 'Белый (White)', hex: '#FFFFFF' },
    { id: '3', name: 'Серый (Grey)', hex: '#808080' },
    { id: '6', name: 'Антрацит (Anthracite)', hex: '#2F3E46' },
    { id: '7', name: 'Серебристый (Silver)', hex: '#C0C0C0' },
    { id: '8', name: 'Графит (Graphite)', hex: '#383838' },
    { id: '9', name: 'Светло-серый (Light Grey)', hex: '#D3D3D3' },

    // --- КРАСНЫЕ И РОЗОВЫЕ ---
    { id: '4', name: 'Красный (Red)', hex: '#EF4444' },
    { id: '10', name: 'Бордовый (Bordeaux)', hex: '#800000' },
    { id: '11', name: 'Розовый (Pink)', hex: '#F472B6' },
    { id: '12', name: 'Фуксия (Fuchsia)', hex: '#FF00FF' },
    { id: '13', name: 'Коралловый (Coral)', hex: '#FF7F50' },
    { id: '14', name: 'Малиновый (Crimson)', hex: '#DC143C' },
    { id: '15', name: 'Пыльно-розовый (Dusty Rose)', hex: '#DCAE96' },

    // --- СИНИЕ И ГОЛУБЫЕ ---
    { id: '5', name: 'Синий (Blue)', hex: '#3B82F6' },
    { id: '16', name: 'Темно-синий (Navy)', hex: '#000080' },
    { id: '17', name: 'Голубой (Sky Blue)', hex: '#87CEEB' },
    { id: '18', name: 'Бирюзовый (Turquoise)', hex: '#40E0D0' },
    { id: '19', name: 'Индиго (Indigo)', hex: '#4B0082' },
    { id: '20', name: 'Лазурный (Azure)', hex: '#007FFF' },
    { id: '21', name: 'Морская волна (Teal)', hex: '#008080' },

    // --- ЗЕЛЕНЫЕ ---
    { id: '22', name: 'Зеленый (Green)', hex: '#10B981' },
    { id: '23', name: 'Оливковый (Olive)', hex: '#808000' },
    { id: '24', name: 'Изумрудный (Emerald)', hex: '#50C878' },
    { id: '25', name: 'Мятный (Mint)', hex: '#98FF98' },
    { id: '26', name: 'Лайм (Lime)', hex: '#00FF00' },
    { id: '27', name: 'Хвойный (Forest Green)', hex: '#228B22' },
    { id: '28', name: 'Фисташковый (Pistachio)', hex: '#93C572' },

    // --- ЖЕЛТЫЕ И ОРАНЖЕВЫЕ ---
    { id: '29', name: 'Желтый (Yellow)', hex: '#FBBF24' },
    { id: '30', name: 'Оранжевый (Orange)', hex: '#F97316' },
    { id: '31', name: 'Золотой (Gold)', hex: '#FFD700' },
    { id: '32', name: 'Лимонный (Lemon)', hex: '#FFF700' },
    { id: '33', name: 'Горчичный (Mustard)', hex: '#FFDB58' },
    { id: '34', name: 'Янтарный (Amber)', hex: '#FFBF00' },

    // --- КОРИЧНЕВЫЕ И БЕЖЕВЫЕ ---
    { id: '35', name: 'Коричневый (Brown)', hex: '#78350F' },
    { id: '36', name: 'Бежевый (Beige)', hex: '#F5F5DC' },
    { id: '37', name: 'Песочный (Sand)', hex: '#C2B280' },
    { id: '38', name: 'Шоколадный (Chocolate)', hex: '#D2691E' },
    { id: '39', name: 'Кофе с молоком (Latte)', hex: '#A67B5B' },
    { id: '40', name: 'Терракотовый (Terracotta)', hex: '#E2725B' },
    { id: '41', name: 'Слоновая кость (Ivory)', hex: '#FFFFF0' },

    // --- ФИОЛЕТОВЫЕ ---
    { id: '42', name: 'Фиолетовый (Purple)', hex: '#8B5CF6' },
    { id: '43', name: 'Лавандовый (Lavender)', hex: '#E6E6FA' },
    { id: '44', name: 'Сиреневый (Lilac)', hex: '#C8A2C8' },
    { id: '45', name: 'Пурпурный (Magenta)', hex: '#FF00FF' },
    { id: '46', name: 'Баклажановый (Eggplant)', hex: '#614051' },

    // --- ПАСТЕЛЬНЫЕ И НЕОБЫЧНЫЕ ---
    { id: '47', name: 'Персиковый (Peach)', hex: '#FFDAB9' },
    { id: '48', name: 'Хаки (Khaki)', hex: '#F0E68C' },
    { id: '49', name: 'Винный (Wine)', hex: '#722F37' },
    { id: '50', name: 'Охра (Ochre)', hex: '#CC7722' },
    { id: '51', name: 'Медный (Copper)', hex: '#B87333' },
    { id: '52', name: 'Ультрамарин (Ultramarine)', hex: '#120A8F' },
  ]);

  colorSelect = output<SystemColor>();
  colorAdded = output<SystemColor>();
  removeColor = output<SystemColor>();
  colorChanged = output<{ oldId: string; newColor: SystemColor }>();

  // Локальное состояние комбобокса
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
