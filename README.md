# load-funds
Load funds into accounts

#Challenge

In finance, it's common for accounts to have so-called "velocity limits". In this task, you'll write a program that accepts or declines attempts to load funds into customers' accounts in real-time.

Each attempt to load funds will come as a single-line JSON payload, structured as follows:
```
{
  "id": "1234",
  "customer_id": "1234",
  "load_amount": "$123.45",
  "time": "2018-01-01T00:00:00Z"
}
```
Each customer is subject to three limits:

A maximum of $5,000 can be loaded per day
A maximum of $20,000 can be loaded per week
A maximum of 3 loads can be performed per day, regardless of amount
As such, a user attempting to load $3,000 twice in one day would be declined on the second attempt, as would a user attempting to load $400 four times in a day.

For each load attempt, you should return a JSON response indicating whether the fund load was accepted based on the user's activity, with the structure:

```
{ "id": "1234", "customer_id": "1234", "accepted": true }
```

You can assume that the input arrives in ascending chronological order and that if a load ID is observed more than once for a particular user, all but the first instance can be ignored. Each day is considered to end at midnight UTC, and weeks start on Monday (i.e. one second after 23:59:59 on Sunday.


#Solution:

## Requirements
To run this Solution, you need Node install with version 12.0 or above.
To install node and npm, visit [here](https://nodejs.org/en/download/)

## Clone the repo
```
git clone https://github.com/badaldesai/load-funds.git
```

## Install dependencies
```
npm install
```

## Run the program
```
node index.js
```

Above will run the program and create `generatedOutput.txt` as output file. If there is already a file name `generatedOutput.txt`, please delete it.

## Test

To test if every line matches output, we can run following:
```
node comparator.js
```