import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/homePage.ts';
import { LoginPage } from '../../src/pages/loginPage.ts';
import { BooksStorePage } from '../../src/pages/booksStorePage.ts';
import { Logger } from '../../src/utils/logger.ts';
import { promises as fs } from 'fs';

test.describe('DemoQA UI and API assignment', () => {

  test('User logs in, searches a book, saves details, and logs out', async ({ page }) => {
    const logger = new Logger();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const booksStorePage = new BooksStorePage(page);

    const username = process.env.DEMOQA_USERNAME ?? 'nkarthikraja46';
    const password = process.env.DEMOQA_PASSWORD ?? 'Karthik@3567';
    const outputFilePath = 'reports/book-details.txt';

    await prepareTestData();

    await openBooksStore(homePage, page);

    await loginUser(loginPage, username);

    await searchAndValidateBook(
      booksStorePage,
      page,
      'Learning JavaScript Design Patterns'
    );

    await saveBookDetails(booksStorePage, outputFilePath);

    await logoutUser(loginPage, page);

    logger.info('Test completed successfully');
  });


  async function prepareTestData() {
    await fs.mkdir('reports', { recursive: true });
  }


  async function openBooksStore(homePage: HomePage, page: any) {
    await homePage.open();
    await expect(page).toHaveURL(/demoqa.com\/$/);

    await homePage.navigateToBooksStore();
    await expect(page).toHaveURL(/demoqa.com\/books$/);

    await homePage.openLoginPage();
    await expect(page).toHaveURL(/demoqa.com\/login$/);
  }


  async function loginUser(
    loginPage: LoginPage,
    username: string
  ) {
    await loginPage.login(
      username,
      process.env.DEMOQA_PASSWORD ?? 'Karthik@3567'
    );

    await loginPage.expectLoggedIn(username);
  }


  async function searchAndValidateBook(
    booksStorePage: BooksStorePage,
    page: any,
    bookName: string
  ) {
    await booksStorePage.open();

    await booksStorePage.searchBook(bookName);

    await booksStorePage.expectBookVisible(bookName);

    await booksStorePage.openBookDetails();

    await expect(
      page.locator('#title-wrapper #userName-value')
    ).toContainText(bookName);
  }


  async function saveBookDetails(
    booksStorePage: BooksStorePage,
    outputFilePath: string
  ) {
    await booksStorePage.captureBookDetails(outputFilePath);

    const fileContent = await fs.readFile(
      outputFilePath,
      'utf8'
    );

    expect(fileContent).toContain('Title:');
    expect(fileContent).toContain('Author:');
    expect(fileContent).toContain('Publisher:');
  }


  async function logoutUser(
    loginPage: LoginPage,
    page: any
  ) {
    await loginPage.logout();

    await expect(
      page.locator('#login')
    ).toBeVisible();
  }

});