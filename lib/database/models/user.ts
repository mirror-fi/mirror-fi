import { Schema, model, models } from 'mongoose';

export interface IUser {
  publicAddress: string;
  likes: string[]; // Array of strategy IDs
}

const UserSchema = new Schema<IUser>({
  publicAddress: { type: String, required: true, unique: true },
  likes: { type: [String], required: true, default: [] },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
