const { assert } = require('chai');

const {
  isQueryMatch,
  hasMixedModifiers
} = require('../src/validation');

describe('Validation', () => {
  describe('isQueryMatch()', () => {
    it('should return true on empty query', () => {
      assert.isTrue(isQueryMatch({ a: 1 }, {}));
      assert.isTrue(isQueryMatch({ a: { b: 1 } }, {}));
      assert.isTrue(isQueryMatch({ a: { b: [{ c: 1 }] } }, {}));
    });

    it('should return false if query does not match', () => {
      assert.isFalse(isQueryMatch({ a: 1 }, { b: 1 }));
      assert.isFalse(isQueryMatch({ a: 1 }, { a: 2 }));
      assert.isFalse(isQueryMatch({ a: { b: 1, c: 1 } }, { b: 1 }));
      assert.isFalse(isQueryMatch({ a: { b: 1, c: 1 } }, { a: { b: 1 } }));
      assert.isFalse(isQueryMatch({ a: { b: [{ c: 1 }] } }, { c: 1 }));
      assert.isFalse(isQueryMatch({ a: { b: [{ c: 1, d: 1 }] } }, { a: { b: [{ c: 1 }] } }));
      assert.isFalse(isQueryMatch({ a: { b: [{ c: 1 }, { d: 1 }] } }, { a: { b: [{ c: 1 }] } }));
      assert.isFalse(isQueryMatch({ a: { b: [{ c: 1 }, { d: 1 }] } }, { a: { b: [{ d: 1 }, { c: 1 }] } }));
    });

    it('should return true if query matches', () => {
      assert.isTrue(isQueryMatch({ a: 1 }, { a: 1 }));
      assert.isTrue(isQueryMatch({ a: { b: 1 } }, { 'a.b': 1 }));
      assert.isTrue(isQueryMatch({ a: { b: 1 } }, { a: { b: 1 } }));
      assert.isTrue(isQueryMatch({ a: { b: 1, c: 1 } }, { 'a.b': 1, 'a.c': 1 }));
      assert.isTrue(isQueryMatch({ a: { b: [{ c: 1 }] } }, { a: { b: [{ c: 1 }] } }));
      assert.isTrue(isQueryMatch({ a: { b: [{ c: 1 }, { d: 1 }] } }, { a: { b: [{ c: 1 }, { d: 1 }] } }));
    });

    describe('Operators', () => {
      it('$gt', () => {
        assert.isTrue(isQueryMatch({ a: 1 }, { $gt: { a: 0 } }));
        assert.isFalse(isQueryMatch({ a: 1 }, { $gt: { a: 1 } }));
      });

      it('$gte', () => {
        assert.isTrue(isQueryMatch({ a: 1 }, { $gte: { a: 1 } }));
        assert.isFalse(isQueryMatch({ a: 1 }, { $gte: { a: 2 } }));
      });

      it('$lt', () => {
        assert.isTrue(isQueryMatch({ a: 1 }, { $lt: { a: 2 } }));
        assert.isFalse(isQueryMatch({ a: 1 }, { $lt: { a: 1 } }));
      });

      it('$lte', () => {
        assert.isTrue(isQueryMatch({ a: 1 }, { $lte: { a: 1 } }));
        assert.isFalse(isQueryMatch({ a: 1 }, { $lte: { a: 0 } }));
      });
    });
  });

  describe('hasMixedModifiers()', () => {
    it('should return false if object does not have mixed modifiers', () => {
      assert.isFalse(hasMixedModifiers({ a: 1 }));
      assert.isFalse(hasMixedModifiers({ $a: 1 }));
      assert.isFalse(hasMixedModifiers({ a: 1, b: 1 }));
      assert.isFalse(hasMixedModifiers({ $a: 1, $b: 1 }));
    });

    it('should return true if object has mixed modifiers', () => {
      assert.isTrue(hasMixedModifiers({ a: 1, $b: 1 }));
    });
  });
});
