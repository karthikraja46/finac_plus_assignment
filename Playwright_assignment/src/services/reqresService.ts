import { APIRequestContext, APIResponse } from '@playwright/test';
import { promises as fs } from 'fs';

export class ReqresService {
  constructor(private readonly request: APIRequestContext) {}

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const apiKey = process.env.REQRES_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    return headers;
  }

  async createUser(name: string, job: string): Promise<{ response: APIResponse; body: any; userId: string }> {
    const response = await this.request.post('https://reqres.in/api/users', {
      data: { name, job },
      headers: this.getHeaders(),
    });

    const body = await response.json();
    const userId = body.id?.toString() ?? '';
    return { response, body, userId };
  }

  async getUser(userId: string): Promise<{ response: APIResponse; body: any }> {
    const response = await this.request.get(`https://reqres.in/api/users/${userId}`, {
      headers: this.getHeaders(),
    });
    const body = await response.json();
    return { response, body };
  }

  async updateUser(userId: string, name: string, job: string): Promise<{ response: APIResponse; body: any }> {
    const response = await this.request.put(`https://reqres.in/api/users/${userId}`, {
      data: { name, job },
      headers: this.getHeaders(),
    });

    const body = await response.json();
    return { response, body };
  }

  async writeBookDetailsToFile(filePath: string, title: string, author: string, publisher: string): Promise<void> {
    const content = [
      `Title: ${title}`,
      `Author: ${author}`,
      `Publisher: ${publisher}`,
      '',
    ].join('\n');

    await fs.writeFile(filePath, content, 'utf8');
  }
}
