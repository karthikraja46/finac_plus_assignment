import { Page, Locator } from '@playwright/test';

export class HomePage {
  private readonly booksStoreLinkSelector = 'a[href="/books"]';
  private readonly loginLinkSelector = 'a[href="/login"]';

  readonly page: Page;
  readonly booksStoreLink: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.booksStoreLink = this.getBooksStoreLink();
    this.loginLink = this.getLoginLink();
  }

  private getBooksStoreLink(): Locator {
    return this.page.locator(this.booksStoreLinkSelector);
  }

  private getLoginLink(): Locator {
    return this.page.locator(this.loginLinkSelector);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToBooksStore(): Promise<void> {
    await this.booksStoreLink.click();
    await this.page.waitForURL(/\/books$/i);
  }

  async openLoginPage(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForURL(/\/login$/i);
  }
}
