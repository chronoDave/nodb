const fs = require('fs');

const test = require('tape');

const { setup } = require('../_utils');

test('[persist] should throw error if called memory mode', t => {
  const { db } = setup();

  try {
    db.persist();
    t.fail('expected to throw');
  } catch (err) {
    t.pass('throws');
  }

  t.end();
});

test('[persist] should persist data', t => {
  const { db, file } = setup({ root: __dirname });

  db.data = {
    1: { _id: 1 },
    2: { _id: 2 },
    3: { _id: 3 }
  };
  db.persist();

  const data = fs.readFileSync(file, 'utf-8');

  t.strictEqual(Object.keys(db.data).length, data.split('\n').length);

  fs.unlinkSync(file);

  t.end();
});

test('[persist] should throw if data contains corrupt data', t => {
  const { db, file } = setup({ strict: true, root: __dirname });

  db.data = {
    1: { _id: 1, $deleted: true },
    2: { _id: 2 },
    3: null
  };

  try {
    db.persist();
    t.fail('expected to throw');
  } catch (err) {
    t.pass('throws');
  }

  fs.unlinkSync(file);

  t.end();
});
