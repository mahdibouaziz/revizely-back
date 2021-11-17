import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UsersService,
    private jwtService: JwtService,
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
      if (error.code == 11000) {
        throw new ConflictException('Username already exists');
      }
      throw new HttpException(error._message, 400);
    }
  }

  //login

  async login(loginUserDto: LoginUserDto) {
    const username = await this.validateUserPassword(loginUserDto);
    if (username) {
      const payload = { username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Invalid Credentials');
  }
}
