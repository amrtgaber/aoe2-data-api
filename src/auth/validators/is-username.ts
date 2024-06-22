import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          // alphanumeric + dashes, cannot start with a dash
          return !!value.match(/^[\w][\w-]+$/);
        },
      },
    });
  };
}
