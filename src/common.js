const fs = require('fs');

module.exports = {
    validatePath: async function (path, name, exitProcess = false) {
        const existPath = await fs.existsSync(path);
        if (!existPath && exitProcess) {
            const pname = name || 'file';
            console.log(pname + ' not exist!');
            process.exit(0);
        }
        return existPath;
    }
};