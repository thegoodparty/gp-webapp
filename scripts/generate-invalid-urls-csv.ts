const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const inputFile = process.argv[2];
if (!inputFile) {
  console.error('Please provide the input JSON file as the first argument.');
  process.exit(1);
}
const outputFile = process.argv[3] || 'invalid_urls.csv';

try {
  console.log(`Reading JSON from ${inputFile}`);
  const jsonData = fs.readFileSync(inputFile, 'utf8');
  const data = JSON.parse(jsonData);

  const invalidUrls = data.invalidUrls || [];
  const redirectUrls = Object.entries(data.byStatus || {})
    .filter(([status]) => [301, 302, 307, 308].includes(Number(status)))
    .flatMap(([status, urls]) => urls);

  const allProblematicUrls = [...invalidUrls, ...redirectUrls];

  if (allProblematicUrls.length === 0) {
    console.log('No problematic URLs found');
  } else {
    console.log(`Found ${invalidUrls.length} invalid URLs and ${redirectUrls.length} redirect URLs`);

    const csvWriter = createCsvWriter({
      path: outputFile,
      header: [
        {id: 'url', title: 'URL'},
        {id: 'status', title: 'Status'},
        {id: 'duration', title: 'Duration'},
        {id: 'finalUrl', title: 'Final URL'},
        {id: 'finalStatus', title: 'Final Status'},
        {id: 'redirectType', title: 'Redirect Type'}
      ]
    });

    console.log(`Writing to ${outputFile}`);
    csvWriter.writeRecords(allProblematicUrls)
      .then(() => {
        console.log('CSV file written successfully');
      });
  }
} catch (error) {
  console.error('Error:', error.message);
}