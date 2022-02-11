import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { formatChinese, formatNumber } from './format-utils';

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <section className="container mx-auto px-4 py-2">
      <ul className="flex flex-col items-center my-8">
        <button
          className="my-2 p-2 w-full rounded bg-green-500 hover:bg-green-700 text-white"
          onClick={formatChinese}
        >
          Format Space 🕶
        </button>
        <button
          className="my-2 p-2 w-full rounded bg-green-500 hover:bg-green-700 text-white"
          onClick={formatNumber}
        >
          Format Number 🔧
        </button>
      </ul>
    </section>
  );
};

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener((env) => setIsDarkMode(env.colorScheme === 'dark'));
  }, []);

  return isDarkMode;
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'));
}
