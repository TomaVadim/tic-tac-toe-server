import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: false, default: '' })
  first_name: string;

  @Prop({ required: false, default: '' })
  last_name?: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: false, default: '' })
  language_code?: string;

  @Prop({ required: false, default: false })
  allows_write_to_pm?: boolean;

  @Prop({ required: false, default: '' })
  photo_url?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
