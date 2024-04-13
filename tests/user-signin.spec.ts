import { test, expect } from '@playwright/test';
import { config } from 'dotenv';
import { chromium, type Browser, type Page } from 'playwright';

config();

let browser: Browser;
let page: Page;

test.beforeAll(async () => {
  browser = await chromium.launch();
});

test.beforeEach(async () => {
  page = await browser.newPage();
  await page.goto(`${process.env.HOST}:${process.env.PORT}`);
});

test.afterEach(async () => {
  await page.close();
});

test.afterAll(async () => {
  await browser.close();
});

test.describe('Login Page', () => {
  test('Successful Login', async () => {
    // 로그인 폼 입력
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', '1234');

    // 제출 버튼 클릭
    await Promise.all([
      page.waitForURL('**/main'),
      page.click('button[type="submit"]', { force: true })
    ]);

    // 로그인 후의 URL을 확인하여 정상적으로 로그인되었는지 확인합니다.
    expect(page.url()).toMatch(/.*\/main\/?/);
  });
});
