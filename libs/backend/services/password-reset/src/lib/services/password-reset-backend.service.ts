import { Injectable } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { PasswordResetModel, UserModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';

@Injectable()
export class PasswordResetBackendService extends CrudAbstractService<PasswordResetModel> {
  constructor(
    @InjectModel(PasswordResetModel)
    private passwordResetModel: typeof PasswordResetModel,
    @InjectModel(UserModel)
    private userModel: typeof UserModel
  ) {
    super(passwordResetModel);
  }

  // Generate password reset token and save it to the password_resets table
  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const token = randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

    // Store the reset token in password_resets table
    await this.passwordResetModel.create({
      userId: user.id,
      token,
      expiresAt: expiry
    });

    return token;
  }

  async validateToken(token: string): Promise<{ user: UserModel | null, passwordReset: PasswordResetModel | null }> {
    const passwordReset = await this.passwordResetModel.findOne({
      where: { token }
    });
    if (!passwordReset || (passwordReset?.expiresAt as Date) < new Date()) {
      return { user: null, passwordReset: null  };
    }

    const user = await this.userModel.findOne({ where: { id: passwordReset.userId } });
    return { passwordReset, user };
  }

  // Validate the token and reset password
  async resetPassword(token: string, newPassword: string): Promise<UserModel> {
    const { user, passwordReset } = await this.validateToken(token);
    if(!passwordReset) {
      throw new Error('Invalid or expired token');
    }
    if (!user) {
      throw new Error('User not found');
    }
    user.password = await hash(newPassword, 10);
    await user.save();

    // Remove the used or expired token
    await passwordReset.destroy();

    return user
  }
}
