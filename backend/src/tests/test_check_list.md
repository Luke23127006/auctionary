# Backend API Test Coverage Checklist

> **Last Updated**: 2025-12-15  
> **Total Routes**: 9 route files  
> **Tested Routes**: 5 route files  
> **Coverage**: 56% (5/9)

## Legend

- ✅ **Tested** - Has comprehensive test coverage
- ⚠️ **Partially Tested** - Some endpoints tested, others missing
- ❌ **Not Tested** - No test file exists

---

## 1. Admin Routes ✅

**File**: [admin.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/admin.route.ts)  
**Test File**: [admin.test.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/tests/admin.test.ts)

| Endpoint                                  | Method | Auth  | Status    |
| ----------------------------------------- | ------ | ----- | --------- |
| `/api/admin/overview`                     | GET    | Admin | ✅ Tested |
| `/api/admin/users`                        | GET    | Admin | ✅ Tested |
| `/api/admin/users/:id/suspend`            | PATCH  | Admin | ✅ Tested |
| `/api/admin/upgrade-requests`             | GET    | Admin | ✅ Tested |
| `/api/admin/upgrade-requests/:id/approve` | PATCH  | Admin | ✅ Tested |
| `/api/admin/upgrade-requests/:id/reject`  | PATCH  | Admin | ✅ Tested |
| `/api/admin/products`                     | GET    | Admin | ✅ Tested |
| `/api/admin/products/:id`                 | DELETE | Admin | ✅ Tested |

**Status**: All endpoints tested ✅

---

## 2. Auth Routes ❌

**File**: [auth.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/auth.route.ts)  
**Test File**: None

| Endpoint                    | Method | Auth     | Status        |
| --------------------------- | ------ | -------- | ------------- |
| `/api/auth/signup`          | POST   | Public   | ❌ Not Tested |
| `/api/auth/login`           | POST   | Public   | ❌ Not Tested |
| `/api/auth/google-login`    | POST   | Public   | ❌ Not Tested |
| `/api/auth/facebook-login`  | POST   | Public   | ❌ Not Tested |
| `/api/auth/refresh`         | POST   | Public   | ❌ Not Tested |
| `/api/auth/logout`          | POST   | Public   | ❌ Not Tested |
| `/api/auth/verify-otp`      | POST   | Public   | ❌ Not Tested |
| `/api/auth/resend-otp`      | POST   | Public   | ❌ Not Tested |
| `/api/auth/forgot-password` | POST   | Public   | ❌ Not Tested |
| `/api/auth/reset-password`  | POST   | Public   | ❌ Not Tested |
| `/api/auth/me`              | GET    | Required | ❌ Not Tested |
| `/api/auth/logout-all`      | POST   | Required | ❌ Not Tested |

**Missing Tests**:

- [ ] POST `/api/auth/signup` - User registration with reCAPTCHA
- [ ] POST `/api/auth/login` - User login with reCAPTCHA
- [ ] POST `/api/auth/google-login` - Google OAuth login
- [ ] POST `/api/auth/facebook-login` - Facebook OAuth login
- [ ] POST `/api/auth/refresh` - Refresh access token
- [ ] POST `/api/auth/logout` - Logout user
- [ ] POST `/api/auth/verify-otp` - Email verification
- [ ] POST `/api/auth/resend-otp` - Resend OTP
- [ ] POST `/api/auth/forgot-password` - Request password reset
- [ ] POST `/api/auth/reset-password` - Reset password with token
- [ ] GET `/api/auth/me` - Get current user info
- [ ] POST `/api/auth/logout-all` - Logout from all devices

---

## 3. Category Routes ✅

**File**: [category.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/category.route.ts)  
**Test File**: [category.test.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/tests/category.test.ts)

| Endpoint                    | Method | Auth       | Status    |
| --------------------------- | ------ | ---------- | --------- |
| `/api/categories/`          | GET    | Public     | ✅ Tested |
| `/api/categories/admin`     | GET    | Permission | ✅ Tested |
| `/api/categories/admin/:id` | GET    | Permission | ✅ Tested |
| `/api/categories/admin`     | POST   | Permission | ✅ Tested |
| `/api/categories/admin/:id` | PATCH  | Permission | ✅ Tested |
| `/api/categories/admin/:id` | DELETE | Permission | ✅ Tested |

**Status**: All endpoints tested ✅

---

## 4. Home Routes ❌

**File**: [home.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/home.route.ts)  
**Test File**: None

| Endpoint             | Method | Auth   | Status        |
| -------------------- | ------ | ------ | ------------- |
| `/api/home/sections` | GET    | Public | ❌ Not Tested |

**Missing Tests**:

- [ ] GET `/api/home/sections` - Get home page sections (ending soon, most active, highest price)

---

## 5. Product Routes ✅

**File**: [product.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/product.route.ts)  
**Test File**: [product.test.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/tests/product.test.ts)

