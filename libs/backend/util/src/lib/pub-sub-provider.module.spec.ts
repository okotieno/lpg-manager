import { Test, TestingModule } from '@nestjs/testing';
import { PubSubProviderModule } from './pub-sub-provider.module';

jest.mock('graphql-redis-subscriptions', () => ({
  RedisPubSub: class RedisPubSub {},
}));

describe('PubSubProviderModule', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PubSubProviderModule],
    }).compile();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
