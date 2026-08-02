import { Page, Locator, expect } from '@playwright/test';
import { promises as fs } from 'fs';

export class BooksStorePage {
  private readonly searchBoxSelector = '#searchBox';
  private readonly bookLinkSelector = 'a[href*="/books?search="]';
  private readonly bookTitleSelector = '#title-wrapper #userName-value';
  private readonly bookAuthorSelector = '#author-wrapper #userName-value';
  private readonly bookPublisherSelector = '#publisher-wrapper #userName-value';

  readonly page: Page;
  readonly searchBox: Locator;
  readonly bookLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = this.getSearchBox();
    this.bookLink = this.getBookLink();
  }

  private getSearchBox(): Locator {
    return this.page.locator(this.searchBoxSelector);
  }

  private getBookLink(): Locator {
    return this.page.locator(this.bookLinkSelector).first();
  }

  async open(): Promise<void> {
    await this.page.goto('/books');
    await this.page.waitForLoadState('networkidle');
  }

  async searchBook(title: string): Promise<void> {
    await this.searchBox.fill(title);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async openBookDetails(): Promise<void> {
    await this.bookLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectBookVisible(title: string): Promise<void> {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async captureBookDetails(outputFilePath: string): Promise<void> {
    await expect(this.page.locator(this.bookTitleSelector)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.bookAuthorSelector)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.bookPublisherSelector)).toBeVisible({ timeout: 10000 });

    const title = await this.page.locator(this.bookTitleSelector).textContent();
    const author = await this.page.locator(this.bookAuthorSelector).textContent();
    const publisher = await this.page.locator(this.bookPublisherSelector).textContent();

    const details = [
      `Title: ${title?.trim() ?? 'N/A'}`,
      `Author: ${author?.trim() ?? 'N/A'}`,
      `Publisher: ${publisher?.trim() ?? 'N/A'}`,
    ].join('\n');

    await fs.writeFile(outputFilePath, details, 'utf8');
  }
}
