import { Test, TestingModule } from '@nestjs/testing';
import { AppEventModule } from './app-event.module';

describe('AppEventModule', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppEventModule],
    }).compile();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
