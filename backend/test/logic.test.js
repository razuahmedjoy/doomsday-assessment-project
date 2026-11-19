import test from 'node:test';
import assert from 'node:assert/strict';
import { minBundles } from '../src/lib/bundles.js';
import { rewatchOrder, wouldCreateCycle } from '../src/lib/graph.js';

test('minBundles examples from the assessment', () => {
  assert.deepEqual(minBundles([1, 3, 4], 6), [{ size: 3, count: 2 }]);
  assert.deepEqual(minBundles([2, 5], 11), [{ size: 5, count: 1 }, { size: 2, count: 3 }]);
  assert.deepEqual(minBundles([6, 9, 20], 44), [
    { size: 20, count: 1 }, { size: 9, count: 2 }, { size: 6, count: 1 },
  ]);
  assert.equal(minBundles([4, 6], 7), null);
});

// 1 <- 3 <- 4 ; 2 <- 3 ; 5 standalone
const graph = new Map([[3, [1, 2]], [4, [3]]]);

test('rewatchOrder lists prerequisites once, each after its own prerequisites', () => {
  const order = rewatchOrder(graph, 4);
  assert.deepEqual([...order].sort(), [1, 2, 3]);
  assert.equal(order.at(-1), 3);
  assert.deepEqual(rewatchOrder(graph, 5), []);
});

test('wouldCreateCycle', () => {
  assert.equal(wouldCreateCycle(graph, 1, [4]), true); // 4 depends (indirectly) on 1
  assert.equal(wouldCreateCycle(graph, 1, [1]), true); // itself
  assert.equal(wouldCreateCycle(graph, 5, [4]), false);
});
