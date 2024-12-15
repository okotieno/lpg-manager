import {
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'brands',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class BrandModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  companyName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  licenceNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  licenceDescription?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  licenceExpiry?: Date;
}
