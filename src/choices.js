const inquirer = require('inquirer');

const choice = async (questionList,answers) => {
    await inquirer
        .prompt(questionList)
        .then(answers);
};

module.exports = choice;