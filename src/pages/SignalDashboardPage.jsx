import React from 'react';
import { createDcWrapper } from '../dc-adapter.jsx';
import signalDashboardTemplate from '../SignalDashboardTemplate.jsx?raw';
import signalDashboardLogic from '../SignalDashboardComponent.js?raw';
import signalCardTemplate from '../SignalCardTemplate.jsx?raw';
import signalCardLogic from '../SignalCardComponent.js?raw';

const SignalDashboardComponent = createDcWrapper(
  'Signal Dashboard',
  signalDashboardTemplate,
  signalDashboardLogic,
  [
    {
      name: 'Signal Card',
      template: signalCardTemplate,
      logic: signalCardLogic,
    },
  ]
);

export default function SignalDashboardPage() {
  return <SignalDashboardComponent />;
}
