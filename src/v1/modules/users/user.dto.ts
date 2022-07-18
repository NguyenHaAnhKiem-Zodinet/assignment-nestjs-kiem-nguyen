export class RegisterDto {
  name: string;
  username: string;
  email: string;
  password: string;
  birthday: Date;
}

export class DeleteUserDto {
  id: number;
}

export class LoginDto {
  email: string;
  password: string;
}
