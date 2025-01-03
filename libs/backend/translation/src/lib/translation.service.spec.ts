import { TranslationService } from './translation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';

const i18nServiceMock = {
  t: jest.fn(),
};

describe('Translation Service', () => {
  let service: TranslationService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TranslationService,
        {
          provide: I18nService,
          useValue: i18nServiceMock
        }]
    }).compile();

    service = module.get<TranslationService>(TranslationService);
  });

  it('should be created', () => {
    i18nServiceMock.t.mockReturnValue('translated string');
    expect(service.getTranslation('test')).toBe('translated string');
  });
});
