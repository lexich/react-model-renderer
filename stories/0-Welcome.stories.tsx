import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { Form } from 'antd';
import createForm from './models';
import { moneyRenderer, userRenderer } from './renderer';
import { observer } from 'mobx-react-lite';
import { IProps } from 'src';
import get from 'lodash/get';

export default {
  title: 'Welcome',
  component: Welcome
};

const AgeStatic = observer<IProps<any, any>>(({ model, path }) =>
  <div>Age: {get(model.form, path)}</div>
);

const TestComponent = observer<{
  model: ReturnType<typeof createForm>;
}>(({ model }) => {
  return (
    <Form>
      {userRenderer.purchase.money(model)}
      {userRenderer.isUser(model)}
      {userRenderer.age(model)}
      {userRenderer.age(model, { Component: AgeStatic })}
      {userRenderer.name(model)}
      {moneyRenderer.currency(model.partial('purchase'))}
    </Form>
  );
});

export const ToStorybook = () => {
  const form = createForm();
  return <TestComponent model={form} />;
};
