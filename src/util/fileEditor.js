const fse = require('fs-extra');
const readFile = require('fs-readfile-promise');

export const insert = async function ({point, content, output, match}) {
	try {
        let data = await readFile(output, 'utf-8');
        data = data.replace(/\/\*\*([\S\s]*?)\*\//gm, value => {
            // 匹配占位符，这个判断不太稳定，以后改
            if(value.indexOf(match) !== -1) {
                switch (point) {
                    case 'after':
                        return value + '\n' + content;
                    case 'before':
                    default:
                        return content + '\n' + value;
                }
            }
          return value;
        });

        await fse.outputFile(output, data);
    } catch (e) {
        console.log(e);
    }
};