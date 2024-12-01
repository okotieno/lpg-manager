import { Test, TestingModule } from '@nestjs/testing';
import { KeyvRedisModule } from './app-cache.module';

jest.mock('keyv', () => ({
  default: class keyv {},
}));

jest.mock('@keyv/redis', () => ({
  default: class keyvRedis {},
}));

describe('KeyvRedisModule', () => {
  let module: TestingModule;

  const mockRedisHost = 'mock-host';
  const mockRedisPort = '1234';
  const mockRedisPassword = 'mock-password';

  beforeEach(async () => {
    process.env['LPG_REDIS_HOST'] = mockRedisHost;
    process.env['LPG_REDIS_PORT'] = mockRedisPort;
    process.env['LPG_REDIS_PASSWORD'] = mockRedisPassword;

    // Build the test module
    module = await Test.createTestingModule({
      imports: [KeyvRedisModule],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    expect(module).toBeDefined();
  });
});
