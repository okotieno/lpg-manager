import { Injectable, NotFoundException } from '@nestjs/common';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { OtpModel } from '@lpg-manager/db';
import { InjectModel } from '@nestjs/sequelize';

export enum OtpUsageEnum {
  PasswordReset = 'password-reset',
  confirmTransaction = 'confirm-transaction'
}

@Injectable()
export class OtpBackendService extends CrudAbstractService<OtpModel> {
  constructor(@InjectModel(OtpModel) private otpModel: typeof OtpModel) {
    super(otpModel);
  }
  async generate({
      identifier,
      usage = 'confirm-transaction',
      digits = 4,
      validity = 10
    }: { identifier: string, usage: string, digits: number, validity: number }
  ) {
    await this.repository.destroy({ where: { identifier, valid: true, usage} });

    const token = this.generatePin(digits);

    return this.repository.create({ valid: true, identifier, token, validity, usage });
  }

  async validate(identifier: string, token: string, usage: OtpUsageEnum = OtpUsageEnum.confirmTransaction): Promise<{
    status: boolean;
    message: string;
  }> {
    const otp = await this.repository.findOne({
      where: { identifier, token, usage },
      order: [['createdAt', 'DESC']]
    });

    if (!otp) {
      throw new NotFoundException('OTP does not exist');
    }

    if (otp.valid) {
      const now = new Date();
      const validity = new Date(new Date(otp.createdAt).getTime() + Number(otp.validity) * 60000); // Convert validity to milliseconds

      if (validity < now) {
        otp.valid = false;
        await otp.save();

        return { status: false, message: 'OTP Expired' };
      } else {
        otp.valid = false;
        await otp.save();

        return { status: true, message: 'OTP is valid' };
      }
    } else {
      return { status: false, message: 'OTP is not valid' };
    }
  }

  private generatePin(digits = 4): string {
    if (process.env['LPG_MAIL_HOST'] === 'sandbox.smtp.mailtrap.io') {
      return '123456';
    }
    let pin = '';
    for (let i = 0; i < digits; i++) {
      pin += Math.floor(Math.random() * 10).toString();
    }
    return pin;
  }
}

