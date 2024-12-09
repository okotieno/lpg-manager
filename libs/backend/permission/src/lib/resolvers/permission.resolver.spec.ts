import { Test, TestingModule } from '@nestjs/testing';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from '@lpg-manager/permission-service';
import { CreatePermissionInputDto } from '../dto/create-permission-input.dto';
import { PermissionModel } from '@lpg-manager/db';
import { I18nService } from 'nestjs-i18n';

describe('PermissionResolver', () => {
  let resolver: PermissionResolver;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionResolver,
        {
          provide: I18nService,
          useValue: {}
        },
        {
          provide: PermissionService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PermissionResolver>(PermissionResolver);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createPermission', () => {
    it('should create a permission', async () => {
      const createPermissionInput: CreatePermissionInputDto = { name: 'New Permission' };
      const createdPermission = { name: 'New Permission', id: 1 };
      jest.spyOn(permissionService, 'create').mockResolvedValueOnce(createdPermission as PermissionModel);

      const result = await resolver.createPermission(createPermissionInput);

      expect(result).toEqual({
        message: 'Successfully created permission',
        data: createdPermission,
      });
      expect(permissionService.create).toHaveBeenCalledWith(createPermissionInput);
    });
  });
});
