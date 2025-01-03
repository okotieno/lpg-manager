import { Test, TestingModule } from '@nestjs/testing';
import { StationResolver } from './station.resolver';
import { RoleService } from '@lpg-manager/role-service';
import { CreateStationInputDto } from '../dto/create-station-input.dto';
import { RoleModel } from '@lpg-manager/db';
import { I18nService } from 'nestjs-i18n';

import { getModelToken } from '@nestjs/sequelize';

const modelRepositoryMock = {
  findAndCountAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  bulkCreate: jest.fn(),
};

describe('RoleResolver', () => {
  let resolver: StationResolver;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StationResolver,
        {
          provide: getModelToken(RoleModel),
          useValue: modelRepositoryMock
        },
        {
          provide: I18nService,
          useValue: {}
        },
        {
          provide: RoleService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StationResolver>(StationResolver);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const createRoleInput: CreateStationInputDto = { name: 'New Role' };
      const createdRole = { name: 'New Role', id: 1 };
      jest.spyOn(roleService, 'create').mockResolvedValueOnce(createdRole as RoleModel);

      const result = await resolver.createRole(createRoleInput);

      expect(result).toEqual({
        message: 'Successfully created role',
        data: createdRole,
      });
      expect(roleService.create).toHaveBeenCalledWith(createRoleInput);
    });
  });
});
