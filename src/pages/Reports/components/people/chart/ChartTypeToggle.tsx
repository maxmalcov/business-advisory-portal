
import React from 'react';
import { ChartBar, ChartLine } from 'lucide-react';

interface ChartTypeToggleProps {
  chartType: 'line' | 'bar';
  setChartType: React.Dispatch<React.SetStateAction<'line' | 'bar'>>;
}

const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({ chartType, setChartType }) => {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => setChartType('line')} 
        className={`p-1 rounded-md transition-colors ${chartType === 'line' ? 'bg-muted' : ''}`}
      >
        <ChartLine className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setChartType('bar')} 
        className={`p-1 rounded-md transition-colors ${chartType === 'bar' ? 'bg-muted' : ''}`}
      >
        <ChartBar className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChartTypeToggle;
