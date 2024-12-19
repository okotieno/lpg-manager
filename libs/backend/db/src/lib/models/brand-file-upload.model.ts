import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { BrandModel } from './brand.model';
import { FileUploadModel } from './file-upload.model';

@Table({
  tableName: 'brand_file_uploads',
  underscored: true,
  paranoid: false,
  timestamps: true,
  deletedAt: false
})
export class BrandFileUploadModel extends Model {
  @ForeignKey(() => BrandModel)
  @Column({ 
    type: DataTypes.UUID,
    allowNull: false 
  })
  brandId!: string;

  @ForeignKey(() => FileUploadModel)
  @Column({ 
    type: DataTypes.UUID,
    allowNull: false 
  })
  fileUploadId!: string;
}