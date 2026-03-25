import { Component, input, output } from '@angular/core';
import { bootstrapGripVertical, bootstrapTrash } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-image-tile',
  imports: [NgIcon],
  templateUrl: './image-tile.html',
  styleUrl: './image-tile.scss',
  providers: [provideIcons({ bootstrapGripVertical, bootstrapTrash })],
})

export class ImageTile {
  src = input.required<string>();
  index = input.required<number>();

  remove = output<number>();

  onRemove() {
    this.remove.emit(this.index());
  }
}
