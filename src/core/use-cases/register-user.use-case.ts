import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }) {
    const user = new User(Date.now().toString(), input.username, input.password, input.role);
    return this.userRepository.create(user);
  }
}
