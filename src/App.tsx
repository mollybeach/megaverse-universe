/*
* @title: App
* @path: src/App.tsx
* @description: Main application component
*/

import React from 'react';
import MegaverseManager from './components/MegaverseManager';
import './App.css';

const App: React.FC = () => {
  return (
      <div>
          <MegaverseManager />
      </div>
  );
};

export default App;