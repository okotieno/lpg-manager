import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { UserModel } from '@lpg-manager/db';
import { UserService } from '@lpg-manager/user-service';
import { JwtService } from '@nestjs/jwt';

jest.mock('googleapis', () => {
  class OAuth2 {
    verifyIdToken = () => ({
      getPayload: () => ({ email: 'test@xample.com' }),
    });
  }

  return {
    google: {
      auth: {
        OAuth2,
      },
    },
  };
});

// Mock the UserService and JwtService
const mockUserService = {
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'JWT_SECRET', useValue: '1234' },
        {
          provide: 'KEYV_REDIS',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signInGoogleUser', () => {
    it('should return user when email is found', async () => {
      const fakeUser: Partial<UserModel> = {
        id: '1',
        email: 'test@example.com',
      };
      mockUserService.findByEmail.mockResolvedValueOnce(fakeUser);
      const result = await service.signInGoogleUser('fakeToken');
      expect(result).toEqual(fakeUser);
    });

    it('should throw BadRequestException when no user found with given email', async () => {
      mockUserService.findByEmail.mockResolvedValueOnce(null);
      await expect(service.signInGoogleUser('fakeToken')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return null when payload or email is missing', async () => {
      jest.mock('googleapis', () => {
        class OAuth2 {
          verifyIdToken = () => ({
            getPayload: () => ({}),
          });
        }

        return {
          google: {
            auth: {
              OAuth2,
            },
          },
        };
      });

      await expect(service.signInGoogleUser('fakeToken')).rejects.toThrow(
        'No user found with email test@xample.com',
      );
    });
  });

  describe('login', () => {
    it('should return user with access and refresh tokens', async () => {
      const fakeUser: Partial<UserModel> = {
        id: '1',
        email: 'test@example.com',
      };
      const fakeAccessToken = 'fakeAccessToken';
      const fakeRefreshToken = 'fakeRefreshToken';
      mockJwtService.sign.mockReturnValueOnce(fakeAccessToken);
      mockJwtService.sign.mockReturnValueOnce(fakeRefreshToken);
      const result = await service.login(fakeUser as UserModel);
      expect(result?.user).toEqual(fakeUser);
      expect(result?.accessToken).toEqual(fakeAccessToken);
      expect(result?.refreshToken).toEqual(fakeRefreshToken);
    });

    it('should return undefined when user is null', async () => {
      const result = await service.login(null);
      expect(result).toBeUndefined();
    });
  });
});
