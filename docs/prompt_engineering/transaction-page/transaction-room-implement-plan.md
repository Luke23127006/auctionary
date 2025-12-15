# Transaction Room Implementation Roadmap

This document outlines the detailed steps to implement the Transaction Room feature. It expands on the initial high-level plan with specific technical details for the Database, Backend, and Frontend layers.

## User Review Required

> [!IMPORTANT] > **Database Trigger Strategy**:
>
> - For **Item #1 (Time-based Status Update)**: Database triggers strictly react to _events_. To handle automatic expiration, we will use **pg_cron** directly in the database.
>   - _Recommendation_: Use `pg_cron` to run a stored procedure every minute.
> - For **Item #2 (Auto-create Transaction)**: This _can_ be a standard Database Trigger. It will fire `AFTER UPDATE` on the `products` table when the status changes to `sold`.

## Phase 1: Database Layer

### 1.1. Create `Transactions` Table

We need a table to store the transaction state (if not already existing).

> [!IMPORTANT] > **Data Integrity**: We include an `amount` column to freeze the final auction price at the moment of transaction creation.

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    buyer_id INTEGER REFERENCES users(id), -- The winner
    seller_id INTEGER REFERENCES users(id), -- The product owner
    amount DECIMAL(15, 2) NOT NULL, -- Freezes the final price
    status VARCHAR(50) DEFAULT 'payment_pending', -- payment_pending, shipping_pending, delivered, completed
    shipping_address TEXT,
    payment_id VARCHAR(255),
    tracking_number VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.2. Implement "Auction Ender" Logic (Using pg_cron)

We will use the PostgreSQL extension `pg_cron` to close expired auctions automatically.

- **Step 1: Enable pg_cron Extension**
  ```sql
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  ```
- **Step 2: Create Stored Procedure**
  This function checks for active auctions that have passed their end time and updates their status.

  ```sql
  CREATE OR REPLACE FUNCTION close_expired_auctions()
  RETURNS void AS $$
  BEGIN
      -- Option A: Mark as SOLD (if there is a bidder)
      UPDATE products
      SET status = 'sold'
      WHERE status = 'active'
        AND end_time <= NOW()
        AND highest_bidder_id IS NOT NULL;

      -- Option B: Mark as EXPIRED (if no bidder)
      UPDATE products
      SET status = 'expired'
      WHERE status = 'active'
        AND end_time <= NOW()
        AND highest_bidder_id IS NULL;
  END;
  $$ LANGUAGE plpgsql;
  ```

- **Step 3: Schedule the Job**
  Schedule the function to run every minute.
  ```sql
  SELECT cron.schedule('* * * * *', 'SELECT close_expired_auctions()');
  ```

### 1.3. Create Trigger for Transaction Creation (Item #2)

This trigger automatically creates a transaction row when a product is marked as `sold`.
**Update**: Now populates the `amount` from the product's `current_price`.

```sql
CREATE OR REPLACE FUNCTION create_transaction_on_sold()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'sold' AND OLD.status != 'sold' THEN
        INSERT INTO transactions (product_id, buyer_id, seller_id, amount, status)
        VALUES (
            NEW.id,
            NEW.highest_bidder_id,
            NEW.seller_id,
            NEW.current_price, -- Freeze the price
            'payment_pending'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_transaction
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION create_transaction_on_sold();
```

---

## Phase 2: Backend Development (Node.js/Express)

### 2.1. Transaction Resources

Create the following files:

- `backend/src/repositories/transaction.repository.ts`
- `backend/src/services/transaction.service.ts`
- `backend/src/controllers/transaction.controller.ts`
- `backend/src/routes/transaction.routes.ts`

### 2.2. Implement `TransactionService`

Methods needed:

- `getTransactionByProductId(productId: number, userId: number)`:
  - Fetch transaction where `product_id` matches.
  - **Security Check**: Ensure `userId` matches either `buyer_id` or `seller_id`. If not, throw 403 Forbidden.
  - Return transaction with joined `product` (title, image) and `otherUser` (name, avatar) details.
