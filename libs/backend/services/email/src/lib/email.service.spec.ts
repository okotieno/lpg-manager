import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';

// Mocked email transporter
const mailerServiceMock = {
  sendMail: jest.fn().mockResolvedValue({} as Record<string, string>) // Mocking the sendMail method
};

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mailerServiceMock
        }
      ]
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send welcome email', async () => {
    const email = 'recipient@example.com';
    await service.send({
      to: email,
      from: 'test@example.com',
      subject: 'Welcome to LPG Manager!',
      text: 'You have successfully created an account with LPG Manager'
    });

    // Check if the sendMail method was called with the correct parameters
    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: email,
      subject: 'Welcome to LPG Manager!',
      text: 'You have successfully created an account with LPG Manager'
    });
  });
});
