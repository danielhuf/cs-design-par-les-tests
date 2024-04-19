import { program } from 'commander';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import figlet from 'figlet';

program.version('0.1.0');
console.log(figlet.textSync("CommonCent$"));


program
  .command('create-group')
  .description('Create a new group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the group?',
      }
    ]);

    const response = await fetch('http://localhost:5000/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: answers.name }),
    });
    const data = await response.json();
    console.log(data);
  });

program
  .command('add-member')
  .description('Add a member to a group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groupId',
        message: 'What is the group ID?',
      },
      {
        type: 'input',
        name: 'memberName',
        message: 'What is the name of the member to add?',
      }
    ]);

    const response = await fetch(`http://localhost:5000/group/${answers.groupId}/member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: answers.memberName }),
    });
    const data = await response.json();
    console.log(data);
  });


program
  .command('delete-group')
  .description('Delete a group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groupId',
        message: 'What is the group ID?',
      }
    ]);

    const response = await fetch(`http://localhost:5000/group/${answers.groupId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log(data);
  });

program
  .command('delete-member')
  .description('Delete a member from a group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groupId',
        message: 'What is the group ID?',
      },
      {
        type: 'input',
        name: 'memberName',
        message: 'What is the member name?',
      }
    ]);

    const response = await fetch(`http://localhost:5000/group/${answers.groupId}/member/${answers.memberName}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log(data);
  });

program
  .command('add-expense')
  .description('Add an expense to a group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groupId',
        message: 'What is the group ID?',
      },
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the expense?',
      },
      {
        type: 'input',
        name: 'amount',
        message: 'What is the amount of the expense?',
      },
      {
        type: 'input',
        name: 'payerName',
        message: 'Who paid for the expense?',
      },
      {
        type: 'input',
        name: 'date',
        message: 'What is the date of the expense? (YYYY-MM-DD)',
      },
      {
        type: 'confirm',
        name: 'isEvenlySplit',
        message: 'Is the expense split evenly among the participants?',
      }
    ]);
    const isEvenlySplit = answers.isEvenlySplit;
    const split = {};
    let response;
    if (isEvenlySplit){

      const membersSplit = await inquirer.prompt([
        {
          type: 'input',
          name: 'memberNames',
          message: 'Who are the members that participated in the expense? (comma separated)',
        }
      ]);
      response = await fetch(`http://localhost:5000/group/${answers.groupId}/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: answers.title, 
          amount:  parseFloat(answers.amount), 
          payerName: answers.payerName, 
          date: answers.date, 
          isPercentual: false, 
          split: split,  
          isEquallySplit: true, 
          membersSplit: membersSplit.memberNames.split(',') }),
      });
    } else {
      const membersSplit = await inquirer.prompt([
        {
          type: 'input',
          name: 'memberNames',
          message: 'Who are the members that participated in the expense? (comma separated)',
        },
        {
          type: 'confirm',
          name: 'isPercentual',
          message: 'Is the split percentual?',
        },
        {
          type: 'input',
          name: 'split',
          message: 'What is the split? (comma separated)',
        }
      ]);
      const members = membersSplit.memberNames.split(',');
      const splitAmounts = membersSplit.split.split(',');
      const split: { [key: string]: number } = {}; // Add type annotation for split object
      members.forEach((member: string, index: number) => {
        split[member] = parseFloat(splitAmounts[index]);
      });
      response = await fetch(`http://localhost:5000/group/${answers.groupId}/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: answers.title, amount: parseFloat(answers.amount), payerName: answers.payerName, date: answers.date, isPercentual: membersSplit.isPercentual, split: split}),
      });
    }

    const data = await response.json();
    console.log(data);

  });

  program
  .command('add-payOff')
  .description('Add a pay off to a group')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'groupId',
        message: 'What is the group ID?',
      },
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the pay off?',
      },
      {
        type: 'input',
        name: 'amount',
        message: 'What is the amount of the pay off?',
      },
      {
        type: 'input',
        name: 'payerName',
        message: 'Who is paying the debt?',
      },
      {
        type: 'input',
        name: 'date',
        message: 'What is the date of the pay off? (YYYY-MM-DD)',
      },
      {
        type: 'input',
        name: 'payTo',
        message: 'To who is the debt payed?',
      }
    ]);
    const response = await fetch(`http://localhost:5000/group/${answers.groupId}/payOff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: answers.title, 
        amount: parseFloat(answers.amount), 
        payerName: answers.payerName, 
        date: answers.date, 
        payTo: answers.payTo}),
    });

    const data = await response.json();
    console.log(data);

  });

program.parse(process.argv);
