# Bug Log: User Logout After Place Bid (2025-12-08)

## 🐛 Bug Description

**Symptom:** After a user successfully places a bid, refreshing the page results in an automatic logout.

**Environment:**

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript + PostgreSQL
- Authentication: JWT tokens stored in localStorage

---

## 🔍 Root Cause Analysis

### **Main Bug: Multiple Cascading Issues**

#### **1. Backend Service Bug - Missing Permissions Field**

**File:** `backend/src/repositories/user.repository.ts`

**Problem:**

```typescript
// ❌ INCORRECT CODE (Initial)
export const findByIdWithRoles = async (userId: number) => {
  const user = await db("users").where({ id: userId }).first();
  if (!user) return null;

  const roles = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.role_id")
    .where({ user_id: userId })
    .select("roles.name");

  return {
    ...user,
    usersRoles: roles.map((r) => ({ roles: { name: r.name } })),
    // ❌ MISSING usersPermissions - Permissions not fetched!
  };
};
```

**File:** `backend/src/services/auth.service.ts` (Line 356)

```typescript
// ❌ INCORRECT CODE
const permissions = user.usersPermissions.map((up: any) => up.permissions.name);
// ↑ usersPermissions = undefined → .map() crash!
```

**Result:**

- `/auth/me` API crashes with error: `Cannot read properties of undefined (reading 'map')`
- Backend returns **500 Internal Server Error**

---

#### **2. Database Schema Misunderstanding**

**Problem:** Code queries the wrong table - attempts to query `users_permissions` but this table **DOES NOT EXIST** in the database!

**Database Schema (from db.sql):**

```
User → users_roles → roles → roles_permissions → permissions
```

**Existing tables:**

- ✅ `users_roles` - Many-to-many between users and roles
- ✅ `roles_permissions` - Many-to-many between roles and permissions
- ❌ `users_permissions` - **DOES NOT EXIST**

**Permissions are assigned to ROLES, not directly to USERS!**

---

#### **3. Frontend Error Handling Bug**

**File:** `frontend/src/services/apiClient.ts`

**Problem 1: Incorrect error message parsing order**

```typescript
// ❌ INCORRECT CODE (Initial)
throw new Error(errorData?.error || errorData?.message || "API request failed");
// ↑ Retrieves error CODE instead of message
```

**Backend error format:**

```json
{
  "success": false,
  "error": "INTERNAL_SERVER_ERROR", // ← Error CODE
  "message": "Something went wrong" // ← Human-readable message
}
```

**Problem 2: Not handling error response in success path**

```typescript
// ❌ INCORRECT CODE (Initial)
const jsonResponse = await response.json();
if (jsonResponse.success) {
  return jsonResponse.data; // ✅ OK
}
return jsonResponse; // ❌ Does not throw an error if success: false
```

**Result:**

- Error message displays "INTERNAL_SERVER_ERROR" instead of the actual message
- Frontend returns `undefined` instead of throwing an error → Code calls `.map()` on undefined → crash

---

#### **4. Frontend AuthContext Bug - Logout On Server Error**

**File:** `frontend/src/contexts/AuthContext.tsx`

**Problem:**

```typescript
// ❌ INCORRECT CODE (Initial)
useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = await authService.getMe();
        setUser(user);
      } catch (error) {
        console.error("Token verification failed:", error);
        authService.logout(); // ❌ REMOVES TOKEN for ALL errors (including 500)
        setUser(null);
      }
    }
    setIsLoading(false);
  };
  verifyUser();
}, []);
```

**Result:**

- When `/auth/me` returns 500 (server error)
- AuthContext calls `logout()` → deletes token
- User is logged out even though the token is valid!

---

#### **5. Parameter Order Bug (Previously fixed)**

**File:** `backend/src/services/bid.service.ts`

**Problem:**

```typescript
// ❌ Original signature
export const placeBid = async (
  userId: number,      // ← Incorrect order
  productId: number,
  amount: number
)

// Controller call:
bidService.placeBid(productId, userId, amount);
// → Passed incorrectly: productId=4, userId=12 → Service receives them reversed!
```

