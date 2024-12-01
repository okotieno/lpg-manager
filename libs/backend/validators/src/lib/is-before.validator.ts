import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(startDate: string | Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const endDate = (args.object as Record<string, string | Date>)[
      relatedPropertyName
    ];

    // Allow empty strings to pass validation
    if (
      (typeof startDate === 'string' && startDate === '') ||
      (typeof endDate === 'string' && endDate === '')
    ) {
      return true;
    }

    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);

    // Check if both startDate and endDate are valid dates
    if (isNaN(startDateObject.getTime()) || isNaN(endDateObject.getTime())) {
      return false; // validation will fail if one of the properties is not a valid date
    }

    return startDateObject < endDateObject;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `Start date must be before ${relatedPropertyName}`;
  }
}

export function IsBefore(
  property: string | Date,
  validationOptions?: ValidationOptions,
) {
  return function (obj: object, propertyName: string) {
    registerDecorator({
      target: obj.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeConstraint,
    });
  };
}
