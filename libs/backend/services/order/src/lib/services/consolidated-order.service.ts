import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ConsolidatedOrderModel,
} from '@lpg-manager/db';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';

@Injectable()
export class ConsolidatedOrderService extends CrudAbstractService<ConsolidatedOrderModel> {
  constructor(
    @InjectModel(ConsolidatedOrderModel) consolidatedOrderModel: typeof ConsolidatedOrderModel,
  ) {
    super(consolidatedOrderModel);
  }
}
