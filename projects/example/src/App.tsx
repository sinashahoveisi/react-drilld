import React from 'react';
import {DrillD} from 'react-drilld';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DrillD title="sina" folders={[{name: 'sina', children: [{name: 'sina2'}, {name: 'sina3'}]}]} />
      </header>
    </div>
  );
}

export default App;
