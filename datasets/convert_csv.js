const fs = require('fs')

function convert_csv(data) {
    const rows = data.split(/\r\n|\n/);
    const headers = rows[0].split(',');
    const entries = [];

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex].split(',');
        if (row.length == headers.length) {

            const columns = {};
            for (let columnIndex = 0; columnIndex < headers.length; columnIndex++) {
                columns[headers[columnIndex]] = row[columnIndex];
            }
            entries.push(columns);
        }
    }

    return entries
}

function transform(data) {
    return data.map((entry) => {
        return {
            input: entry['text'],
            isSpam: entry['hamOrSpam'] === 'spam' ? true : false 
        }
    })
}

const csvData = fs.readFileSync('./SMSSpamCollection.csv', 'utf-8')
const convertedData = convert_csv(csvData)
const transformedData = transform(convertedData)

fs.writeFileSync("output.json", JSON.stringify({
    data: transformedData
}))