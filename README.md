# Materials Data Analysis

A web application for exploring and analyzing materials science experimental data. Built with React, TypeScript, and Vite.

## Features

- **Correlation Explorer**: Visualize relationships between input parameters and output properties
  - Plot input properties on X-axis
  - Plot output properties on Y-axis
  - Interactive scatter plots with experiment details on hover

- **Data Query Tool**: Filter and search through experimental data
  - Filter by both input and output properties
  - Multiple filter conditions support
  - Dynamic filter building with operators (greater than, less than, equals, between)
  - Real-time results display

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/material-explorer.git](https://github.com/verynicocool/materials-data-analysis)
cd material-explorer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Technology Stack

- React 18
- TypeScript
- Vite
- Recharts for data visualization
- SCSS for styling

## Project Structure

```
material-explorer/
├── src/
│   ├── components/
│   │   ├── MaterialExplorer/     # Correlation visualization component
│   │   └── MaterialFilter/       # Data query component
│   ├── data/                     # Data files and data management
│   ├── styles/                   # Global styles and variables
│   └── types/                    # TypeScript type definitions
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