- `updateTransactionStatus(id: number, status: string, userId: number)`:
  - **RBAC Logic**:
    - If `status` -> `shipping_pending` (Paid): Only **Buyer** can perform this.
    - If `status` -> `delivered` or `completed`: Only **Seller** can perform this.
  - Throw 403 Forbidden if the role condition is not met.

### 2.3. Implement `UserController` Endpoints

- `GET /users/me/won-auctions`:
  - Query products where `highest_bidder_id = current_user.id` AND `status = 'sold'`.
  - Include `transaction` status if available.

### 2.4. Implement `TransactionController` Endpoints

- `PATCH /transactions/:id/status`:
  - Accepts `{ status: string }` body.
  - Calls `service.updateTransactionStatus` with the authenticated user's ID.

### 2.5. Refine `ProductList` Logic

- Ensure the product list API returns `highest_bidder_id` and `status` so the frontend can determine access.

---

## Phase 3: Frontend Integration

### 3.1. API Client Setup

Create `frontend/src/services/transaction.service.ts` (or similar):

- `getTransaction(productId: string)`: Calls `GET /api/products/:id/transaction-room`.
- `getWonAuctions()`: Calls `GET /api/users/me/won-auctions`.
- `updateStatus(transactionId: number, status: string)`: Calls `PATCH /api/transactions/:id/status`.

### 3.2. Implement "Won Auctions" Page UI

Create `frontend/src/pages/Profile/WonAuctionsPage.tsx`:

- Fetch data using `getWonAuctions()`.
- Render a list/grid of won products.
- For each item, add a button "Go to Transaction Room" that links to `/product/:id/transaction-room`.

### 3.3. Update `TransactionRoomPage.tsx`

- **Routing**: Change route to use ID: `/product/:productId/transaction-room`.
- **Data Fetching**:
  - Use `useEffect` or `useQuery` to call `getTransaction(productId)`.
  - **Loading State**: Show a skeleton or spinner while fetching.
  - **Error State**: If 403/404, show "Access Denied" or "Transaction Not Found" with a "Go Back" button.
- **Status Polling (UX Improvement)**:
  - Since status updates (like Cron expiration or partner actions) are asynchronous, we need to poll for updates.
  - Implement **Polling**: Use `setInterval` to call `getTransaction(productId)` every 10-15 seconds.
  - _Alternative_: Add a "Refresh Status" button if appropriate.
- **Replace Mock Data**:
  - Map API response to `transactionData`.
  - Pass real data to `TransactionRoomHeader`, `TransactionProductSummary`, etc.
- **Action Integration**:
  - **Payment Step**: "Pay Now" button calls `updateStatus(id, 'shipping_pending')`.
  - **Shipping Step**: "Confirm Shipment" (Seller view) calls `updateStatus(id, 'delivered')`. (Note: Usually manual, but for now we follow the simple flow).

### 3.4. Redirect Logic (Item #4)

In the Product Detail or List component:

```typescript
const handleEnterTransactionRoom = (product: Product, currentUser: User) => {
  const isWinner = product.highest_bidder_id === currentUser.id;
  const isSold = product.status === "sold";

  if (isSold && isWinner) {
    navigate(`/product/${product.id}/transaction-room`);
  } else {
    // Show toast or disable button
    toast.error("You cannot access this transaction room.");
  }
};
```

---

## Phase 4: Verification & Polish

### 4.1. Automated Verification

- Create a test user and a test audit.
- Manually expire the auction (or wait for cron).
- Verify `transaction` record is created in DB with correct `amount`.
- Verify endpoint returns correct data for the winner.
- Test RBAC: Try to mark as 'shipped' as a Buyer (should fail).
- Wait for `pg_cron` job (or manually invoke function) to verify auto-close behavior.

### 4.2. UI Polish

- **Breadcrumbs**: Update `TransactionRoomPage` breadcrumbs to be dynamic: `Home > Won Auctions > [Product Name]`.
- **Step Cleanup**: Ensure `TransactionRoomPayment` and `TransactionRoomShipping` do not show upload file inputs (as requested in item #7).