**Result:**

- `bidder_id = 4` (which was actually productId) does not exist in the `users` table
- Foreign key constraint error
- However, this was fixed previously → Not the main cause of the logout bug

---

## 🔄 Error Flow

```
1. User places bid
   ↓
2. Bid successful → Page refresh
   ↓
3. AuthContext verifies token → calls /auth/me
   ↓
4. Backend: findByIdWithRoles() does not fetch permissions
   ↓
5. Backend: auth.service.ts attempts to .map() on undefined
   ↓ CRASH!
6. Backend returns 500 Internal Server Error
   ↓
7. Frontend: apiClient parses error message incorrectly
   ↓
8. Frontend: AuthContext catches error → calls logout()
   ↓
9. localStorage.removeItem("token")
   ↓
10. User is logged out! ❌
```

---

## ✅ Applied Fixes

### **Fix 1: Backend Repository - Fetch Permissions Correctly**

**File:** `backend/src/repositories/user.repository.ts`

```typescript
// ✅ CORRECT CODE
export const findByIdWithRoles = async (userId: number) => {
  const user = await db("users").where({ id: userId }).first();
  if (!user) return null;

  // Get user's roles
  const roles = await db("users_roles")
    .join("roles", "users_roles.role_id", "roles.role_id")
    .where({ user_id: userId })
    .select("roles.name", "roles.role_id");

  // ✅ Get permissions from user's roles (via roles_permissions)
  const permissions = await db("users_roles")
    .join(
      "roles_permissions",
      "users_roles.role_id",
      "roles_permissions.role_id"
    )
    .join(
      "permissions",
      "roles_permissions.permission_id",
      "permissions.permission_id"
    )
    .where({ user_id: userId })
    .select("permissions.name")
    .distinct();

  return {
    ...user,
    usersRoles: roles.map((r) => ({ roles: { name: r.name } })),
    usersPermissions: permissions.map((p) => ({
      permissions: { name: p.name },
    })),
  };
};
```

**Explanation:**

- Queries the correct schema: `users_roles → roles_permissions → permissions`
- Does not query the `users_permissions` table (which does not exist)
- Always returns `usersPermissions` (can be an empty array)

---

### **Fix 2: Backend Service - Add Safety Check**

**File:** `backend/src/services/auth.service.ts`

```typescript
// ✅ CORRECT CODE
const mappedUser = mapUserToResponse(user)!;
// @ts-ignore
const roles = user.usersRoles?.map((ur: any) => ur.roles.name) || [];
// @ts-ignore
const permissions =
  user.usersPermissions?.map((up: any) => up.permissions.name) || [];
// ↑ Added optional chaining + fallback to an empty array
```

---

### **Fix 3: Frontend apiClient - Parse Error Correctly**

**File:** `frontend/src/services/apiClient.ts`

```typescript
// ✅ CORRECT CODE - Parse error message
if (!response.ok) {
  let errorData: any;
  try {
    errorData = await response.json();
  } catch (e) {
    throw new Error(
      response.statusText || `HTTP error! status: ${response.status}`
    );
  }

  // ✅ Get MESSAGE first (human-readable), fallback to error code
  throw new Error(
    errorData?.message || errorData?.error || "API request failed"
  );
}

// ✅ CORRECT CODE - Handle error response in success path
try {
  const jsonResponse = await response.json();

  // ✅ Check if it's an error response
  if (
    jsonResponse &&
    typeof jsonResponse === "object" &&
    "success" in jsonResponse &&
    !jsonResponse.success
  ) {
    throw new Error(
      jsonResponse.message || jsonResponse.error || "API request failed"
    );
  }

  // Unwrap success response
  if (
    jsonResponse &&
    typeof jsonResponse === "object" &&
    "success" in jsonResponse &&
    jsonResponse.success
  ) {
    return jsonResponse.data;
  }

  return jsonResponse;
} catch (e: any) {
  if (e.message && !e.message.includes("JSON")) {
    throw e;
  }
  throw new Error("Invalid JSON response from server");
}
```

---

### **Fix 4: Frontend AuthContext - Don't Logout On Server Error**

