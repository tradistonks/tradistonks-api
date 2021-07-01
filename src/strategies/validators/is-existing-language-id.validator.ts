import { Injectable } from '@nestjs/common';
import {
  isMongoId,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LanguagesService } from 'src/languages/languages.service';

export function IsExistingLanguageId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      name: 'isExistingLanguageId',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: IsExistingLanguageIdConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsExistingLanguageId', async: true })
@Injectable()
export class IsExistingLanguageIdConstraint
  implements ValidatorConstraintInterface
{
  constructor(private languagesService: LanguagesService) {}

  async validate(value: any) {
    return (
      isMongoId(value) &&
      (await this.languagesService.existsLanguageById(value))
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `'${args.value}' is not a valid language`;
  }
}
