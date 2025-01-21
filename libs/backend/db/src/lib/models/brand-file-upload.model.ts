import { Column, ForeignKey, Model, Table, DataType } from 'sequelize-typescript';
import { BrandModel } from './brand.model';
import { FileUploadModel } from './file-upload.model';

@Table({
  tableName: 'brand_file_uploads',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false,
})
export class BrandFileUploadModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  override id!: string;

  @ForeignKey(() => BrandModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  brandId!: string;

  @ForeignKey(() => FileUploadModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  fileUploadId!: string;
}
