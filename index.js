const fs = require('fs');
const os = require('os');
const readline = require('readline');
const moment = require('moment-timezone');

const DAILY_LIMIT = 5000;
const WEEKLY_LIMIT = 20000;
const TIME_ZONE = 'UTC';
const OUTPUT_FILE = 'generatedOutput.txt';

const successfullyProcessed = [];
const processedFundRequest = [];

const isDuplicateRequest = (request) => {
    return processedFundRequest.some((req) => {
        return req.id === request.id && req.customer_id === request.customer_id;
    });
}

const isDailyLimitExceeded = (request) => {
    const transactionDay = moment.tz(request.time, TIME_ZONE).dayOfYear();
    const transactionDayTransactions = successfullyProcessed.filter((req) => {
        return (
            moment.tz(req.time, TIME_ZONE).dayOfYear() === transactionDay
                && req.customer_id === request.customer_id
        );
    });
    if (transactionDayTransactions.length > 3) {
        return true;
    }
    const totalForTransactionDay = transactionDayTransactions.reduce((total, transcation) => {
        return total + transcation.load_amount;
    }, 0);
    return (totalForTransactionDay + request.load_amount) > DAILY_LIMIT;
}

const isWeeklyLimitExceeded = (request) => {
    const transactionWeek = moment.tz(request.time, TIME_ZONE).isoWeek();
    const transactionWeekTransactions = successfullyProcessed.filter((req) => {
        return (
            moment.tz(req.time, TIME_ZONE).isoWeek() === transactionWeek
            && req.customer_id === request.customer_id
        );
    });
    const totalForTransactionWeek = transactionWeekTransactions.reduce((total, transcation) => {
        return total + transcation.load_amount;
    }, 0);
    return (totalForTransactionWeek + request.load_amount) > WEEKLY_LIMIT;
}

function processFund(line) {
    try {
        const fundRequest = JSON.parse(line);
        fundRequest.load_amount = Number(fundRequest.load_amount.replace(/[^0-9\.]+/g, ""));
        if (isDuplicateRequest(fundRequest)) {
            return;
        }
        if (isDailyLimitExceeded(fundRequest)) {
            processedFundRequest.push({
                id: fundRequest.id,
                customer_id: fundRequest.customer_id,
                accepted: false
            });
            return;
        }
        if (isWeeklyLimitExceeded(fundRequest)) {
            processedFundRequest.push({
                id: fundRequest.id,
                customer_id: fundRequest.customer_id,
                accepted: false
            });
            return;
        }
        successfullyProcessed.push(fundRequest);
        processedFundRequest.push({
            id: fundRequest.id,
            customer_id: fundRequest.customer_id,
            accepted: true
        });
    } catch (err) {
        console.error('Error Parsing JSON', line);
        return {};
    }
}

async function processLineByLine() {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    processFund(line);
  }
  const outputStream = fs.createWriteStream(OUTPUT_FILE, {flags: 'a'});
  processedFundRequest.forEach((request) => {
    outputStream.write(JSON.stringify(request));
    outputStream.write(os.EOL);
  });
  outputStream.end();
}

processLineByLine();