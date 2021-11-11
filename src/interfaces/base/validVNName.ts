import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsVNName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVNName',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,

      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (value === null || value === undefined) return value;
          value = value.toLowerCase();
          value = value.replace(/\s/g, '');
          value = value.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
          value = value.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
          value = value.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
          value = value.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
          value = value.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
          value = value.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
          value = value.replace(/đ/g, 'd');
          var re = /^[a-zA-Z)\(.-]{2,}$/g; // regex here
          return re.test(value);
        },
        defaultMessage(validationArguments) {
          console.log(validationArguments);
          return `${validationArguments.property} must be a name`;
        },
      },
    });
  };
}
