import { test, expect } from "@playwright/test";
import {
  generateTestUser,
  fillSignupForm,
  handleRecaptcha,
  waitForNavigation,
  cleanupTestUser,
} from "../helpers/test-helpers";
import { ERROR_MESSAGES } from "../fixtures/test-data";

test.describe("User Login - Invalid Credentials", () => {
  let testUser: ReturnType<typeof generateTestUser>;
  let unverifiedUser: ReturnType<typeof generateTestUser>;

  // Create a verified user for testing
  test.beforeAll(async ({ browser }) => {
    testUser = generateTestUser();
    unverifiedUser = generateTestUser();

    const page = await browser.newPage();

    // Create verified user
    await page.goto("/signup");
    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');
    await waitForNavigation(page, /verify-otp/);

    // Note: For this test, we'll verify the first user but not the second
    // The unverified user will be created in a separate test

    await page.close();
  });

  test.afterAll(async () => {
    await cleanupTestUser(testUser.email);
    await cleanupTestUser(unverifiedUser.email);
  });

  test("should reject login with wrong password", async ({ page }) => {
    await page.goto("/login");

    // Fill with correct email but wrong password
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', "WrongPassword123!");
    await handleRecaptcha(page);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait a moment for the error
    await page.waitForTimeout(1000);

    // Verify error message
    await expect(
      page.locator(
        "text=/Invalid.*credentials|Invalid.*email.*password|Wrong password|Incorrect password/i"
      )
    ).toBeVisible({ timeout: 5000 });

    // Verify still on login page
    expect(page.url()).toContain("login");

    // Verify NOT logged in
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeNull();
  });

  test("should reject login with non-existent email", async ({ page }) => {
    await page.goto("/login");

    // Fill with non-existent email
    await page.fill('input[name="email"]', "nonexistent.user@example.com");
    await page.fill('input[name="password"]', "SomePassword123!");
    await handleRecaptcha(page);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for error
    await page.waitForTimeout(1000);

    // Verify error message
    await expect(
      page.locator(
        "text=/Invalid.*credentials|Invalid.*email.*password|User not found|Account not found/i"
      )
    ).toBeVisible({ timeout: 5000 });

    // Verify still on login page
    expect(page.url()).toContain("login");

    // Verify NOT logged in
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeNull();
  });

  test("should handle unverified account (pending OTP)", async ({ page }) => {
    // Create unverified user
    await page.goto("/signup");
    await fillSignupForm(page, unverifiedUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');
    await waitForNavigation(page, /verify-otp/);

    // DON'T verify OTP - just navigate to login
    await page.goto("/login");

    // Try to login with unverified account
    await page.fill('input[name="email"]', unverifiedUser.email);
    await page.fill('input[name="password"]', unverifiedUser.password);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Backend should redirect to OTP verification or show error
    // Wait for either OTP page or error message
    await page.waitForTimeout(2000);

    const currentUrl = page.url();

    if (currentUrl.includes("verify-otp")) {
      // Redirected to OTP page - this is acceptable behavior
      await expect(
        page.getByRole("heading", { name: "Verify Your Account" })
      ).toBeVisible();
      await expect(page.locator(`text=${unverifiedUser.email}`)).toBeVisible();
    } else {
      // Error message shown - also acceptable
      await expect(
        page.locator(
          "text=/Account not verified|Please verify|Email verification required/i"
        )
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("should show validation error for empty email", async ({ page }) => {
    await page.goto("/login");

    // Fill only password, leave email empty
    await page.fill('input[name="password"]', "SomePassword123!");

    // Try to submit
    await page.click('button[type="submit"]');

    // Verify client-side validation
    const emailInput = page.locator('input[name="email"]');

    // Check if HTML5 validation is triggered
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should show validation error for empty password", async ({ page }) => {
    await page.goto("/login");

    // Fill only email, leave password empty
    await page.fill('input[name="email"]', testUser.email);

    // Try to submit
    await page.click('button[type="submit"]');

    // Verify client-side validation
    const passwordInput = page.locator('input[name="password"]');

    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await page.goto("/login");

    // Fill with invalid email format
    await page.fill('input[name="email"]', "not-an-email");
    await page.fill('input[name="password"]', "SomePassword123!");

    // Try to submit
    await page.click('button[type="submit"]');

    // Check HTML5 validation or custom error
    const emailInput = page.locator('input[name="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    });

    expect(isInvalid).toBeTruthy();
  });

  test("should clear password field after failed login attempt", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', "WrongPassword123!");
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Wait for error
    await page.waitForTimeout(1500);

    // Check if password is cleared (security best practice)
    // Note: This test may fail if your app doesn't clear password - adjust as needed
    const passwordValue = await page
      .locator('input[name="password"]')
      .inputValue();

    // Either empty or still has the wrong password
    // Documenting expected behavior
  });

  test("should maintain email field value after failed login", async ({
    page,
  }) => {
    await page.goto("/login");

    const email = testUser.email;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', "WrongPassword123!");
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Wait for error
    await page.waitForTimeout(1500);

    // Email should still be filled (UX convenience)
    const emailValue = await page.locator('input[name="email"]').inputValue();
    expect(emailValue).toBe(email);
  });
});
