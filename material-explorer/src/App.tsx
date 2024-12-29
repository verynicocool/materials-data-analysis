import { useState } from 'react';
import MaterialExplorer from './components/MaterialExplorer/MaterialExplorer';
import MaterialFilter from './components/MaterialFilter/MaterialFilter';
import './App.scss';

function App() {
  const [activeView, setActiveView] = useState<'explorer' | 'filter'>('explorer');

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__header">
          <h1 className="app__title">Materials Data Analysis</h1>
          <div className="app__nav">
            <button
              className={`app__nav-button ${
                activeView === 'explorer' ? 'app__nav-button--active' : ''
              }`}
              onClick={() => setActiveView('explorer')}
            >
              Correlation Explorer
            </button>
            <button
              className={`app__nav-button ${
                activeView === 'filter' ? 'app__nav-button--active' : ''
              }`}
              onClick={() => setActiveView('filter')}
            >
              Data Query
            </button>
          </div>
        </div>

        {activeView === 'explorer' ? <MaterialExplorer /> : <MaterialFilter />}
      </div>
    </div>
  );
}

export default App;