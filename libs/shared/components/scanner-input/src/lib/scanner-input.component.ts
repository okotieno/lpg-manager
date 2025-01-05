import { ScannerService } from './scanner.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef, inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { takeUntil, tap } from 'rxjs/operators';
import { IonButton, IonButtons, IonItem } from '@ionic/angular/standalone';

export interface IQRInfo {
  code: string;
  id: number;
  size: number;
  ['RFID']: string;
  brand: string
}

@Component({
  selector: 'lpg-scanner-input',
  imports: [IonItem, IonButtons, IonButton],
  templateUrl: './scanner-input.component.html',
  styleUrl: './scanner-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScannerInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ScannerInputComponent),
      multi: true,
    },
  ],
})
export class ScannerInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  protected cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);
  private scannerService = inject(ScannerService);
  private toastController = inject(ToastController);
  @Output() scanning = new EventEmitter<any>();
  @Input() order: any = {
    acceptedAt: '',
    assignedAt: '',
    canisterSizeName: '',
    createdAt: '',
    dealerToTransporter: false,
    depotToTransporter: false,
    fromDepotId: 0,
    isAccepted: false,
    isAssigned: false,
    orderId: 0,
    orderQuantities: [],
    toDealerId: 0,
    transporterToDealer: false,
    transporterToDepot: false,
  };
  fb = inject(FormBuilder);
  form = this.fb.group({
    canisters: this.fb.array([] as any[]),
  });
  isDisabled = false;
  sub?: Subscription | null = null;
  scanning$ = new BehaviorSubject(false);
  dispatchCylinders$ = new BehaviorSubject<IQRInfo[]>([]);
  isSupported = false;
  barcodes: Barcode[] = [];
  scanned$ = this.scannerService.scanned$;
  scannedItems: any;
  destroyed$ = new Subject<any>();

  get canistersControl() {
    return this.form.get('canisters') as FormArray<any>;
    // FormGroup<{
    //   tagged: FormControl<boolean>;
    //   canisterId: FormControl<number>;
    //   inGoodCondition: FormControl<boolean>;
    //   canisterConditionDescription: FormControl<`b`>;
    // }>
  }

  onChanges: (val: any) => void = () => {
    //
  };
  onTouched: () => void = () => {
    //
  };

  registerOnChange(fn: any): void {
    this.onChanges = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    //
  }

  ngOnInit(): void {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.configureGoogleScannerModule();
    this.scanned$
      .pipe(
        takeUntil(this.destroyed$),
        tap((res) => {
          this.scannedItems = res;
        })
      )
      .subscribe();
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  validate() {
    return null;
  }

  isAlreadyScanned(id: any) {
    return !!this.canistersControl.value.find(
      ({ canisterId }: any) => canisterId === id
    );
  }

  // hideCamera() {
  //   (window.document.querySelector('ion-app') as HTMLElement).classList.remove('camera-view');
  //   this.qrScanner.hide()
  //     .then((success) => {
  //       console.log({success});
  //       console.log('scanner closed', this.scanning$.value);
  //       this.scanning.emit(this.scanning$.value);
  //     })
  //     .catch(({error}) => {
  //       console.log({error});
  //       this.scanning.emit(this.scanning$.value);
  //     });
  // }

  // scan() {
  //   this.hideCamera();
  //   this.qrScanner.prepare().then((status: QRScannerStatus) => {
  //     if (status.authorized) {
  //       this.scanning$.next(true);
  //       this.scanning.emit(this.scanning$.value);
  //       this.qrScanner.show();
  //       (window.document.querySelector('ion-app') as HTMLElement).classList.add('camera-view');
  //       this.cdr.detectChanges();
  //       this.sub = this.qrScanner.scan().subscribe((info) => {
  //         const data = JSON.parse(info) as IQRInfo;

  //         if (this.isAlreadyScanned(data.id)) {
  //           alert('Already scanned!');
  //           this.sub.unsubscribe();
  //           this.scan();
  //         } else {
  //           this.scanning$.next(false);
  //           this.dispatchCylinders$.next([...this.dispatchCylinders$.value, data]);
  //           this.canistersControl.push(this.fb.group({
  //             tagged: [true],
  //             inGoodCondition: [true],
  //             canisterConditionDescription: [null],
  //             canisterId: [data.id]
  //           }));
  //           this.onChanges(this.canistersControl.value);
  //           this.hideCamera();
  //           this.cdr.detectChanges();
  //           this.sub.unsubscribe();
  //         }

  //       });
  //     } else if (status.denied) {
  //       alert('Please grant access to Camera');
  //       // camera permission was permanently denied
  //       // you must use QRScanner.openSettings() method to guide the user to the settings page
  //       // then they can grant the permission from there
  //       this.qrScanner.openSettings();
  //     } else {
  //       // permission was denied, but not permanently. You can ask for permission again at a later time.
  //       this.qrScanner.openSettings();
  //     }
  //   });
  // }

  // closeScanner() {
  //   if (this.sub) {
  //     this.sub.unsubscribe();
  //   }
  //   this.hideCamera();
  //   this.scanning$.next(false);
  //   this.scanning.emit(this.scanning$.value);
  //   this.cdr.detectChanges();
  // }
  async pickImage() {
    const { files } = await FilePicker.pickImages({
      multiple: true,
    } as any);
    return files[0];
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
    });
    const rawValue: any = JSON.parse(barcodes[0].rawValue);
    if (!this.isAlreadyScanned(rawValue.id)) {
      this.scannerService.scanned$ = rawValue;
      this.canistersControl.push(
        this.fb.group({
          tagged: [true],
          inGoodCondition: [true],
          canisterConditionDescription: [null],
          canisterId: [rawValue.id],
        })
      );
      this.onChanges(this.canistersControl.value);
      this.cdr.detectChanges();
    } else {
      this.presentToast('bottom', 'Cylinder already scanned');
    }
  }

  async readFromImage() {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const pickedImage = await this.pickImage();
    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      formats: [BarcodeFormat.QrCode],
      path: pickedImage.path as string,
    });
    const rawValue: any = JSON.parse(barcodes[0].rawValue);
    console.log(rawValue);
    if (!this.isAlreadyScanned(rawValue.id)) {
      this.scannerService.scanned$ = rawValue;
      this.canistersControl.push(
        this.fb.group({
          tagged: [true],
          inGoodCondition: [true],
          canisterConditionDescription: [null],
          canisterId: [rawValue.id],
        })
      );
      this.onChanges(this.canistersControl.value);
      this.cdr.detectChanges();
    } else {
      this.presentToast('bottom', 'Cylinder already scanned');
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async configureGoogleScannerModule() {
    const scannerModule =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    if (!scannerModule.available) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    }
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async clearScannedItems() {
    const alert = await this.alertController.create({
      header: 'Confirm clear',
      message: 'Are you sure you want to clear the scanned items?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.clear();
          },
        },
      ],
    });
    await alert.present();
  }

  clear() {
    this.scannerService.clear();
    this.canistersControl.clear();
    this.onChanges(this.canistersControl.value);
    this.cdr.detectChanges();
  }
  async presentToast(position: 'top' | 'middle' | 'bottom', message: any) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position,
    });
    await toast.present();
  }
  ngOnDestroy(): void {
    this.destroyed$.next(null);
    this.clear();
  }

  ionViewDidLeave() {
    this.clear();
    this.destroyed$.next(null);
  }
}
