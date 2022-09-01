import { Type } from "@nestjs/common";
/* eslint-disable */
export class DecoratorUtils {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static registerMethodDecorator<T>(type: Type<T>): (options?: T) => MethodDecorator {
    return (options?: T): MethodDecorator => <T2>(_: unknown, __: unknown, descriptor: TypedPropertyDescriptor<T2>) => {
      Reflect.defineMetadata(type.name, Object.assign(new type() as any, options), descriptor.value ?? '');
      return descriptor;
    };
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  static registerClassDecorator<T>(type: Type<T>): (options?: T) => MethodDecorator {
    return (options?: T): MethodDecorator => <T2>(_: unknown, __: unknown, descriptor: TypedPropertyDescriptor<T2>) => {
      Reflect.defineMetadata(type.name, Object.assign(new type() as any, options), descriptor.value ?? '');
      return descriptor;
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static getMethodDecorator<T>(type: Type<T>, target: Function): T | undefined {
    return this.getDecoratorOptions(type, target);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  static getClassDecorator<TClass, TResult>(type: Type<TResult>, target: Type<TClass>): TResult | undefined {
    return this.getDecoratorOptions(type, target);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private static getDecoratorOptions<T>(type: Type<T>, target: Object): T | undefined {
    const metadata = Reflect.getOwnMetadata(type.name, target);
    if (!metadata) {
      return undefined;
    }

    if (!(metadata instanceof type)) {
      return undefined;
    }

    return metadata;
  }
}
/* eslint-enable */
