import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";

@Component({
    selector: 'app-about-icon',
    imports: [CommonModule],
    templateUrl: './about-icon.html',
    styleUrl: './about-icon.scss',
})
export class AboutIcon {
    @Input() size: number = 24;
    @Input() color: string = '#353535';

    @HostBinding('style.--icon-size')
    get iconSize(): string {
        return `${this.size}px`;
    }

    @HostBinding('style.--icon-color')
    get iconColor(): string {
        return this.color;
    }
}