import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true, unique: true, autoIncrement: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  numberOfHours: number;

  @Prop()
  instructorId: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
