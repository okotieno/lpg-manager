import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPhoneNumberOrEmail(validationOptions?: ValidationOptions) {
  return function(object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberOrEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const contactDto: { type: string } = args.object as { type: string };
          const isPhoneNumber = /^(\+\d{1,2}\s?)?(\(\d{1,4}\)\s?)?\d{6,}$/.test(value);
          const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);

          if (contactDto.type === 'email') {
            return isEmail;
          }

          if (contactDto.type === 'phone') {
            return isPhoneNumber;
          }
          return isPhoneNumber || isEmail;
        }
      }
    });
  };
}
