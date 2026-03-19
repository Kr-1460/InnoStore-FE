import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";

@Component({
    selector: 'app-profile-icon',
    imports: [CommonModule],
    templateUrl: './profile-icon.html',
    styleUrl: './profile-icon.scss',
})
export class ProfileIcon {
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