import { Test, TestingModule } from '@nestjs/testing';
import { CartResolver } from './cart.resolver';
import { RoleService } from '@lpg-manager/role-service';
import { CreateCartInputDto } from '../dto/create-cart-input.dto';
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
  let resolver: CartResolver;
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartResolver,
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

    resolver = module.get<CartResolver>(CartResolver);
    roleService = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const createRoleInput: CreateCartInputDto = { name: 'New Role' };
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
