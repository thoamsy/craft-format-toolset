import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Checkbox } from './components/Checkbox';

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
      <ul className="flex flex-col my-8">
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
        <div className="flex flex-col gap-2">
          <Checkbox desc="在中英文之间添加空格" name="space" defaultChecked>
            插入空格
          </Checkbox>
          <Checkbox desc="在数字之间插入 , 如 1000 -> 1,000" name="numeric">
            格式化数字
          </Checkbox>
          <Checkbox name="ell" desc="将不规范的 ... 替换成 ……">
            替换省略号
          </Checkbox>
        </div>
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
