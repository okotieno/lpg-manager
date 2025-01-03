import { TestBed } from '@angular/core/testing';
import { FormExitGuardService } from './form-exit-guard.service';
import { AlertController } from '@ionic/angular';

describe('FormExitGuardService', () => {
  let service: FormExitGuardService;
  let alertController: AlertController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormExitGuardService, AlertController],
    });

    service = TestBed.inject(FormExitGuardService);
    alertController = TestBed.inject(AlertController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('presentAlert', () => {
    it('should create and present an alert', async () => {
      const alertSpy = jest.spyOn(alertController, 'create').mockResolvedValue({
        present: jest.fn(),
      } as any);

      await service.presentAlert();

      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('hasUnsavedChanges', () => {
    it('should return true if component has no unsaved changes', async () => {
      const component = { hasUnsavedChanges: false };

      const result = await service.hasUnsavedChanges(component);

      expect(result).toBeTruthy();
    });

    it('should return true if user confirms unsaved changes', async () => {
      const component = { hasUnsavedChanges: true };

      const alertSpy = jest.spyOn(alertController, 'create').mockResolvedValue({
        present: jest.fn(),
        onWillDismiss: () => Promise.resolve({ role: 'destructive' }),
      } as any);

      const result = await service.hasUnsavedChanges(component);

      expect(alertSpy).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return false if user cancels unsaved changes', async () => {
      const component = { hasUnsavedChanges: true };

      const alertSpy = jest.spyOn(alertController, 'create').mockResolvedValue({
        present: jest.fn(),
        onWillDismiss: () => Promise.resolve({ role: 'cancel' }),
      } as any);

      const result = await service.hasUnsavedChanges(component);

      expect(alertSpy).toHaveBeenCalled();
      expect(result).toBeFalsy();
    });
  });
});
