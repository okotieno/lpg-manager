import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { FileUploadModel } from './file-upload.model';

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

  @BelongsToMany(() => FileUploadModel, {
    through: 'brand_file_uploads',
    foreignKey: 'brand_id',
    otherKey: 'file_upload_id'
  })
  images!: FileUploadModel[];
}
