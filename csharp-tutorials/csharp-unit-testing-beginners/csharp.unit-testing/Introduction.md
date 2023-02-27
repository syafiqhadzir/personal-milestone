# Unit Testing C# Code - Tutorial for Beginners

## What is Automated Testing?

Is it a replacement for manual testing? Do we really need it? How should I do it?
Should I write unit test first (TDD) or should I code first? I don't know what to test!

Automated testing is the practice of writing code to test our production code,
and then run those tests in an automated fashion.

## Benefits of Automated Testing

why we need to write code to test our production code? Why can't we just run the application,
and see the result?

It is because we must:-

* Test our code frequently, in less time
* Catch bugs before deploying
* Deploy with confidence
* Refactor with assurance
* Focus more on the quality

Refactoring means changing the structure of the code without changing its behaviour.

## Types of Tests

### 1. Unit Test

Tests a unit of an application without its _external_ dependencies

### 2. Integration

Tests the application with its _external_ dependencies

### 3. End-to-End

Drives an application through its UI

## Test Pyramid

(Hardest) E2E ~> Integration ~> Unit Test (Easiest)
: The actual ratio between unit, integration and end-to-end tests depends on your project.
: Favour unit tests to e2e tests. Cover unit test gaps with integration tests. Use e2e tests sparingly.
