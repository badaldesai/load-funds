const fs = require('fs');
const readline = require('readline');
const assert = require('assert');

const original_output_file = 'output.txt';
const generated_output_file = 'generatedOutput.txt';

async function compareJSONFiles() {
    const outputFileStream = readline.createInterface({
        input: fs.createReadStream(original_output_file),
        crlfDelay: Infinity
    });
    const output = [];
    const generatedOutput = [];
    for await (const line of outputFileStream) {
        output.push(JSON.parse(line));
    }
    const generatedOutputFileStream = readline.createInterface({
        input: fs.createReadStream(generated_output_file),
        crlfDelay: Infinity
    });

    for await (const line of generatedOutputFileStream) {
        generatedOutput.push(JSON.parse(line));
    }

    for (let i =0; i<output.length; i++) {
        assert.deepEqual(generatedOutput[i], output[i], `${JSON.stringify(generatedOutput[i])} is not equal to ${JSON.stringify(output[i])}`);
    }
}

compareJSONFiles();