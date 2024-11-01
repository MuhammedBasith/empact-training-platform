// user.service.ts

import User, { IUser } from '../models/user.model';

export const createUserIfNotExist = async (cognitoId: string, email: string, role: string) => {
  const existingUser = await User.findOne({ cognitoId });
  if (!existingUser) {
    const newUser = new User({ cognitoId, email, role });
    await newUser.save();
  }
};
