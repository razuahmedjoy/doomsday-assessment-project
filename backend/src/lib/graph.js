// prereqsOf: Map<movieId, movieId[]> — direct prerequisites of each movie.

// True if giving `id` the prerequisites `newPrereqs` would create a cycle,
// i.e. `id` is already one of their (direct or indirect) prerequisites.
export function wouldCreateCycle(prereqsOf, id, newPrereqs) {
  const seenSet = new Set();
  const stack = [...newPrereqs];

  while (stack.length) {

    const current = stack.pop();

    if (current === id){
      return true;
    }
    if (seenSet.has(current)){
      continue;
    }

    seenSet.add(current);
    stack.push(...(prereqsOf.get(current) ?? []));
  }
  return false;
}

// All direct and indirect prerequisites of `targetId` (target excluded),
// each once, every movie placed after its own prerequisites (DFS post-order).
// Assumes the graph has no cycles, which the cycle check guarantees.
export function rewatchOrder(prereqsOf, targetId) {
  const order = [];
  const seenSet = new Set([targetId]);

  const visit = (id) => {

    for (const prereq of prereqsOf.get(id) ?? []) {
      if (seenSet.has(prereq)){
        continue;
      };

      seenSet.add(prereq);
      visit(prereq);
      order.push(prereq);
    }
  };
  
  visit(targetId);
  return order;
}
