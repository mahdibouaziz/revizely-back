import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UsersService,
    // private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  //hashPassword
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  //ValidateUserPassword
  private async validateUserPassword(
    loginUserDto: LoginUserDto,
  ): Promise<string> {
    const { username, password } = loginUserDto;
    const user = await this.userModel.findOne({ username });

    try {
      const hashedPassword = await this.hashPassword(password, user.salt);
      if (user && hashedPassword === user.password) {
        return username;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //register
  async register(registerUserDto: RegisterUserDto): Promise<any> {
    //Check for duplicate users
    try {
      //create a salt for every user and hash the password
      const salt = await bcrypt.genSalt();
      const password = await this.hashPassword(registerUserDto.password, salt);

      await this.userModel.create({ ...registerUserDto, salt, password });
      return { message: 'user has been created' };
    } catch (error) {
      throw new ConflictException('Username already exists');
    }
  }

  //login

  //   async validateUser(username: string, pass: string): Promise<any> {
  //     const user: User = await this.userService.findOne(username);
  //     if (user && user.password === pass) {
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       const { password, ...result } = user;
  //       return result;
  //     }
  //     return null;
  //   }

  //   async login(user: any) {
  //     const payload = { username: user.username, sub: user.userId };
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }
}
