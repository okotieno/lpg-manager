import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlModule } from './graphql.module';

jest.mock('nestjs-i18n', () => {
  class HeaderResolverMock {
    resolve = jest.fn();
  }
  class ForRoot {}
  return {
    I18nModule: class I18nModuleMock {
      static forRoot() {
        return ForRoot;
      }
    },
    HeaderResolver: HeaderResolverMock,
  };
});


describe('GraphqlModule', () => {
  let app: TestingModule;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [GraphqlModule],
    }).compile();
  });
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
