/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */

import fs from 'fs';
import emailValidator from 'email-validator';
import dns from 'dns';
function validateEmailAddresses(inputPath: string[], outputFile: string) {
  let mails = '';
  let str = '';
  let outputArray: string[] = [];
  let fetchedArr: string[] = [];
  const validEmailsArr: string[] = [];
  const validD: string[] = [];
  const validArr: any[] = [];

  for (let i = 0; i < inputPath.length; i++) {
    fs.readFile(inputPath[i], 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
      } else if (!err) {
        for (let j = 0; j < data.length; j++) {
          mails += data[j];
        }
      }
      fetchedArr = mails.split('\n');
      fetchedArr.shift();
      fetchedArr.pop();
      //console.log(fetchedArr)

      for (let k = 0; k < fetchedArr.length; k++) {
        if (emailValidator.validate(fetchedArr[k]) === true) {
          validEmailsArr.push(fetchedArr[k]);
          //console.log(validEmailsArr);
        }
      }

      for (let i = 0; i < validEmailsArr.length; i++) {
        validD.push(validEmailsArr[i].split('@')[1]);
      }
      // validD

      async function resolveAllMxPromises() {
        for (let i = 0; i < validD.length; i++) {
          try {
            await resolveMxPromise(validD[i]);
            validArr.push(validD[i]);
          } catch (err) {
            console.error('DNS Error', err);
          }
        }
        for (let i = 0; i < fetchedArr.length; i++) {
          for (let j = 0; j < validArr.length; j++) {
            if (fetchedArr[i].includes(validD[j])) {
              outputArray.push(fetchedArr[i]);
            }
          }
        }
        console.log(outputArray);
        const set = new Set(outputArray);
        console.log(set);
        outputArray = [...set];

        str = `Emails '\n'${outputArray.join('\n')}`;
        console.log(outputArray);
        str;

        fs.writeFile(outputFile, str, 'utf8', (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('result saved');
          }
        });
      }
      resolveAllMxPromises();
    });
  }

  function resolveMxPromise(domain: string) {
    return new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(domain);
        }
      });
    });
  }
}

validateEmailAddresses(
  [
    '/Users/decagon/Desktop/week-4-task-Don-christo/task-two/fixtures/inputs/small-sample.csv',
  ],
  'validation.json',
);

export default validateEmailAddresses;
