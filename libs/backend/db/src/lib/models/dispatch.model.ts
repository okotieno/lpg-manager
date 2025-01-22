import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransporterModel } from './transporter.model';
import { DriverModel } from './driver.model';
import { VehicleModel } from './vehicle.model';
import { OrderModel } from './order.model';
import { DriverInventoryModel } from './driver-inventory.model';
import { IDispatchStatus } from '@lpg-manager/types';

@Table({
  tableName: 'dispatches',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class DispatchModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => TransporterModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transporterId!: string;

  @ForeignKey(() => DriverModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  driverId!: string;

  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  vehicleId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(IDispatchStatus)),
    allowNull: false,
    defaultValue: IDispatchStatus.Pending,
  })
  status!: IDispatchStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dispatchDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  depotToDriverConfirmedAt: Date | null = null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  driverFromDepotConfirmedAt: Date | null = null;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // filledDeliveredToDealerAt: Date | null = null;

  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // emptyCollectedFromDealerAt: Date | null = null;
  //
  // @Column({
  //   type: DataType.DATE,
  //   allowNull: true,
  // })
  // emptyReturnedToDepotAt: Date | null = null;
  //
  // @Column({
  //   type: DataType.BOOLEAN,
  //   allowNull: false,
  //   defaultValue: false,
  // })
  // isFilledDeliveryCompleted: boolean = false;

  // @Column({
  //   type: DataType.BOOLEAN,
  //   allowNull: false,
  //   defaultValue: false,
  // })
  // isEmptyReturnCompleted: boolean = false;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;

  @BelongsTo(() => DriverModel)
  driver!: DriverModel;

  @BelongsTo(() => VehicleModel)
  vehicle!: VehicleModel;

  @HasMany(() => OrderModel)
  orders!: OrderModel[];

  @HasMany(() => DriverInventoryModel)
  driverInventories!: DriverInventoryModel[];
}
