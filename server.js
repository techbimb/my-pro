const express = require('express');
const app = express();
const port = 4004;

// Commented out built-in JSON parsing middleware
// app.use(express.json());

// Custom Parsing middleware
const customJsonParser = (req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
        next();
      } catch (error) {
        res.status(400).json({ message: 'Invalid JSON payload' });
      }
    });
  } else {
    next();
  }
};

// Apply custom middleware
app.use(customJsonParser);


// Health endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: "ok" });
});

// Mirror endpoint
app.get('/api/mirror', (req, res) => {
    const { word } = req.query;

    if (!word) {
        return res.status(400).json({ error: "Missing 'word' query parameter" });
    }

    const transformedWord = transformAndMirrorWord(word);

    res.json({ transformed: transformedWord });
});

// Function to transform and mirror the word
function transformAndMirrorWord(word) {
    const transformed = word.split('').map(char => {
        if (char === char.toLowerCase()) {
            return char.toUpperCase();
        } else if (char === char.toUpperCase()) {
            return char.toLowerCase();
        } else {
            return char;
        }
    }).reverse().join('');

    return transformed;
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = {
    app,
    transformAndMirrorWord,
    
};
