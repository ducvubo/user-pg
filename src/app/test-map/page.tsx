'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false, // Disable SSR for this component
});

const TestMapPage = () => {
  return (
    <div>
      <h1>Test Map Page</h1>
      <MapComponent />
    </div>
  );
};

export default TestMapPage;