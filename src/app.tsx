import * as React from 'react';
import * as ReactDOM from 'react-dom';
import compose from 'lodash/flowRight';

import { Checkbox } from './components/Checkbox';

import {
  formatWhitespace,
  formatComma,
  formatEllipsis,
  withFormat,
} from './format-utils';

const configNames = ['space', 'numeric', 'ellipsis'] as const;
type ConfigKey = typeof configNames[number];
type Config = Record<ConfigKey, boolean>;

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();

  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);
  const [config, setConfig] = React.useState<Config>({
    space: true,
    ellipsis: false,
    numeric: false,
  });

  React.useEffect(() => {
    async function initConfig() {
      const values = await Promise.all(
        configNames.map((name) =>
          craft.storageApi.get(name).then((rep) => rep.data),
        ),
      );
      const result = Object.fromEntries(
        configNames.map((name, i) => [
          name,
          typeof values[i] === 'string' ? values[i] === '1' : config[name],
        ]),
      ) as Config;
      setConfig(result);
    }
    initConfig();
  }, []);

  const onChangeConfigWithName =
    (name: ConfigKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      craft.storageApi.put(name, newValue ? '1' : '0');
      setConfig({ ...config, [name]: newValue });
    };

  return (
    <section className="container mx-auto px-4 py-2">
      <div className="my-8">
        <div className="flex gap-2">
          <button
            className="my-2 p-2 grow h-10 rounded-lg bg-blue-400 hover:bg-blue-600 text-white"
            onClick={withFormat(
              compose(
                formatWhitespace(config.space),
                formatComma(config.numeric),
                formatEllipsis(config.ellipsis),
              ),
            )}
          >
            Format 🎨
          </button>
        </div>
        <ol className="flex flex-col gap-2">
          <li>
            <Checkbox
              desc="在中英文之间添加空格"
              onChange={onChangeConfigWithName('space')}
              checked={config.space}
            >
              插入空格
            </Checkbox>
          </li>
          <li>
            <Checkbox
              desc="在数字之间插入 , 如 1000 -> 1,000"
              checked={config.numeric}
              onChange={onChangeConfigWithName('numeric')}
            >
              格式化数字
            </Checkbox>
          </li>
          <li>
            <Checkbox
              checked={config.ellipsis}
              onChange={onChangeConfigWithName('ellipsis')}
              desc="将不规范的 . . . or 。。。 -> …"
            >
              替换省略号
            </Checkbox>
          </li>
        </ol>
      </div>
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
