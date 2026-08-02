import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  private readonly usernameInputSelector = '#userName';
  private readonly passwordInputSelector = '#password';
  private readonly loginButtonSelector = '#login';
  private readonly logoutButtonSelector = 'button:has-text("Logout")';
  private readonly userNameLabelSelector = '#userName-value';

  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly userNameLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = this.getUsernameInput();
    this.passwordInput = this.getPasswordInput();
    this.loginButton = this.getLoginButton();
    this.logoutButton = this.getLogoutButton();
    this.userNameLabel = this.getUserNameLabel();
  }

  private getUsernameInput(): Locator {
    return this.page.locator(this.usernameInputSelector);
  }

  private getPasswordInput(): Locator {
    return this.page.locator(this.passwordInputSelector);
  }

  private getLoginButton(): Locator {
    return this.page.locator(this.loginButtonSelector);
  }

  private getLogoutButton(): Locator {
    return this.page.locator(this.logoutButtonSelector);
  }

  private getUserNameLabel(): Locator {
    return this.page.locator(this.userNameLabelSelector);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/\/profile$/i, { timeout: 15000 });
    await expect(this.userNameLabel).toBeVisible({ timeout: 10000 });
  }

  async expectLoggedIn(username: string): Promise<void> {
    await expect(this.userNameLabel).toContainText(username);
    await expect(this.logoutButton).toBeVisible({ timeout: 10000 });
  }

  async logout(): Promise<void> {
    await this.page.goto('/profile');
    await this.page.waitForURL(/\/profile$/i, { timeout: 15000 });
    await expect(this.logoutButton).toBeVisible({ timeout: 10000 });
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login$/i, { timeout: 15000 });
    await expect(this.loginButton).toBeVisible({ timeout: 10000 });
  }
}
