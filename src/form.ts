import React from 'react';
import { SForm, TReact, Renderers, IMetaProps, TReactOptions } from './types';
import { FormModel } from './formModel';
import { getProto, getProtoForm } from './proto';
import { getMetadataField, getMetadataForm } from './meta';
import { getInputName } from './helpers';

const getMetadata = (model: FormModel<SForm>, realPath: string[]) => {
  // field metadata flow
  const proto = getProto(model.form, realPath);
  const propName = realPath[realPath.length - 1];
  if (!proto) {
    return undefined;
  }
  const meta = getMetadataField(proto, propName);
  if (meta) {
    return meta;
  }
  const protoClass = getProto(model.form, realPath.concat(undefined!));
  if (!protoClass) {
    return undefined;
  }
  // class metadata flow
  const protoForm = getProtoForm(protoClass);
  return getMetadataForm(protoForm);
};

function createReconsiler<TForm extends SForm, TResolver>(
  options: IMetaProps<TResolver, any>,
  realPath: string[],
): any {
  const handler = {
    get(_: any, method: string) {
      const newRealPath = realPath.concat(method);
      return createReconsiler<TForm, TResolver>(options, newRealPath);
    },
  };
  if (!realPath) {
    return new Proxy({}, handler);
  }

  const renderer: TReact<any> = (model: FormModel<SForm>, opts?: TReactOptions<any>) => {
    const meta = getMetadata(model, realPath);
    const resolverType = meta?.type;
    const Component = opts?.Component ?? options.resolveComponent(resolverType);

    if (!Component) {
      return null;
    }

    const name = getInputName(model.form, realPath, model.parentFormName);
    return React.createElement(Component, {
      model,
      name,
      path: realPath,
      options,
      meta: meta as any,
      type: resolverType,
    });
  };

  return new Proxy(renderer, handler);
}

export function reconsiler<T, TType, TInterface>(
  props: IMetaProps<TType, TInterface>,
): Renderers<T> {
  return createReconsiler(props, []);
}
