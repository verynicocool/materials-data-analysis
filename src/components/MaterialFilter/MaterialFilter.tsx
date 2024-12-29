import React, { useState, useMemo } from 'react';
import { experimentData } from '../../data/experiments';
import { Experiment } from '../../types/experiments';
import './MaterialFilter.scss';

interface FilterCondition {
  property: string;
  operator: 'gt' | 'lt' | 'eq' | 'between';
  value1: string; 
  value2?: string;
  category: 'inputs' | 'outputs';
}

const MaterialFilter: React.FC = () => {
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [filteredData, setFilteredData] = useState<Record<string, Experiment>>(experimentData);

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

  const addFilter = () => {
    setFilters([...filters, {
      property: '',
      operator: 'gt',
      value1: '',  // Initialize as empty string
      category: 'inputs'
    }]);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    const newFilters = filters.map((filter, i) => 
      i === index ? { ...filter, ...updates } : filter
    );
    setFilters(newFilters);
  };

  const applyFilters = () => {
    const filtered = Object.entries(experimentData).filter(([_, experiment]) => {
      return filters.every(filter => {
        if (!filter.property || filter.value1 === '') return true;
        
        const value = filter.category === 'inputs' 
          ? experiment.inputs[filter.property as keyof Experiment['inputs']]
          : experiment.outputs[filter.property as keyof Experiment['outputs']];
        
        const value1 = parseFloat(filter.value1);
        const value2 = filter.value2 ? parseFloat(filter.value2) : undefined;

        if (isNaN(value1)) return true;

        switch (filter.operator) {
          case 'gt':
            return value > value1;
          case 'lt':
            return value < value1;
          case 'eq':
            return Math.abs(value - value1) < 0.0001;
          case 'between':
            return value >= value1 && (!value2 || value <= value2);
          default:
            return true;
        }
      });
    });

    setFilteredData(Object.fromEntries(filtered));
  };

  return (
    <div className="material-filter">
      <div className="material-filter__card">
        <h2 className="material-filter__title">Material Data Query Tool</h2>
        
        <div className="material-filter__filters">
          {filters.map((filter, index) => (
            <div 
              key={index} 
              className={`material-filter__filter-row ${filter.operator === 'between' ? 'has-between' : ''}`}
            >
              <div className="material-filter__form-group">
                <label>Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => updateFilter(index, { 
                    category: e.target.value as 'inputs' | 'outputs',
                    property: ''
                  })}
                >
                  <option value="inputs">Inputs</option>
                  <option value="outputs">Outputs</option>
                </select>
              </div>

              <div className="material-filter__form-group">
                <label>Property</label>
                <select
                  value={filter.property}
                  onChange={(e) => updateFilter(index, { property: e.target.value })}
                >
                  <option value="">Select property</option>
                  {(filter.category === 'inputs' ? properties.inputs : properties.outputs)
                    .map(prop => (
                      <option key={prop} value={prop}>{prop}</option>
                    ))}
                </select>
              </div>

              <div className="material-filter__form-group">
                <label>Operator</label>
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(index, { 
                    operator: e.target.value as FilterCondition['operator']
                  })}
                >
                  <option value="gt">Greater than</option>
                  <option value="lt">Less than</option>
                  <option value="eq">Equals</option>
                  <option value="between">Between</option>
                </select>
              </div>

              <div className="material-filter__form-group">
                <label>Value</label>
                <input
                  type="number"
                  value={filter.value1}
                  placeholder="Enter value"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      updateFilter(index, { value1: value });
                    }
                  }}
                />
              </div>

              {filter.operator === 'between' && (
                <div className="material-filter__form-group">
                  <label>To</label>
                  <input
                    type="number"
                    value={filter.value2 ?? ''}
                    placeholder="Enter value"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updateFilter(index, { value2: value });
                      }
                    }}
                  />
                </div>
              )}

              <button
                className="material-filter__remove-button"
                onClick={() => removeFilter(index)}
                aria-label="Remove filter"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="material-filter__actions">
          <button
            className="material-filter__button material-filter__button--primary"
            onClick={addFilter}
          >
            Add Filter
          </button>
          <button
            className="material-filter__button material-filter__button--primary"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>

        <div className="material-filter__results">
          <table>
            <thead>
              <tr>
                <th>Experiment ID</th>
                <th>Properties</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(filteredData).map(([experimentId, data]) => (
                <tr key={experimentId}>
                  <td>{experimentId}</td>
                  <td>
                    <div className="material-filter__property-grid">
                      <div className="material-filter__property-section">
                        <h4>Inputs</h4>
                        {Object.entries(data.inputs)
                          .filter(([_, value]) => value > 0)
                          .map(([key, value]) => (
                            <div key={key} className="material-filter__property-value">
                              {key}: {value}
                            </div>
                          ))}
                      </div>
                      <div className="material-filter__property-section">
                        <h4>Outputs</h4>
                        {Object.entries(data.outputs).map(([key, value]) => (
                          <div key={key} className="material-filter__property-value">
                            {key}: {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="material-filter__summary">
          Showing {Object.keys(filteredData).length} of {Object.keys(experimentData).length} experiments
        </div>
      </div>
    </div>
  );
};

export default MaterialFilter;
