# Playwright Assignment

This project contains a production-style Playwright + TypeScript automation suite for:

- UI automation on DemoQA
- API automation on ReqRes
- Page Object Model (POM) structure
- HTML reporting and failure artifacts

## Features

- Playwright with TypeScript
- Page Object Model for maintainability
- Reusable services and utilities
- Headless test execution
- HTML report generation
- Screenshots, traces, and videos on failure
- Book details written to a file after UI validation

## Project Structure

```text
playwright-assignment/
├── src/
│   ├── pages/
│   │   ├── homePage.ts
│   │   ├── loginPage.ts
│   │   └── booksStorePage.ts
│   ├── services/
│   │   └── reqresService.ts
│   └── utils/
│       └── logger.ts
├── tests/
│   ├── ui/
│   │   └── demoqa.spec.ts
│   └── api/
│       └── reqres.spec.ts
├── reports/
│   └── book-details.txt
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- npm

## Installation

From the project root, run:

```bash
npm install
npx playwright install --with-deps chromium firefox webkit
```

## Running the Tests

Run all tests:

```bash
npx playwright test
```

Run UI tests only:

```bash
npx playwright test tests/ui/demoqa.spec.ts
```

Run API tests only:

```bash
npx playwright test tests/api/reqres.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```
Run tests in headless mode:

```bash
npx playwright test --headless

## Reports

HTML report:

```bash
npx playwright show-report playwright-report
```

The test run also generates:

- screenshots on failure
- traces on retry/failure
- videos on failure
- a text file with the selected book details in the reports folder

## Test Coverage

### UI flow

The UI test:

1. Opens the DemoQA home page
2. Navigates to the Book Store Application
3. Opens the login page
4. Logs in using the configured user
5. Validates the logged-in state
6. Searches for "Learning JavaScript Design Patterns"
7. Opens the book details
8. Writes Title, Author, and Publisher to a file
9. Logs out

### API flow

The API test:

1. Creates a user via ReqRes
2. Validates the response status
3. Fetches the created user details
4. Updates the user name and validates the response

## Notes

- The DemoQA credentials can be overridden with environment variables:

```bash
DEMOQA_USERNAME=your_username DEMOQA_PASSWORD=your_password npx playwright test
```

- If the ReqRes service requires an API key in your environment, set:

```bash
REQRES_API_KEY=your_api_key
```

## Author

Playwright Automation Assignment
