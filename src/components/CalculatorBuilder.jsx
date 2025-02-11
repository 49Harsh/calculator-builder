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
    if (component.type === 'equals') {
      calculateResult();
    } else {
      setExpression(prev => prev + component.value);
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

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'} transition-all duration-300`}>
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Calculator Builder
          </h1>
          <div className="flex gap-4">
            {/* Control buttons with hover effects */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={undo}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Undo size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={redo}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Redo size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Save size={24} />
            </motion.button>
          </div>
        </div>

        {/* Component Palette */}
        <div className="mb-8 p-6 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Components</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Numbers Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Numbers</h3>
              <div className="grid grid-cols-3 gap-2">
                {components.numbers.map(component => (
                  <motion.div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1 }}
                    className="p-4 bg-gradient-to-br from-blue-400/80 to-blue-500/80 rounded-lg cursor-move 
                             shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center text-white">
                      {component.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Operations Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Operations</h3>
              <div className="grid grid-cols-2 gap-2">
                {components.operations.map(component => (
                  <motion.div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    whileHover={{ scale: 1.05 }}
                    whileDrag={{ scale: 1.1 }}
                    className="p-4 bg-gradient-to-br from-purple-400/80 to-purple-500/80 rounded-lg cursor-move 
                             shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center text-white">
                      {component.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Layout */}
        <div
          className="p-6 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg min-h-[500px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Calculator Display */}
          <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 p-6 rounded-xl mb-6 backdrop-blur-md">
            <div className="text-right text-2xl mb-2 text-gray-400 font-mono">
              {expression || '0'}
            </div>
            <div className="text-right text-4xl font-bold text-white font-mono">
              {result}
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-4 gap-3">
            {layout.map((component, index) => (
              <motion.div
                key={`${component.id}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative p-5 rounded-xl cursor-pointer shadow-lg
                  ${component.type === 'number' 
                    ? 'bg-gradient-to-br from-blue-400/80 to-blue-500/80' 
                    : 'bg-gradient-to-br from-purple-400/80 to-purple-500/80'}`}
                onClick={() => handleComponentClick(component)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(index);
                  }}
                  className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center justify-center text-white text-xl">
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