import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://scrum:scrum123@cluster0.sr2ks.mongodb.net/revizely?retryWrites=true&w=majority',
    ),
    UsersModule,
    AuthModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
