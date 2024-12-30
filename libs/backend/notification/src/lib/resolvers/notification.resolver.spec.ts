import { Test, TestingModule } from '@nestjs/testing';
import { CreateNotificationInputDto } from '../dto/create-notification-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from '../events/notification-created.event';
import { I18nService } from 'nestjs-i18n';
import { NotificationResolver } from './notification.resolver';
import { PUB_SUB } from '@lpg-manager/util';
import { NotificationService } from '@lpg-manager/notification-service';

const NotificationBackendServiceMock = {
  create: jest.fn(),
};

class pubSubMock {}

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;
  let notificationService: NotificationService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: NotificationService,
          useValue: NotificationBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: PUB_SUB,
          useValue: pubSubMock,
        },
      ],
    }).compile();

    resolver = module.get<NotificationResolver>(NotificationResolver);
    notificationService = module.get<NotificationService>(
      NotificationService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create a notification and emit event', async () => {
      const createNotificationInput: CreateNotificationInputDto = {
        description: 'john',
      } as CreateNotificationInputDto;
      const createdNotification = { id: 1, name: 'john' };
      NotificationBackendServiceMock.create.mockResolvedValueOnce(
        createdNotification,
      );

      const result = await resolver.createNotification(createNotificationInput);

      expect(result).toEqual({
        message: 'Successfully created notification',
        data: createdNotification,
      });
      expect(notificationService.create).toHaveBeenCalledWith(
        createNotificationInput,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'notification.created',
        expect.any(NotificationCreatedEvent),
      );
    });
  });
});
