import React from 'react';
import { createDcWrapper } from '../dc-adapter.jsx';
import landingTemplate from '../LandingTemplate.jsx?raw';
import landingLogic from '../LandingComponent.js?raw';

const LandingComponent = createDcWrapper('Landing', landingTemplate, landingLogic);

export default function LandingPage() {
  return <LandingComponent />;
}
