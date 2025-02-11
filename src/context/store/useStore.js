import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      layout: [],
      expression: '',
      result: '0',
      darkMode: false,
      history: [],
      currentStep: -1,

      setLayout: (layout) => {
        const { history, currentStep } = get();
        set({
          layout,
          history: [...history.slice(0, currentStep + 1), layout],
          currentStep: currentStep + 1
        });
      },

      setExpression: (expression) => set({ expression }),
      setResult: (result) => set({ result }),
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),

      undo: () => {
        const { currentStep, history } = get();
        if (currentStep > 0) {
          set({
            currentStep: currentStep - 1,
            layout: history[currentStep - 1]
          });
        }
      },

      redo: () => {
        const { currentStep, history } = get();
        if (currentStep < history.length - 1) {
          set({
            currentStep: currentStep + 1,
            layout: history[currentStep + 1]
          });
        }
      },

      calculateResult: () => {
        const { expression } = get();
        try {
          const result = eval(expression);
          set({ result: result.toString(), expression: '' });
        } catch (error) {
          set({ result: 'Error', expression: '' });
        }
      },

      clearHistory: () => set({ history: [], currentStep: -1 }),
      
      saveLayout: () => {
        const { layout } = get();
        localStorage.setItem('calculator-layout', JSON.stringify(layout));
      },

      loadLayout: () => {
        const savedLayout = localStorage.getItem('calculator-layout');
        if (savedLayout) {
          const layout = JSON.parse(savedLayout);
          set({ layout, history: [layout], currentStep: 0 });
        }
      }
    }),
    {
      name: 'calculator-storage',
      partialize: (state) => ({ 
        layout: state.layout, 
        darkMode: state.darkMode 
      })
    }
  )
);

export default useStore;
