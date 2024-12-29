export interface Experiment {
    inputs: {
      'Polymer 1': number;
      'Polymer 2': number;
      'Polymer 3': number;
      'Polymer 4': number;
      'Carbon Black High Grade': number;
      'Carbon Black Low Grade': number;
      'Silica Filler 1': number;
      'Silica Filler 2': number;
      'Plasticizer 1': number;
      'Plasticizer 2': number;
      'Plasticizer 3': number;
      'Antioxidant': number;
      'Coloring Pigment': number;
      'Co-Agent 1': number;
      'Co-Agent 2': number;
      'Co-Agent 3': number;
      'Curing Agent 1': number;
      'Curing Agent 2': number;
      'Oven Temperature': number;
    };
    outputs: {
      'Viscosity': number;
      'Cure Time': number;
      'Elongation': number;
      'Tensile Strength': number;
      'Compression Set': number;
    };
  }
  
  export type ExperimentData = Record<string, Experiment>;
  
  export interface ScatterDataPoint {
    experimentId: string;
    x: number;
    y: number;
    label: string;
  }
  
  export type PropertyCategory = 'inputs' | 'outputs';
  export type PropertySelection = `${PropertyCategory}.${string}`;