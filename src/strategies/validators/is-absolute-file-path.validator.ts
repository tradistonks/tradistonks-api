import {
  isString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsAbsoluteFilePath(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      name: 'isAbsoluteFilePath',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsAbsoluteFilePath' })
class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return (
      isString(value) && /^(\/[a-z.\-_]*[a-z\-_]+[a-z.\-_]*)+$/i.test(value)
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `'${args.property}' is not an absolute file path`;
  }
}
