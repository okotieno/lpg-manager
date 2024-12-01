import { Test, TestingModule } from '@nestjs/testing';
import { SettingBackendService } from '@lpg-manager/setting-backend-service';
import { CreateSettingInputDto } from '../dto/create-setting-input.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingCreatedEvent } from '../events/setting-created.event';
import { I18nService } from 'nestjs-i18n';
import { SettingResolver } from './setting.resolver';

const SettingBackendServiceMock = {
  create: jest.fn(),
};

describe('SettingResolver', () => {
  let resolver: SettingResolver;
  let settingService: SettingBackendService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingResolver,
        {
          provide: I18nService,
          useValue: {},
        },
        {
          provide: SettingBackendService,
          useValue: SettingBackendServiceMock,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SettingResolver>(SettingResolver);
    settingService = module.get<SettingBackendService>(SettingBackendService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSetting', () => {
    it('should create a setting and emit event', async () => {
      const createSettingInput: CreateSettingInputDto = {
        name: 'john',
      } as CreateSettingInputDto;
      const createdSetting = { id: 1, name: 'john' };
      SettingBackendServiceMock.create.mockResolvedValueOnce(createdSetting);

      const result = await resolver.createSetting(createSettingInput);

      expect(result).toEqual({
        message: 'Successfully created setting',
        data: createdSetting,
      });
      expect(settingService.create).toHaveBeenCalledWith(createSettingInput);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'setting.created',
        expect.any(SettingCreatedEvent),
      );
    });
  });
});
