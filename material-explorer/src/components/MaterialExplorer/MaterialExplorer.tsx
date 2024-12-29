import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { experimentData } from '../../data/experiments';
import { Experiment } from '../../types/experiments';
import './MaterialExplorer.scss';

const MaterialExplorer: React.FC = () => {
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');

  const properties = useMemo(() => {
    const inputProps = new Set<string>();
    const outputProps = new Set<string>();

    Object.values(experimentData).forEach(experiment => {
      Object.keys(experiment.inputs).forEach(key => inputProps.add(key));
      Object.keys(experiment.outputs).forEach(key => outputProps.add(key));
    });

    return {
      inputs: Array.from(inputProps),
      outputs: Array.from(outputProps)
    };
  }, []);

  const scatterData = useMemo(() => {
    if (!selectedX || !selectedY) return [];

    return Object.entries(experimentData).map(([experimentId, experiment]) => {
      const xValue = experiment.inputs[selectedX as keyof Experiment['inputs']];
      const yValue = experiment.outputs[selectedY as keyof Experiment['outputs']];

      return {
        experimentId,
        x: xValue,
        y: yValue,
        label: `${selectedX}: ${xValue}\n${selectedY}: ${yValue}`
      };
    });
  }, [selectedX, selectedY]);

  return (
    <div className="material-explorer">
      <div className="material-explorer__card">
        <h2 className="material-explorer__title">Materials Data Explorer</h2>
        
        <div className="material-explorer__controls">
          <div className="material-explorer__select-group">
            <label htmlFor="x-select">X Axis Property (Input)</label>
            <select
              id="x-select"
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value)}
            >
              <option value="">Select input property</option>
              {properties.inputs.map(prop => (
                <option key={`input-${prop}`} value={prop}>
                  {prop}
                </option>
              ))}
            </select>
          </div>

          <div className="material-explorer__select-group">
            <label htmlFor="y-select">Y Axis Property (Output)</label>
            <select
              id="y-select"
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value)}
            >
              <option value="">Select output property</option>
              {properties.outputs.map(prop => (
                <option key={`output-${prop}`} value={prop}>
                  {prop}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="material-explorer__chart">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name={selectedX}
                label={{ 
                  value: selectedX || '', 
                  position: 'bottom',
                  offset: 40
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={selectedY}
                label={{ 
                  value: selectedY || '', 
                  angle: -90,
                  position: 'left',
                  offset: 40
                }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.[0]?.payload) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="material-explorer__tooltip">
                      <p className="material-explorer__tooltip-title">
                        Experiment: {data.experimentId}
                      </p>
                      <p className="material-explorer__tooltip-content">
                        {data.label}
                      </p>
                    </div>
                  );
                }}
              />
              <Scatter
                data={scatterData}
                fill="#2563eb"
                name="Experiments"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MaterialExplorer;