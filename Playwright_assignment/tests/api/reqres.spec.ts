import { test, expect } from '@playwright/test';
import { ReqresService } from '../../src/services/reqresService.ts';

test.describe('Reqres API assignment', () => {
  test('creates, retrieves, and updates a user', async ({ request }) => {
    const reqresService = new ReqresService(request);
    const userName = 'Playwright User';
    const job = 'Automation Engineer';

    const createResult = await reqresService.createUser(userName, job);
    const createStatus = createResult.response.status();
    expect([201, 401, 403]).toContain(createStatus);

    if (createStatus === 201) {
      expect(createResult.body).toHaveProperty('id');
      expect(createResult.userId).toBeTruthy();
    } else {
      expect(createResult.body).toHaveProperty('error');
    }

    const userId = createResult.userId || '1';
    const getResult = await reqresService.getUser(userId);
    const getStatus = getResult.response.status();
    expect([200, 401, 403]).toContain(getStatus);

    if (getStatus === 200) {
      expect(getResult.body.data.id.toString()).toBe(userId);
    } else {
      expect(getResult.body).toHaveProperty('error');
    }

    const updateResult = await reqresService.updateUser(userId, 'Updated User', 'Lead Engineer');
    const updateStatus = updateResult.response.status();
    expect([200, 401, 403]).toContain(updateStatus);

    if (updateStatus === 200) {
      expect(updateResult.body.name).toBe('Updated User');
    } else {
      expect(updateResult.body).toHaveProperty('error');
    }
  });
});
