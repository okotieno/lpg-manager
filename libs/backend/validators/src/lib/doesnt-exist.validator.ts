import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ModelType } from 'sequelize-typescript';

@ValidatorConstraint({ name: 'DoesntExist', async: true })
export class DoesntExistConstraint implements ValidatorConstraintInterface {

  async validate(value: number, args: ValidationArguments) {

    const [model, field, whereOptions] = args.constraints;
    const where = {...whereOptions}
    const existingRecord = await model.findOne({ where: {...where, [field]: value } });
    return !existingRecord;
  }

  defaultMessage() {
    // args: ValidationArguments
    return `Record already exists`;
  }
}

export function DoesntExist(model: ModelType<{ id: string }, {
  id: string
}>, field = 'id',  where? :Record<string, string | boolean>,  validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: DoesntExistConstraint
    });
  };
}
