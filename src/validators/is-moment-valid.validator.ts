import { Transform, TransformOptions } from 'class-transformer';
import { registerDecorator, ValidationOptions } from 'class-validator';
import moment from 'moment';

export function IsMomentValid(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object, propertyName: string) => {
    registerDecorator({
      name: 'isMomentValid',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return moment(value).isValid();
        },
      },
    });
  };
}

export function TransformToDate(options?: TransformOptions) {
  return Transform(
    ({ value }) => {
      const isNull = value === undefined || value === null;

      return isNull ? value : moment(value).toDate();
    },
    {
      toClassOnly: true,
      ...(options ?? {}),
    },
  );
}
