import { Test, TestingModule } from '@nestjs/testing';
import { AppQueueModule } from './app-queue.module';

describe('AppQueueModule', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppQueueModule],
    }).compile();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
