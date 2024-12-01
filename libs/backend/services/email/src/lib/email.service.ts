import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService
  ) {
  }

  async send({ from, ...mailOptions }: ISendMailOptions): Promise<void> {
    await this.mailerService.sendMail({
      from,
      ...mailOptions,
    })
  }
}
