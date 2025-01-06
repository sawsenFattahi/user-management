import { Schema } from 'mongoose';

import type { ROLE } from '@lesechos/common/enums/role.enum';
import type { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email?: string;
  password: string;
  name?: string;
  role: typeof ROLE;
  address?: Record<string, any>;
  comment?: string;
}

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, required: true },
  address: { type: Object },
  comment: { type: String },
});
