import { ReactNode, FunctionComponent } from 'react';
import 'reflect-metadata';
import { FormModel } from './formModel';
export const formSymbol = Symbol('TFORM');
export abstract class SForm {
  [formSymbol]() {}
}

export interface IFieldProps {
  name: string;
  type: any;
}

export type SFormKeys<T> = RemoveTNullProperties<
  {
    [P in keyof T]: T[P] extends SForm ? T[P] : undefined;
  }
>;

export type RemoveTNull<Type, TNull = undefined> = {
  [Key in keyof Type]: TNull extends Type[Key] ? never : Key;
}[keyof Type];

export type RemoveTNullProperties<Type, TNull = undefined> = {
  [Key in RemoveTNull<Type, TNull>]: Type[Key];
};

export type TWrapID<T> = T;
export type TWrapForm<T> = Record<string, T>;

export interface IMetaProps<TType> {
  set(target: any, key: string[], value: any): void;
  resolveComponent(type?: TType, meta?: any): FunctionComponent<IProps<any>> | null;
}

type TypeFilterRenderer<
  TTypeLongName,
  TOrigin,
  TLeftType = TTypeLongName
> = TTypeLongName extends string
  ? TLeftType
  : TTypeLongName extends boolean
  ? TLeftType
  : TTypeLongName extends number
  ? TLeftType
  : TTypeLongName extends Date
  ? TLeftType
  : TTypeLongName extends SForm
  ? Renderers<TTypeLongName, TOrigin>
  : undefined;

export type Renderers<
  T extends any,
  TOrigin = T,
  TKeys extends any = keyof T
> = RemoveTNullProperties<
  {
    [P in TKeys]: TypeFilterRenderer<T[P], TOrigin, TReact<TOrigin>> & TReact<TOrigin>;
  },
  undefined
>;

export interface IProps<TForm> {
  model: FormModel<TForm>;
  name: string;
  path: string[];
  options: IMetaProps<TForm>;
  meta: any;
}

export type TReactOptions<T> = {
  Component?: FunctionComponent<IProps<T>>;
  meta?: any;
};

export type TReact<TForm> = {
  <T>(form: FormModel<TForm>, options?: TReactOptions<T>): ReactNode;
};

export type TypeFilter<
  TTypeLongName,
  TLeftType = TTypeLongName,
  TRightType = TTypeLongName
> = TTypeLongName extends string
  ? TLeftType
  : TTypeLongName extends boolean
  ? TLeftType
  : TTypeLongName extends number
  ? TLeftType
  : TTypeLongName extends Date
  ? TLeftType
  : TTypeLongName extends SForm
  ? TLeftType
  : TRightType;

export type ClassFlags<T extends any, TKeys extends any = keyof T, TDefType = boolean> = {
  [P in TKeys]: Partial<TypeFilter<T[P], TDefType, ClassFlags<T[P], keyof T[P], TDefType>>>;
};

export type Touched<T> = ClassFlags<T, keyof T, boolean>;
export type Errored<T> = ClassFlags<T, keyof T, string>;
