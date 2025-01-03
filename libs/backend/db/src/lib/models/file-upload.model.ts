import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'file_uploads',
  underscored: true,
  paranoid: true,
  timestamps: true,
  deletedAt: true,
})
export class FileUploadModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @Column({ type: DataType.STRING })
  name?: string;

  @Column({ type: DataType.STRING })
  encoding?: string;

  @Column({ type: DataType.FLOAT })
  size?: number;

  @Column({ type: DataType.STRING })
  mimetype?: string;

  @Column({ type: DataType.STRING })
  originalName?: string;
}
