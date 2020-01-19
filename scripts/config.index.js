#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

function updateCSP(filename) {
    fs.readFile(`${filename}`, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        let result = data;

        // 1. Update service worker loader hash
        const swHash = findSWHash(data);
        result = result.replace(/{{DECKDECKGO_SHA256_SW}}/g, swHash ? swHash : '');

        // 2. Update main script hash
        const mainHash = findMainHash(data);
        result = result.replace(/{{DECKDECKGO_SHA256_MAIN}}/g, mainHash ? mainHash : '');

        fs.writeFile(`${filename}`, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function findSWHash(data) {
    const sw = /(<.?script.*?>)([\s\S]*?)(<\/script>)/gm;

    let m;
    while (m = sw.exec(data)) {
        if (m && m.length >= 3) {
            return `'sha256-${crypto.createHash('sha256').update(m[2]).digest('base64')}'`;
        }
    }

    return undefined;
}

function findMainHash(data) {
    const sw = /(<.?script src.*?>)([\s\S]*?)(<\/script>)/gm;

    let m;
    while (m = sw.exec(data)) {
        if (m && m.length >= 3) {
            return `'sha256-${crypto.createHash('sha256').update(m[2]).digest('base64')}'`;
        }
    }

    return undefined;
}

function findHTMLFiles(dir, files) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            findHTMLFiles(fullPath, files);
        } else if (path.extname(fullPath) === '.html') {
            files.push(fullPath);
        }
    });
}

let htmlFiles = [];
findHTMLFiles('./dist/', htmlFiles);

for (const file of htmlFiles) {
    updateCSP(`./${file}`);
}
