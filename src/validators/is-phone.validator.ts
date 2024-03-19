
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsPhone', async: false })
export class IsPhone implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value.match(/^\+[0-9]{9,15}$/gm)) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number is not correct, please type full phone number with country code';
  }
}