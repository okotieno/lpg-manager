import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'settings',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class SettingModel extends Model {
  @Column({ type: DataTypes.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataTypes.STRING, allowNull: false })
  value!: string;
}
