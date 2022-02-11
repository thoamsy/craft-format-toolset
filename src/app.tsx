import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CraftTextBlock } from '@craftdocs/craft-extension-api';

const formater = new Intl.NumberFormat();

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
      <div className="flex flex-col items-center">
        <button
          className="p-2 rounded bg-green-500 hover:bg-green-700 text-white"
          onClick={insertHelloWorld}
        >
          Format Number 🔧
        </button>
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

async function insertHelloWorld() {
  const page = await craft.dataApi.getCurrentPage().then((rep) => rep.data);
  if (!page) {
    return;
  }

  console.log(page.subblocks);

  const formateedBlocks = page.subblocks
    .filter((subblock) => subblock.type === 'textBlock')
    .map((subblock) => {
      const formattedContent = (subblock as CraftTextBlock).content.map(
        (item) => {
          if (item.isCode) {
            // do nothing for the code style
            return item;
          }

          return {
            ...item,
            text: item.text.replace(/(\d|,)+/g, (match) => {
              const mayBeNumber = Number(match.replaceAll(',', ''));
              if (Number.isNaN(mayBeNumber)) {
                return match;
              }
              return formater.format(mayBeNumber);
            }),
          };
        },
      );
      return {
        ...subblock,
        content: formattedContent,
      };
    });

  craft.dataApi.updateBlocks(formateedBlocks);
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById('react-root'));
}
