const fs = require('fs');
const csv = require('csv-parser');

/**
 * Parses CSV and skips the header row safely.
 */
function parseCSVToArray(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let isFirstRow = true; // <--- Skip header row

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (data) => {
        if (isFirstRow) {
          // First row = header row → skip it
          isFirstRow = false;
          return;
        }

        // Normalize values and trim whitespace
        const normalized = {};
        for (const key in data) {
          normalized[key] = data[key]?.trim() ?? "";
        }

        rows.push(normalized);
      })
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}


/**
 * Converts an array of objects to a CSV string.
 */
function arrayToCSV(rows) {
  if (!rows || rows.length === 0) return '';

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];

  for (const row of rows) {
    const line = headers
      .map((h) => {
        let val = row[h] ?? '';
        val = String(val).replace(/"/g, '""');
        return val.includes(',') ? `"${val}"` : val;
      })
      .join(',');

    lines.push(line);
  }

  return lines.join('\n');
}

module.exports = { parseCSVToArray, arrayToCSV };
