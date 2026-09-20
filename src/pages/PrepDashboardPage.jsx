import React from 'react';
import { createDcWrapper } from '../dc-adapter.jsx';
import prepDashboardTemplate from '../PrepDashboardTemplate.jsx?raw';
import prepDashboardLogic from '../PrepDashboardComponent.js?raw';

const PrepDashboardComponent = createDcWrapper('Prep Dashboard', prepDashboardTemplate, prepDashboardLogic);

export default function PrepDashboardPage() {
  return <PrepDashboardComponent />;
}
