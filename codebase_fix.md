# Codebase Fix Plan

- [x] Fix auth middleware to return the actual user object (and avoid the wasted DB fetch).
- [x] Wire product update/delete routes and export delete controller; ensure API completeness.
- [x] Return correct status/body for delete (no JSON body with 204).
- [x] Fix product category enum typo (`lightning` -> `lighting`) and plan data migration if needed.
- [x] Handle DB connection failures so the server doesn't start in a bad state.
- [x] Add a basic test script or placeholder to enable automated checks.
