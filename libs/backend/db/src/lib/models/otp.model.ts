import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'otps',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class OtpModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  override id!: string;

  @Column
  identifier?: string

  @Column
  token?:string

  @Column
  validity?: number

  @Column
  usage?: string

  @Column
  valid?: boolean
}
