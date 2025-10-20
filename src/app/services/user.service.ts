import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  level: string;
  joinDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  setUser(name: string): void {
    const user: User = {
      name,
      level: 'Sơ cấp',
      joinDate: new Date(),
    };
    localStorage.setItem('chinese-learning-user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('chinese-learning-user');
    return stored ? JSON.parse(stored) : null;
  }

  clearUser(): void {
    localStorage.removeItem('chinese-learning-user');
    this.userSubject.next(null);
  }
}