**File:** `frontend/src/contexts/AuthContext.tsx`

```typescript
// ✅ CORRECT CODE - Add event listener
useEffect(() => {
  const handleAuthError = () => {
    console.log("🔴 Auth error event received - clearing user state");
    setUser(null);
    // Token already removed by apiClient
  };

  window.addEventListener("auth-error", handleAuthError);
  return () => window.removeEventListener("auth-error", handleAuthError);
}, []);

// ✅ CORRECT CODE - Simplified verify logic
useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = await authService.getMe();
        setUser(user);
      } catch (error: any) {
        console.error("Token verification failed:", error);
        // ✅ Token is already removed by apiClient if 401
        // ✅ Only need to clear user state
        setUser(null);
      }
    }
    setIsLoading(false);
  };
  verifyUser();
}, []);
```

**Explanation:**

- apiClient handles token deletion on 401
- AuthContext only needs to clear user state when verification fails
- No need to distinguish between auth error vs server error anymore

---

### **Fix 5: Frontend apiClient - Handle 401 Properly**

**File:** `frontend/src/services/apiClient.ts`

```typescript
// ✅ CORRECT CODE
const handleResponse = async (response: Response): Promise<any> => {
  // Handle all 401 responses (authentication errors)
  if (response.status === 401) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (e) {
      // Can't parse JSON, use statusText
    }

    const errorMessage =
      errorData?.message || response.statusText || "Unauthorized";

    // ✅ Removes token and dispatches event for ALL 401s
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-error"));
    throw new Error(errorMessage);
  }

  // Handle other errors...
};
```

---

## 📊 Summary

### **Root Causes:**

1. ❌ Backend does not fetch permissions → undefined
2. ❌ Backend queries the wrong table (users_permissions does not exist)
3. ❌ Backend crashes when .map() on undefined
4. ❌ Backend returns 500 error
5. ❌ Frontend parses error message incorrectly
6. ❌ Frontend logs out on server error (500)

### **Solutions:**

1. ✅ Backend fetches permissions correctly (via roles_permissions)
2. ✅ Backend adds safety check (optional chaining + fallback)
3. ✅ Frontend parses error message correctly (message before error code)
4. ✅ Frontend handles error response in success path
5. ✅ Frontend only removes token on 401, not on 500
6. ✅ AuthContext simplified - relies on apiClient for token handling

### **Result:**

- ✅ `/auth/me` no longer crashes
- ✅ User is not logged out on server error
- ✅ Error messages display correctly
- ✅ Place bid flow functions normally

---

## 🎓 Lessons Learned

### **1. Database Schema Understanding**

- Always thoroughly read the schema before writing queries
- Do not assume a table exists without verification
- Permissions are assigned via roles, not directly to users

### **2. Error Handling Strategy**

- Backend: Always return a consistent error format
- Frontend: Parse according to the correct backend format
- Distinguish between client errors (401, 403) vs server errors (500)

### **3. Token Management**

- Only remove tokens on auth errors (401)
- Do not remove tokens on server errors (500)
- Centralize token removal logic (apiClient)

### **4. Safety Checks**

- Always use optional chaining for nested objects
- Provide fallback values (empty arrays)
- Validate data before .map()

### **5. Separation of Concerns**

- apiClient: Handles HTTP + token removal
- AuthContext: Handles user state
- Services: Business logic only

---

## 🔗 Related Files Changed

**Backend:**

- `backend/src/repositories/user.repository.ts`
- `backend/src/services/auth.service.ts`

**Frontend:**

- `frontend/src/services/apiClient.ts`
- `frontend/src/contexts/AuthContext.tsx`

---

## ✅ Testing Checklist

- [x] Bid placed successfully
- [x] Page refreshed after placing bid
- [x] User is not logged out
- [x] `/auth/me` returns correct user data
- [x] Permissions are fetched correctly from roles
- [x] Error messages display correctly
- [x] 401 errors remove token
- [x] 500 errors do not remove token

---

**Date:** 2025-12-08  
**Status:** ✅ RESOLVED  
**Priority:** 🔴 CRITICAL (Authentication bug)
