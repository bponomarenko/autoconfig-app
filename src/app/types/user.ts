export interface UserFormData {
  user: User;
  save?: boolean;
}

export class User {
  email: string;
  password: string;

  constructor(user?: any) {
    if(user) {
      this.email = user.email;
      this.password = user.password;
    }
  }

  hasAllData(): boolean {
    return !!(this.email && this.password);
  }

  hasSomeData(): boolean {
    return !!(this.email || this.password);
  }

  isEqualTo(user: User): boolean {
    return user && this.email === user.email && this.password === user.password;
  }
}
