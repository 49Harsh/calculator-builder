import React, { useEffect } from 'react';
import { Move, X, Moon, Sun, Undo, Redo, Save } from 'lucide-react';
import useStore from '../context/store/useStore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Calculator components definition
const components = {
  numbers: Array.from({ length: 10 }, (_, i) => ({
    id: `num-${i}`,
    type: 'number',
    value: i.toString(),
  })),
  operations: ['+', '-', '*', '/'].map(op => ({
    id: `op-${op}`,
    type: 'operation',
    value: op,
  })),
  equals: {
    id: 'equals',
    type: 'equals',
    value: '=',
  }
};

const CalculatorBuilder = () => {
  const {
    layout,
    expression,
    result,
    darkMode,
    setLayout,
    setExpression,
    calculateResult,
    toggleDarkMode,
    undo,
    redo,
    saveLayout,
    loadLayout
  } = useStore();

  useEffect(() => {
    loadLayout();
  }, [loadLayout]);

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const component = JSON.parse(e.dataTransfer.getData('component'));
    setLayout([...layout, component]);
  };

  const handleComponentClick = (component) => {
    if (!component) return;
    
    if (component.type === 'equals') {
      calculateResult();
    } else if (component.type === 'number' || component.type === 'operation') {
      setExpression(current => {
        // For operations, ensure there's a number before
        if (component.type === 'operation' && !current) return current;
        // For numbers and valid operations, append
        return current + component.value;
      });
    }
  };

  const removeComponent = (index) => {
    setLayout(layout.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    saveLayout();
    toast.success('Layout saved successfully!', {
      style: {
        background: darkMode ? '#374151' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
      },
      icon: '💾',
      duration: 2000,
    });
  };

  const renderComponent = (component) => {
    if (!component) return null;
    
    return (
      <div className="flex items-center justify-center text-white text-xl">
        {typeof component.value === 'string' ? component.value : ''}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-2 sm:p-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'} transition-all duration-300`}>
      <div className="max-w-6xl mx-auto backdrop-blur-lg bg-white/10 p-3 sm:p-4 rounded-xl shadow-2xl border border-white/20">
        {/* Improved Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 items-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Calculator Builder
          </h1>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={undo}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Undo size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={redo}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Redo size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Save size={20} />
            </motion.button>
          </div>
        </div>

        {/* Updated Calculator Display */}
        <div className="mb-4 overflow-hidden backdrop-blur-md bg-gradient-to-r from-gray-900/90 to-gray-800/90 p-4 rounded-xl border border-white/10">
          <motion.div 
            className="text-right space-y-2"
            layout
          >
            <div className="text-lg text-gray-400 font-mono min-h-[1.5em] overflow-x-auto whitespace-nowrap">
              {expression || '0'}
            </div>
            <div className="text-3xl font-bold text-white font-mono tracking-wider">
              {result || '0'}
            </div>
          </motion.div>
        </div>

        {/* Improved Component Palette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Numbers Panel */}
          <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Numbers</h3>
            <div className="grid grid-cols-3 gap-2">
              {components.numbers.map(component => (
                <motion.div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 bg-gradient-to-br from-blue-500/90 to-blue-600/90 rounded-lg cursor-move 
                           shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center justify-center text-white font-medium">
                    {component.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Operations Panel */}
          <div className="backdrop-blur-md bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/10">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Operations</h3>
            <div className="grid grid-cols-2 gap-2">
              {[...components.operations, components.equals].map(component => (
                <motion.div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 bg-gradient-to-br from-purple-500/90 to-purple-600/90 rounded-lg cursor-move 
                           shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-white/10"
                >
                  <div className="flex items-center justify-center text-white font-medium">
                    {component.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Updated Calculator Layout */}
        <div
          className="min-h-[200px] backdrop-blur-md bg-white/20 dark:bg-gray-800/20 p-4 rounded-xl border border-white/10"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {layout.map((component, index) => (
              <motion.div
                key={`${component.id}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className={`group relative p-3 rounded-lg cursor-pointer shadow-lg border border-white/10
                  ${component.type === 'number' 
                    ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90' 
                    : component.type === 'equals'
                    ? 'bg-gradient-to-br from-green-500/90 to-green-600/90'
                    : 'bg-gradient-to-br from-purple-500/90 to-purple-600/90'}`}
                onClick={() => handleComponentClick(component)}
              >
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(index);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 
                           shadow-lg hover:bg-red-600 transition-all z-10"
                >
                  <X size={12} />
                </motion.button>
                <div className="flex items-center justify-center text-white text-lg font-medium">
                  {component.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorBuilder;