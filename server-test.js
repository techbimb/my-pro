const http = require('http');
const assert = require('assert');
const { app, transformAndMirrorWord } = require('./server');

// Helper function to make HTTP requestsss
function makeRequest(path, callback) {
    const options = {
        hostname: 'localhost',
        port: 4004,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(JSON.parse(data));
        });
    });

    req.end();
}

// Test /api/health endpoint
makeRequest('/api/health', (data) => {
    try {
        assert.strictEqual(data.status, 'ok');
        console.log('Health endpoint test passed!');
    } catch (error) {
        console.error('Health endpoint test failed:', error.message);
    }
});

// Test /api/mirror endpoint
const testWord = 'fOoBar25';
const expectedTransformedWord = '52RAbOoF';

makeRequest(`/api/mirror?word=${testWord}`, (data) => {
    try {
        assert.strictEqual(data.transformed, expectedTransformedWord);
        console.log('Mirror endpoint test passed!');
    } catch (error) {
        console.error('Mirror endpoint test failed:', error.message);
    }
});

// Test transformAndMirrorWord function
const transformedResult = transformAndMirrorWord(testWord);
try {
    assert.strictEqual(transformedResult, expectedTransformedWord);
    console.log('transformAndMirrorWord function test passed!');
} catch (error) {
    console.error('transformAndMirrorWord function test failed:', error.message);
}
