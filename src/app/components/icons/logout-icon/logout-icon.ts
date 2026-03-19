import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input } from "@angular/core";

@Component({
    selector: 'app-logout-icon',
    imports: [CommonModule],
    templateUrl: './logout-icon.html',
    styleUrl: './logout-icon.scss',
})
export class logoutIcon {
    @Input() size: number = 24;
    @Input() color: string = '#EB5757';

    @HostBinding('style.--icon-size')
    get iconSize(): string {
        return `${this.size}px`;
    }

    @HostBinding('style.--icon-color')
    get iconColor(): string {
        return this.color;
    }
}