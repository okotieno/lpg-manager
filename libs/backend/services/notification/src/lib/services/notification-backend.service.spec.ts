import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import {
  NotificationModel,
  NotificationUserModel,
  QueryOperatorEnum,
  SortByDirectionEnum,
} from '@lpg-manager/db';
import { Op } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';

const modelRepositoryMock = {
  findAndCountAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  bulkCreate: jest.fn(),
};

const sendNotificationQueueMock = {};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken(NotificationModel),
          useValue: modelRepositoryMock,
        },
        {
          provide: getModelToken(NotificationUserModel),
          useValue: modelRepositoryMock,
        },
        {
          provide: 'BullQueue_send-notification-queue',
          useValue: sendNotificationQueueMock,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(
      NotificationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAndCountAll with correct parameters', async () => {
      modelRepositoryMock.findAndCountAll.mockReturnValue({
        rows: [],
        count: 0,
      });
      const query = {
        currentPage: 2,
        pageSize: 20,
        sortBy: 'id',
        sortByDirection: SortByDirectionEnum.DESC,
        filters: [
          {
            operator: QueryOperatorEnum.Contains,
            field: 'lastName',
            value: 'a',
            values: [],
          },
          {
            operator: QueryOperatorEnum.Equals,
            field: 'id',
            value: '1',
            values: [],
          },
        ],
      };
      await service.findAll(query);
      expect(modelRepositoryMock.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 20,
          order: [['id', 'DESC']],
          where: {
            id: '1',
            lastName: { [Op.iLike]: '%a%' },
          },
        }),
      );
    });
  });

  describe('findById', () => {
    it('should call findOne with correct ID', async () => {
      await service.findById('1');
      expect(modelRepositoryMock.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
    });

    it('should return null if ID is not provided', async () => {
      const result = await service.findById(undefined);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      modelRepositoryMock.create.mockReturnValue({
        save: jest.fn(),
      });
      const params = { name: 'Test' };
      await service.create(params);
      expect(modelRepositoryMock.create).toHaveBeenCalledWith(params, {});
    });
  });

  describe('update', () => {
    it('should call findOne and update with correct parameters', async () => {
      modelRepositoryMock.findOne.mockReturnValue({
        update: modelRepositoryMock.update,
      });
      const params = { name: 'Updated Test' };
      await service.update({ params, id: '1' });
      expect(modelRepositoryMock.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
      expect(modelRepositoryMock.update).toHaveBeenCalledWith(params);
    });
  });

  describe('deleteById', () => {
    it('should call destroy with correct ID', async () => {
      await service.deleteById('1');
      expect(modelRepositoryMock.destroy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
        }),
      );
    });

    it('should return message if ID is not provided', async () => {
      const result = await service.deleteById(undefined);
      expect(result).toEqual({ message: 'No id provided' });
    });
  });

  describe('bulkCreate', () => {
    it('should call bulkCreate with correct parameters', async () => {
      const params = [{ name: 'Item 1' }, { name: 'Item 2' }];
      await service.bulkCreate(params);
      expect(modelRepositoryMock.bulkCreate).toHaveBeenCalledWith(params);
    });
  });
});
