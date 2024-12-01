import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetBackendService } from '@lpg-manager/password-reset-backend-service';
import { CreatePasswordResetInputDto } from '../dto/create-password-reset-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResetCreatedEvent } from '../events/password-reset-created.event';
import { I18nService } from 'nestjs-i18n';
import { PasswordResetResolver } from './password-reset.resolver';

const passwordResetServiceMock = {
  create: jest.fn(),
}

describe('PasswordResetResolver', () => {
  let resolver: PasswordResetResolver;
  let passwordResetService: PasswordResetBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: PasswordResetBackendService,
          useValue: passwordResetServiceMock
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PasswordResetResolver>(PasswordResetResolver);
    passwordResetService = module.get<PasswordResetBackendService>(
      PasswordResetBackendService
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPasswordReset', () => {
    it('should create a password-reset and emit event', async () => {
      const createPasswordResetInput: CreatePasswordResetInputDto = {
        name: 'john',
      } as CreatePasswordResetInputDto;
      const createdPasswordReset = {
        id: 1,
        name: 'john',
      };
      passwordResetServiceMock.create.mockResolvedValueOnce(createdPasswordReset);

      const result = await resolver.createPasswordReset(
        createPasswordResetInput
      );

      expect(result).toEqual({
        message: 'Successfully created password-reset',
        data: createdPasswordReset,
      });
      expect(passwordResetService.create).toHaveBeenCalledWith(
        createPasswordResetInput
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'password-reset.created',
        expect.any(PasswordResetCreatedEvent)
      );
    });
  });
});
