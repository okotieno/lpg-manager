import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ModelType } from 'sequelize-typescript';

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: number | null, args: ValidationArguments) {
    const [model, field] = args.constraints;

    if (!value && value !== 0) {
      return true;
    }
    const existingRecord = await model.findOne({ where: { [field]: value } });

    return !!existingRecord;
  }

  defaultMessage() {
    // args: ValidationArguments
    return `Record does not exist`;
  }
}

export function Exists(model: ModelType<{ id: string }, {
  id: string
}>, field = 'id', validationOptions?: ValidationOptions) {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: ExistsConstraint
    });
  };
}
