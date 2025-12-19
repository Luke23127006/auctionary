# Proxy Bidding System

## Overview

This project implements an **automatic proxy bidding system** similar to eBay's bidding mechanism. When users place a bid, they specify their **maximum amount** they're willing to pay. The system then automatically bids on their behalf, incrementally raising the bid only as much as necessary to outbid other users, up to their specified maximum.

## Database Tables

### `auto_bids` Table

Stores users' maximum bid amounts (their "proxy bids"):

```sql
CREATE TABLE public.auto_bids (
  id integer PRIMARY KEY,
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  max_amount numeric NOT NULL CHECK (max_amount > 0),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
```

**Purpose**:

- Stores the **hidden maximum amount** each user is willing to pay
- One user can only have one auto_bid per product (enforced by `UNIQUE(product_id, bidder_id)` constraint)
- Updated via `upsertAutoBid()` when a user places a new bid

### `bids` Table

Stores the **actual executed bids** (bid history):

```sql
CREATE TABLE public.bids (
  id integer PRIMARY KEY,
  product_id integer NOT NULL,
  bidder_id integer NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
```

**Purpose**:

- Records every **actual bid** that gets placed
- Used for bid history and auditing
- The highest bid in this table determines the current price shown to users

## Relationship Between Tables

```
User Places Bid ($500)
         ↓
auto_bids: max_amount = $500 (STORED, HIDDEN)
         ↓
System calculates actual bid amount
         ↓
bids: amount = $350 (EXECUTED, VISIBLE)
```

**Key Concept**:

- `auto_bids` stores **what users are WILLING to pay** (their ceiling)
- `bids` stores **what they ACTUALLY paid** (the executed bid)
- Users only pay **stepPrice above the second-highest max_amount**, not their full maximum

## Bidding Algorithm

The proxy bidding logic is implemented in [`bid.service.ts`](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/backend/src/services/bid.service.ts) within the `placeBid()` function:

### Step-by-Step Flow

1. **Validation** (Lines 14-30)

   - Verify product exists
   - Calculate minimum acceptable bid = `currentPrice + stepPrice`
   - Reject bid if below minimum

2. **Update Auto-Bid** (Line 32)

   ```typescript
   await bidRepository.upsertAutoBid(productId, userId, amount, trx);
   ```

   - Stores/updates the user's maximum amount in `auto_bids`
   - Uses `onConflict().merge()` to update if user already has an auto-bid

3. **Determine Winner** (Lines 34-41)

   ```typescript
   const autoBids = await bidRepository.getAutoBidsByProductId(productId, trx);
   const winner = autoBids[0]; // Highest max_amount
   const runnerUp = autoBids[1]; // Second highest
   ```

   - Fetches all auto-bids ordered by `max_amount DESC, created_at ASC`
   - Winner = user with highest `max_amount`
   - Runner-up = user with second-highest `max_amount`

4. **Handle Outbid Runner-Up** (Lines 43-55)

   ```typescript
   if (runnerUp && runnerUp.bidder_id === userId) {
     await bidRepository.createBid(productId, userId, runnerUp.max_amount, trx);
   }
   ```

   - Special case: If the current bidder becomes the runner-up (they were outbid)
   - Creates a bid record at their full max_amount
   - This ensures their bid attempt is logged even though they didn't win

5. **Calculate Actual Bid Price** (Lines 57-67)

   ```typescript
   if (runnerUp) {
     const priceToBeatRunnerUp = Number(runnerUp.max_amount) + stepPrice;
     newPrice = Math.min(priceToBeatRunnerUp, Number(winner.max_amount));
   } else {
     newPrice = startPrice;
   }
   ```

   - **If there's a runner-up**: Winner pays `runnerUp.max_amount + stepPrice` (or their max, whichever is lower)
   - **If winner is alone**: Winner pays only the `startPrice`
   - This ensures minimal price increment

