//@ts-check
const fs = require('fs')
const bplist = require('bplist-creator');

const buffer = bplist({
  key1: [1, 2, 3],
  test: 'hello world',
});

fs.writeFileSync('public/example.bplist', buffer);
