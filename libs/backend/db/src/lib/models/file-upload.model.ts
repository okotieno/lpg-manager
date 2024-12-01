import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'file_uploads',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true
})
export class FileUploadModel extends Model {
  @Column({type: DataTypes.STRING})
  name?: string;

  @Column({type: DataTypes.STRING})
  encoding?: string;

  @Column({type: DataTypes.FLOAT})
  size?: number;

  @Column({type: DataTypes.STRING})
  mimetype?: string

  @Column({type: DataTypes.STRING})
  originalName?: string
}