| Endpoint                         | Method | Auth       | Status    |
| -------------------------------- | ------ | ---------- | --------- |
| `/api/products/`                 | GET    | Public     | ✅ Tested |
| `/api/products/`                 | POST   | Required   | ✅ Tested |
| `/api/products/:id`              | GET    | Public     | ✅ Tested |
| `/api/products/:id/bids`         | GET    | Public     | ✅ Tested |
| `/api/products/:id/questions`    | GET    | Public     | ✅ Tested |
| `/api/products/:id/bid`          | POST   | Permission | ✅ Tested |
| `/api/products/:id/descriptions` | POST   | Permission | ✅ Tested |
| `/api/products/:id/questions`    | POST   | Permission | ✅ Tested |
| `/api/products/:id/answers`      | POST   | Permission | ✅ Tested |

**Status**: All endpoints tested ✅

---

## 6. Seller Routes ❌

**File**: [seller.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/seller.route.ts)  
**Test File**: None

| Endpoint                | Method | Auth     | Status        |
| ----------------------- | ------ | -------- | ------------- |
| `/api/seller/dashboard` | GET    | Required | ❌ Not Tested |

**Missing Tests**:

- [ ] GET `/api/seller/dashboard` - Get seller dashboard data

---

## 7. Upgrade Request Routes ✅

**File**: [upgradeRequest.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/upgradeRequest.route.ts)  
**Test File**: [upgradeRequest.test.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/tests/upgradeRequest.test.ts)

| Endpoint                            | Method | Auth     | Status    |
| ----------------------------------- | ------ | -------- | --------- |
| `/api/users/upgrade-request`        | POST   | Required | ✅ Tested |
| `/api/users/upgrade-request/status` | GET    | Required | ✅ Tested |
| `/api/users/upgrade-request/cancel` | PATCH  | Required | ✅ Tested |

**Status**: All endpoints tested ✅

---

## 8. User Routes ✅ (New)

**File**: [user.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/user.route.ts)  
**Test File**: [user.test.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/tests/user.test.ts)

| Endpoint                     | Method | Auth     | Status        |
| ---------------------------- | ------ | -------- | ------------- |
| `/api/users/me/stats`        | GET    | Required | ❌ Not Tested |
| `/api/users/me/bids`         | GET    | Required | ❌ Not Tested |
| `/api/users/me/won-auctions` | GET    | Required | ❌ Not Tested |
| `/api/users/me/profile`      | PATCH  | Required | ❌ Not Tested |
| `/api/users/me/email`        | PATCH  | Required | ❌ Not Tested |
| `/api/users/me/password`     | PATCH  | Required | ❌ Not Tested |

**Missing Tests**:

- [ ] GET `/api/users/me/stats` - Get user statistics
- [ ] GET `/api/users/me/bids` - Get user's active bids
- [ ] GET `/api/users/me/won-auctions` - Get user's won auctions
- [ ] PATCH `/api/users/me/profile` - Update user profile
- [ ] PATCH `/api/users/me/email` - Update user email
- [ ] PATCH `/api/users/me/password` - Change user password

> **Note**: The current `user.test.ts` was created for admin routes testing. These user-specific routes need a separate test file.

---

## 9. Watchlist Routes ❌

**File**: [watchlist.route.ts](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/api/routes/watchlist.route.ts)  
**Test File**: None

| Endpoint                    | Method | Auth     | Status        |
| --------------------------- | ------ | -------- | ------------- |
| `/api/watchlist/`           | GET    | Required | ❌ Not Tested |
| `/api/watchlist/`           | POST   | Required | ❌ Not Tested |
| `/api/watchlist/:productId` | DELETE | Required | ❌ Not Tested |

**Missing Tests**:

- [ ] GET `/api/watchlist/` - Get user's watchlist
- [ ] POST `/api/watchlist/` - Add product to watchlist
- [ ] DELETE `/api/watchlist/:productId` - Remove product from watchlist

---

## Summary Statistics

### Overall Coverage

- **Total Endpoints**: 52
- **Tested Endpoints**: 27
- **Not Tested Endpoints**: 25
- **Coverage Percentage**: 52%

### By Route File

| Route File              | Endpoints | Tested | Coverage |
| ----------------------- | --------- | ------ | -------- |
| admin.route.ts          | 8         | 8      | 100%     |
| auth.route.ts           | 12        | 0      | 0%       |
| category.route.ts       | 6         | 6      | 100%     |
| home.route.ts           | 1         | 0      | 0%       |
| product.route.ts        | 9         | 9      | 100%     |
| seller.route.ts         | 1         | 0      | 0%       |
| upgradeRequest.route.ts | 3         | 3      | 100%     |
| user.route.ts           | 6         | 0      | 0%       |
| watchlist.route.ts      | 3         | 0      | 0%       |

---

## Priority Test Files to Create

### High Priority 🔴

1. **auth.test.ts** - Authentication is critical (12 endpoints)
2. **user.test.ts** - User profile management (6 endpoints)
3. **watchlist.test.ts** - User feature (3 endpoints)

### Medium Priority 🟡

4. **home.test.ts** - Public-facing feature (1 endpoint)
5. **seller.test.ts** - Seller dashboard (1 endpoint)

### Low Priority 🟢

---

## Notes

- The `user.test.ts` file currently contains admin route tests, not user route tests
- Consider renaming current `user.test.ts` to `admin-extended.test.ts` or merging with `admin.test.ts`
- Auth routes testing will require special handling for reCAPTCHA middleware
- Product creation tests require multipart form data handling (already implemented)
