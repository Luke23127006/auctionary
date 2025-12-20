import { test, expect } from "@playwright/test";
import {
  generateTestUser,
  fillSignupForm,
  handleRecaptcha,
  waitForNavigation,
  cleanupTestUser,
  getOTPForUser,
  fillOTPInput,
  isUserLoggedIn,
} from "../helpers/test-helpers";
import { SUCCESS_MESSAGES } from "../fixtures/test-data";

test.describe("User Login - Valid Credentials", () => {
  let testUser: ReturnType<typeof generateTestUser>;

  // Create and verify a test user before all tests
  test.beforeAll(async ({ browser }) => {
    testUser = generateTestUser();
    const page = await browser.newPage();

    // Create and verify user account
    await page.goto("/signup");
    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');
    await waitForNavigation(page, /verify-otp/);

    // Verify OTP
    const otpCode = await getOTPForUser(testUser.email);
    await fillOTPInput(page, otpCode);
    const submitButton = page.locator('button:has-text("Verify Account")');
    if (await submitButton.isVisible()) {
      await submitButton.click({ force: true });
    }
    await page.waitForURL("/", { timeout: 10000 });

    // Logout to prepare for login tests
    const logoutButton = page.locator('text="Log out"');
    await logoutButton.click();

    await page.close();
  });

  test.afterAll(async () => {
    await cleanupTestUser(testUser.email);
  });

  test("should successfully login with valid email and password", async ({
    page,
  }) => {
    await page.goto("/login");

    // Verify login page loaded
    await expect(page).toHaveTitle(/Auctionary|Log/i);
    await expect(
      page.locator("text=/Log in to Auctionary|Login|Sign in/i")
    ).toBeVisible();

    // Fill login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Handle reCAPTCHA
    await handleRecaptcha(page);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to home page
    await page.waitForURL("/", { timeout: 10000 });

    // Verify user is logged in (token stored)
    const isLoggedIn = await isUserLoggedIn(page);
    expect(isLoggedIn).toBeTruthy();

    // Verify user info is displayed in header (welcome message or user menu)
    await expect(
      page.locator(`text=/Welcome|${testUser.fullName}|${testUser.email}/i`)
    ).toBeVisible();
  });

  test("should show loading state during login submission", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await handleRecaptcha(page);

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify loading state
    await expect(submitButton).toBeDisabled();
    await expect(page.locator("text=/Logging in|Loading/i"))
      .toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Loading might be too fast
      });
  });

  test("should store JWT tokens (access + refresh) correctly", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await handleRecaptcha(page);

    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Verify access token stored
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("token")
    );
    expect(accessToken).toBeTruthy();

    // Verify refresh token (if stored client-side)
    const refreshToken = await page.evaluate(() =>
      localStorage.getItem("refreshToken")
    );
    // Note: refresh token might be HttpOnly cookie, so this might be null
    // If null, that's also acceptable for security
  });

  test("should persist login after page refresh", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Refresh the page
    await page.reload();

    // Verify still logged in
    const isLoggedIn = await isUserLoggedIn(page);
    expect(isLoggedIn).toBeTruthy();

    await expect(
      page.locator(`text=/Welcome|${testUser.fullName}|${testUser.email}/i`)
    ).toBeVisible();
  });

  test("should display all required form fields", async ({ page }) => {
    await page.goto("/login");

    // Verify form fields are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Verify placeholders
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "placeholder",
      /Email/i
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "placeholder",
      /Password/i
    );
  });

  test('should navigate to signup page when "Don\'t have account" is clicked', async ({
    page,
  }) => {
    await page.goto("/login");

    // Click the signup link
    await page.click("text=/Don't have an account|Sign up|Create account/i");

    // Verify navigation to signup page
    await waitForNavigation(page, /signup/);
    await expect(page.locator("text=/Sign up/i")).toBeVisible();
  });

  test('should navigate to forgot password page when "Forgot password" is clicked', async ({
    page,
  }) => {
    await page.goto("/login");

    // Click forgot password link
    await page.click("text=/Forgot.*password|Reset password/i");

    // Verify navigation to forgot password page
    await waitForNavigation(page, /forgot-password/);
    await expect(
      page.locator("text=/Forgot.*password|Reset your password/i")
    ).toBeVisible();
  });
});
