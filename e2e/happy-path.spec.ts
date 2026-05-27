import { test, expect } from '@playwright/test';

test('hr can log in, add an employee, and see it in the list and insights', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  await page.getByLabel('Email').fill('hr@corp.example');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/employees/);

  await page.getByRole('button', { name: 'Add employee' }).click();

  const dialog = page.getByRole('dialog');
  const uniqueEmail = `e2e+${Date.now()}@example.com`;

  await dialog.getByLabel('Full name').fill('E2E Test Employee');
  await dialog.getByLabel('Email', { exact: true }).fill(uniqueEmail);
  await dialog.getByLabel('Job title').fill('Engineer');
  await dialog.getByLabel('Department').fill('Engineering');
  await dialog.getByLabel('Country code').fill('US');
  await dialog.getByLabel('Currency code').fill('USD');
  await dialog.getByLabel(/salary/i).fill('5000000');
  await dialog.getByLabel('Hire date').fill('2024-01-01');
  await dialog.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByText('E2E Test Employee')).toBeVisible();

  await page.goto('/insights');
  await expect(page.getByText(/total employees/i)).toBeVisible();
});