6. **Create Winning Bid** (Lines 69-96)

   ```typescript
   const currentHighestBid = await bidRepository.getHighestBid(productId, trx);
   if (
     newPrice > currentRecordedPrice ||
     winner.bidder_id !== currentHighestBid.bidder_id
   ) {
     await bidRepository.createBid(productId, winner.bidder_id, newPrice, trx);
     await productRepository.updateProductBidStats(
       productId,
       winner.bidder_id,
       newPrice,
       trx
     );
   }
   ```

   - Only creates a new bid in `bids` table if:
     - Price increased, OR
     - Winner changed
   - Updates product's `current_price`, `highest_bidder_id`, and `bid_count`

7. **Return Status** (Lines 101-106)
   ```typescript
   return {
     status: winner.bidder_id === userId ? "winning" : "outbid",
     currentPrice: newPrice,
     topBidderId: winner.bidder_id,
     bidCount: bidCount,
   };
   ```

## Examples

### Example 1: First Bid

- **Product**: `start_price = $100`, `step_price = $10`
- **User A** bids max $200

**Result**:

- `auto_bids`: User A → `max_amount = $200`
- `bids`: User A → `amount = $100` (just the start price)
- **User A pays**: $100 (no competition, so lowest possible)

---

### Example 2: Second Bidder Joins

- **Current state**: User A has `max_amount = $200`, `current_price = $100`
- **User B** bids max $150

**Result**:

- `auto_bids`:
  - User A → `max_amount = $200`
  - User B → `max_amount = $150`
- `bids`: User A → `amount = $160` ($150 + $10 step)
- **User A pays**: $160 (just enough to beat User B)
- **User B status**: "outbid"

---

### Example 3: Higher Bid Takes Over

- **Current state**: User A has `max_amount = $200`, User B has `max_amount = $150`
- **User C** bids max $300

**Result**:

- `auto_bids`:
  - User C → `max_amount = $300`
  - User A → `max_amount = $200`
  - User B → `max_amount = $150`
- `bids`: User C → `amount = $210` ($200 + $10 step)
- **User C pays**: $210 (just enough to beat User A)
- **User C status**: "winning"

---

### Example 4: User Updates Their Max Bid

- **Current state**: User A has `max_amount = $200`, current winner
- **User A** increases bid to max $400

**Result**:

- `auto_bids`: User A → `max_amount = $400` (updated via upsert)
- `bids`: No new bid created (User A is still winner, price doesn't change)
- User A remains winning at same price, but now has higher ceiling

## Frontend Implementation

### User Interface

[`ProductBidding.tsx`](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/frontend/src/pages/Product/components/ProductBidding.tsx)

**Key Features**:

- Users enter their **maximum bid** amount (Line 158: "Your Maximum Bid")
- UI shows info message explaining proxy bidding (Lines 144-154)
- Success alert clarifies: "We'll automatically bid for you up to your limit" (Lines 117-120)
- Minimum bid validation on client side: `minBid = currentPrice + stepPrice`

### Bidding Hook

[`useBidding.ts`](file:///d:/Software%20Engineer/Web%20Dev/Auctionary/frontend/src/hooks/useBidding.ts)

**Responsibilities**:

- Manages modal state for bid placement
- Calls `productService.placeBid(productId, amount)`
- Handles response:
  - `status: "winning"` → Success toast
  - `status: "outbid"` → Warning toast
- Provides loading and error states

## Key Benefits

1. **Fair Price Discovery**: Users only pay the minimum needed to win
2. **Prevents Sniping**: Automatic bidding up to max protects against last-second bids
3. **Convenience**: Users don't need to monitor auction constantly
4. **Privacy**: Maximum bids are hidden from other users
5. **Competition**: Multiple auto-bids compete automatically, driving fair market value

## Edge Cases Handled

1. **Same Max Amount**: Earlier bid (`created_at ASC`) wins
2. **User Rebids**: Auto-bid is updated via upsert, not duplicated
3. **Outbid Runner-Up**: Their full max_amount is recorded in `bids` table
4. **No Runner-Up**: Winner pays only `start_price`
5. **Price Ceiling**: Winner never pays more than their `max_amount`

## Transaction Safety

All operations are wrapped in a **database transaction** (`db.transaction`), ensuring:

- Atomicity: All updates succeed or all fail
- Consistency: No partial state updates
- Isolation: Concurrent bids don't interfere
