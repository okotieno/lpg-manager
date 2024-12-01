import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogBackendService } from '@lpg-manager/activity-log-backend-service';
import { CreateActivityLogInputDto } from '../dto/create-activity-log-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityLogCreatedEvent } from '../events/activity-log-created.event';
import { I18nService } from 'nestjs-i18n';
import { ActivityLogResolver } from './activity-log.resolver';

const ActivityLogBackendServiceMock = {
  create: jest.fn(),
};

describe('ActivityLogResolver', () => {
  let resolver: ActivityLogResolver;
  let activityLogService: ActivityLogBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: ActivityLogBackendService,
          useValue: ActivityLogBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ActivityLogResolver>(ActivityLogResolver);
    activityLogService = module.get<ActivityLogBackendService>(
      ActivityLogBackendService,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createActivityLog', () => {
    it('should create a activity-log and emit event', async () => {
      const createActivityLogInput: CreateActivityLogInputDto = {
        name: 'john',
      } as CreateActivityLogInputDto;
      const createdActivityLog = { id: 1, name: 'john' };
      ActivityLogBackendServiceMock.create.mockResolvedValueOnce(
        createdActivityLog,
      );

      const result = await resolver.createActivityLog(createActivityLogInput);

      expect(result).toEqual({
        message: 'Successfully created activity-log',
        data: createdActivityLog,
      });
      expect(activityLogService.create).toHaveBeenCalledWith(
        createActivityLogInput,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'activity-log.created',
        expect.any(ActivityLogCreatedEvent),
      );
    });
  });
});
