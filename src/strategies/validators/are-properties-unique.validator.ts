import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import _ from 'lodash';

export function ArePropertiesUnique(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      name: 'arePropertiesUnique',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ArePropertiesUnique' })
class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value) || !value.every(_.isObject)) {
      return false;
    }

    const [propertyName] = args.constraints;

    return _.uniqBy(value, propertyName).length === value.length;
  }

  defaultMessage(args: ValidationArguments): string {
    return `Properties '${args.constraints[0]}' in '${args.property}' are not all unique`;
  }
}
