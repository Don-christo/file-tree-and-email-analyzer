/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

import fs from 'fs';
import emailValidator from 'email-validator';
// import dns from 'dns';

function analyseFiles(inputPaths: string[], outputPath: string) {
  interface Total {
    validDomains: string[];
    totalEmailsParsed: number;
    totalValidEmails: number;
    categories: Record<string, number>;
  }

  let fetchedArr: string[] = [];
  const validEmailsArr: string[] = [];
  let mails = '';
  const cat: any = {};
  let validD: string[] = [];

  for (let i = 0; i < inputPaths.length; i++) {
    fs.readFile(inputPaths[i], 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      } else if (!err) {
        for (let j = 0; j < data.length; j++) {
          mails += data[j];
          // fetchedArr.push(data[j])
        }

        fetchedArr = mails.split('\n');
        fetchedArr.shift();
        fetchedArr.pop();
        // console.log(fetchedArr)

        for (let k = 0; k < fetchedArr.length; k++) {
          if (emailValidator.validate(fetchedArr[k]) === true) {
            validEmailsArr.push(fetchedArr[k]);
          }
          // console.log(validEmailsArr)
          // console.log(emailValidator.validate(fetchedArr[k]))
        }
        // console.log(validEmailsArr)

        for (let i = 0; i < validEmailsArr.length; i++) {
          const check = validEmailsArr[i].split('@')[1];
          if (cat[check]) {
            cat[check]++;
          } else {
            cat[check] = 1;
          }
        }

        // cat
        // validEmailsArr;
        validD = Object.keys(cat);
        // validD

        const finalOutput: Total = {
          validDomains: validD,
          totalEmailsParsed: fetchedArr.length,
          totalValidEmails: validEmailsArr.length,
          categories: cat,
        };

        console.log(finalOutput);

        fs.writeFile(outputPath, JSON.stringify(finalOutput), 'utf8', (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('result saved');
          }
        });
      }
    });
  }
}

analyseFiles(
  [
    '/Users/decagon/Desktop/week-4-task-Don-christo/task-two/fixtures/inputs/small-sample.csv',
  ],
  'test.json',
);

export default analyseFiles;
