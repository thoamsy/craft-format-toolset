import { CraftTextBlock } from '@craftdocs/craft-extension-api';

const formater = new Intl.NumberFormat('en-US', { style: 'decimal' });

function withFormat(transform: (origin: string) => string) {
  return async () => {
    const page = await craft.dataApi.getCurrentPage().then((rep) => rep.data);
    if (!page) {
      return;
    }
    const formateedBlocks = page.subblocks
      .filter(
        (subblock) => subblock.type === 'textBlock' && subblock.content.length,
      )
      .map((subblock) => {
        const formattedContent = (subblock as CraftTextBlock).content.map(
          (item) => {
            if (item.isCode) {
              // do nothing for the code style
              return item;
            }

            return {
              ...item,
              text: transform(item.text),
            };
          },
        );

        return {
          ...subblock,
          content: formattedContent,
        };
      });
    craft.dataApi.updateBlocks(formateedBlocks);
  };
}

export const formatNumber = withFormat((text) =>
  text.replace(/(\d|,)+/g, (match) => {
    const mayBeNumber = Number(match.replaceAll(',', ''));
    if (Number.isNaN(mayBeNumber)) {
      return match;
    }
    return formater.format(mayBeNumber);
  }),
);

const testChineseAdjacentEnglish =
  /(([0-9a-zA-Z]+)(\p{sc=Han}+))|((\p{sc=Han}+)([0-9a-zA-Z]+))/gu;

const insertWhitespace = (str = ''): string => {
  if (!str.match(testChineseAdjacentEnglish)) {
    return str;
  }
  return insertWhitespace(
    str.replace(testChineseAdjacentEnglish, (...matches) => {
      // use regexp group replace the index
      return matches[2]
        ? matches[2] + ' ' + matches[3]
        : matches[5] + ' ' + matches[6];
    }),
  );
};

export const formatChinese = withFormat(insertWhitespace);
