export class User {
  email: string;
  password: string;

  constructor(baseUser?: User) {
    if(baseUser) {
      this.email = baseUser.email;
      this.password = baseUser.password;
    }
  }

  hasAllData(): boolean {
    return !!this.email && !!this.password;
  }

  isEqualTo(user: User): boolean {
    return user && this.email === user.email && this.password === user.password;
  }
}
