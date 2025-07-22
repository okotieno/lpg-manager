import { Module } from '@nestjs/common';
import { GraphqlModule } from '@lpg-manager/graphql';
import { AuthModule } from '@lpg-manager/auth';
import { ConfigModule } from '@nestjs/config';
import { TranslationModule } from '@lpg-manager/translation';
import { DbModule } from '@lpg-manager/db';
import { AppQueueModule } from '@lpg-manager/app-queue';
import { KeyvRedisModule } from '@lpg-manager/app-cache';
import { AppEventModule } from '@lpg-manager/app-event';
import { UserModule } from '@lpg-manager/user';
import { RoleModule } from '@lpg-manager/role';
import { PermissionModule } from '@lpg-manager/permission';
import { BrandModule } from '@lpg-manager/brand';
import { FileUploadModule } from '@lpg-manager/file-upload';
import { StationModule } from '@lpg-manager/station';
import { CatalogueModule } from '@lpg-manager/catalogue';
import { InventoryModule } from '@lpg-manager/inventory';
import { CartModule } from '@lpg-manager/cart';
import { OrderModule } from '@lpg-manager/order';
import { NotificationServiceModule } from '@lpg-manager/notification-service';
import { UserServiceModule } from '@lpg-manager/user-service';
import { NotificationModule } from '@lpg-manager/notification';
import { PubSubProviderModule } from '@lpg-manager/util';
import { VehicleModule } from '@lpg-manager/vehicle';
import { TransporterModule } from '@lpg-manager/transporter';
import { DispatchModule } from '@lpg-manager/dispatch';
import { DriverModule } from '@lpg-manager/driver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphqlModule,
    NotificationModule,
    AuthModule,
    TranslationModule,
    DbModule,
    AppQueueModule,
    KeyvRedisModule,
    AppEventModule,
    UserModule,
    RoleModule,
    PermissionModule,
    BrandModule,
    FileUploadModule,
    StationModule,
    CatalogueModule,
    InventoryModule,
    CartModule,
    OrderModule,
    NotificationServiceModule,
    UserServiceModule,
    PubSubProviderModule,
    VehicleModule,
    TransporterModule,
    DispatchModule,
    DriverModule,
  ],
})
export class AppModule {}
