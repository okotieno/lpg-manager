import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { TransporterModel } from './transporter.model';

@Table({
  tableName: 'drivers',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class DriverModel extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  licenseNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @BelongsTo(() => TransporterModel)
  transporter!: TransporterModel;
} 