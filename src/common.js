const fs = require('fs');

module.exports = {
    /**
     * Function: validatePath
     * confirm template file in configPath exist
     *
     * @param {String} configPath
     * @param {String} name
     * @param {Boolean} exitProcess
     *
     * */
    validatePath: async function (configPath, name, exitProcess = false) {
        const existPath = await fs.existsSync(configPath);
        if (!existPath && exitProcess) {
            const pathName = name || 'file';
            console.log(pathName + ' not exist!');
            process.exit(0);
        }
        return existPath;
    }
};