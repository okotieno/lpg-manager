import {
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'stations',
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class StationModel extends Model {
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
    type: DataType.ENUM('DEPOT', 'DEALER'),
    allowNull: false,
  })
  type!: 'DEPOT' | 'DEALER';

}
