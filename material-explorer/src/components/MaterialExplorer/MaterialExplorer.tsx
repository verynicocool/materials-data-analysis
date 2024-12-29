import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { experimentData } from '../../data/experiments';
import { Experiment, PropertySelection, ScatterDataPoint } from '../../types/experiments';
import './MaterialExplorer.scss';

const MaterialExplorer: React.FC = () => {
  const [selectedX, setSelectedX] = useState<PropertySelection | ''>('');
  const [selectedY, setSelectedY] = useState<PropertySelection | ''>('');

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
      const [xCategory, xProp] = selectedX.split('.');
      const [yCategory, yProp] = selectedY.split('.');

      const xData = experiment[xCategory as keyof Experiment];
      const yData = experiment[yCategory as keyof Experiment];
      
      // Type guard to ensure we're accessing valid properties
      const xValue = typeof xData === 'object' && xData !== null ? 
        (xData as Record<string, number>)[xProp] : 0;
      const yValue = typeof yData === 'object' && yData !== null ? 
        (yData as Record<string, number>)[yProp] : 0;

      return {
        experimentId,
        x: xValue,
        y: yValue,
        label: `${xProp}: ${xValue}\n${yProp}: ${yValue}`
      };
    });
  }, [selectedX, selectedY]);

  return (
    <div className="material-explorer">
      <div className="material-explorer__card">
        <h2 className="material-explorer__title">Materials Data Explorer</h2>
        
        <div className="material-explorer__controls">
          <div className="material-explorer__select-group">
            <label htmlFor="x-select">X Axis Property</label>
            <select
              id="x-select"
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value as PropertySelection)}
            >
              <option value="">Select property</option>
              <optgroup label="Input Properties">
                {properties.inputs.map(prop => (
                  <option key={`input-${prop}`} value={`inputs.${prop}`}>
                    {prop}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Output Properties">
                {properties.outputs.map(prop => (
                  <option key={`output-${prop}`} value={`outputs.${prop}`}>
                    {prop}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="material-explorer__select-group">
            <label htmlFor="y-select">Y Axis Property</label>
            <select
              id="y-select"
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value as PropertySelection)}
            >
              <option value="">Select property</option>
              <optgroup label="Input Properties">
                {properties.inputs.map(prop => (
                  <option key={`input-${prop}`} value={`inputs.${prop}`}>
                    {prop}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Output Properties">
                {properties.outputs.map(prop => (
                  <option key={`output-${prop}`} value={`outputs.${prop}`}>
                    {prop}
                  </option>
                ))}
              </optgroup>
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
                name={selectedX?.split('.')[1]}
                label={{ 
                  value: selectedX?.split('.')[1] || '', 
                  position: 'bottom',
                  offset: 40
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={selectedY?.split('.')[1]}
                label={{ 
                  value: selectedY?.split('.')[1] || '', 
                  angle: -90,
                  position: 'left',
                  offset: 40
                }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.[0]?.payload) return null;
                  const data = payload[0].payload as ScatterDataPoint;
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