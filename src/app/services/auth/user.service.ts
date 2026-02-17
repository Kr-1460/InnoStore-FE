import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export enum UserRole {
  Editor = 'Editor'
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private permissionsSubject$$: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);
  private currentUserEmail: string = "";
  constructor() { }

  public get getPermissions() {
    return this.permissionsSubject$$.value;
  }

  public getCurrentUserEmail(): string {
    return this.currentUserEmail;
  }

  public setCurrentUserEmail(email: string) {
    this.currentUserEmail = email;
  }

  public emitPermissionsChanged(permissions: string[]) {
    this.permissionsSubject$$.next(permissions)
  }

  public getPermissionsObservable$(): Observable<string[] | null> {
    return this.permissionsSubject$$.asObservable();
  }

  public hasEditorPermission(): boolean {
    return this.permissionsSubject$$.value?.includes(UserRole.Editor) ?? false
  }
}