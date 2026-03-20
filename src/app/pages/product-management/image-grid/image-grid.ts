import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ImageTile } from './image-tile/image-tile';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-image-grid',
  imports: [CommonModule, ImageTile, CdkDropList, CdkDrag],
  templateUrl: './image-grid.html',
  styleUrl: './image-grid.scss',
})
export class ImageGrid {
  images = input.required<string[]>();

  onRemove = output<number>();
  onAdd = output<{file: File, previewUrl: string}>();
  onOrderChange = output<string[]>();

  removeImage(index: number) {
    this.onRemove.emit(index);
  }

  drop(event: CdkDragDrop<string[]>) {
    const newArray = [...this.images()];
    moveItemInArray(newArray, event.previousIndex, event.currentIndex);
    this.onOrderChange.emit(newArray);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        this.onAdd.emit({file, previewUrl});
        input.value = '';
      };
      reader.readAsDataURL(file);
    }
  }
}
