# 📋 Enquiry System — Detailed Logic Documentation

> **Project**: Houselink360  
> **Key Files**: `agent_enqurie.php`, `houselinkController.php`, `IndexController.php`, `PropertyController.php`  
> **Table**: `agent_enquries`

---

## 🗂️ Overview

When a user submits an enquiry on a property, the system applies **different rules** depending on two axes:

| Axis | Values |
|------|--------|
| **Property Type** (`property_for`) | `sell`, `rent`, `lease` |
| **Owner Type** (`owner_type`) | `Owner`, `Consultant`, `Builder` |

These two axes together determine:
1. **Cooldown / rate-limiting** — how long before the same phone can re-enquire
2. **Points deduction** — whether the enquirer must spend "rent points"
3. **Image upload limits** — number of images allowed when posting the property
4. **Notifications sent** — SMS, WhatsApp, Email (same for all, but contacts differ)

---

## 1️⃣ Cooldown Logic (Rate Limiting by `property_for`)

### Location
- **Model**: [`agent_enqurie.php` → `canEnquire()`](file:///Users/abc/Downloads/testing/app/Models/agent_enqurie.php#L13-L66)
- **Controller** (web form): [`houselinkController.php` → `agentform_create()`](file:///Users/abc/Downloads/testing/app/Http/Controllers/houselinkController.php#L552-L683)
- **Controller** (signup form): [`houselinkController.php` → `agentform_create_signup()`](file:///Users/abc/Downloads/testing/app/Http/Controllers/houselinkController.php#L687-L832)

### Rules

```
IF property_for === 'sell':
    Cooldown = 60 MINUTES
    → Same phone cannot enquire on the same property within 60 minutes

ELSE (property_for === 'rent' OR 'lease'):
    Cooldown = 30 DAYS
    → Same phone cannot enquire on the same property within 30 days
```

### Implementation (Model `canEnquire`)

```php
// agent_enqurie.php :: canEnquire($phone, $proId)
$property = Property::find($proId);
$propertyFor = strtolower($property->property_for ?? 'sell');

if ($propertyFor === 'sell') {
    $expiryTime = $lastTime->copy()->addMinutes(60);
} else {
    // rent OR lease → 30 days
    $expiryTime = $lastTime->copy()->addDays(30);
}

if ($remainingSeconds > 0) {
    return ['can_enquire' => false, 'remaining_minutes' => ..., ...];
}
return ['can_enquire' => true];
```

### What's returned when blocked

| Field | Description |
|---|---|
| `can_enquire` | `false` |
| `remaining_minutes` | Minutes left to wait |
| `remaining_seconds` | Seconds left to wait |
| `owner_details_expires_at` | Human-readable expiry timestamp |
| `last_enquiry_time` | When last enquiry was made |
| `current_time` | Current server time |

---

## 2️⃣ Points Deduction Logic (Rent & Lease Only)

### Location
- [`houselinkController.php` → `agentform_create()` lines 592–631](file:///Users/abc/Downloads/testing/app/Http/Controllers/houselinkController.php#L592-L631)
- [`houselinkController.php` → `agentform_create_signup()` lines 727–764](file:///Users/abc/Downloads/testing/app/Http/Controllers/houselinkController.php#L727-L764)
- [`IndexController.php` → `deductRentPoints()`](file:///Users/abc/Downloads/testing/app/Http/Controllers/IndexController.php#L822-L844)

### Rules

```
IF property_for IN ('rent', 'lease') AND customer is logged in:
    Check rent_unlocked_properties table:
    
    IF property already UNLOCKED within last 45 days:
        → FREE — skip point deduction, allow enquiry directly
    
    ELSE (not unlocked):
        Try to deduct 1 point from rent_access_subscriptions
        
        IF not enough points (< 1):
            → BLOCK with HTTP 403: "You do not have enough points. Please buy a plan."
        
        IF deduction succeeds:
            → Insert row into rent_unlocked_properties with status='unlocked'
            → Proceed with enquiry

IF property_for === 'sell':
    → NO points needed, skip this entire block
```

> [!IMPORTANT]
> `lease` is treated **identically** to `rent` in points deduction logic. Both use the same 30-day cooldown AND the same points system.

### Database Tables Involved

| Table | Purpose |
|---|---|
| `rent_access_subscriptions` | Stores customer's purchased point balance (`remaining_points`) |
| `rent_unlocked_properties` | Records which properties a customer has already paid to unlock |
| `customer_purchased_packages` | Package records; credits set to 0 when points run out |

### `deductRentPoints()` Flow

```php
// IndexController.php :: deductRentPoints($customerId, $points = 1)
$subscription = DB::table('rent_access_subscriptions')
    ->where('customer_id', $customerId)->orderByDesc('id')->first();

if (!$subscription || $subscription->remaining_points < $points) {
    return false; // Not enough points
}

DB::table('rent_access_subscriptions')
    ->where('id', $subscription->id)
    ->decrement('remaining_points', $points);

// If balance hits 0, zero out the purchased package credits too
if (($subscription->remaining_points - $points) <= 0) {
    CustomerPurchasedPackage::where('customer_id', $customerId)
        ->where('package_type', 'rent')
        ->where('no_of_credit', '>', 0)
        ->update(['no_of_credit' => 0]);
}
return true;
```

---

## 3️⃣ Per Owner-Type Differences

### A. Owner (`owner_type = 'Owner'`)

| Aspect | Rule |
|---|---|
| **Image upload limit** | Up to **15 images** per property |
| **Cooldown (sell)** | 60 minutes |
| **Cooldown (rent/lease)** | 30 days |
| **Points deduction** | Yes (if enquirer is logged in + property is rent/lease) |
| **Who receives notifications** | The Owner directly (`customer_id` on the property) |
| **Unlock logic** | `rent_unlocked_properties` tracks access per customer |

**Enquiry flow**:
1. Validate request fields
2. `canEnquire()` → check cooldown → block or allow
3. If rent/lease + logged in → check unlock → deduct 1 point or reuse unlock
4. Create `agent_enquries` record
5. Send SMS + WhatsApp + Email to **owner** and **enquirer**

---

### B. Consultant (`owner_type = 'Consultant'`)

| Aspect | Rule |
|---|---|
| **Image upload limit** | Only **5 images** per property *(stricter than Owner)* |
| **Cooldown (sell)** | Same: 60 minutes |
| **Cooldown (rent/lease)** | Same: 30 days |
| **Points deduction** | Same logic applies |
| **Who receives notifications** | The Consultant (still identified via `customer_id`) |
| **Unlock logic** | Same `rent_unlocked_properties` logic |

> [!NOTE]
> The only **concrete difference** for Consultant is the **image limit: 5 vs 15**.
> The enquiry submission flow, cooldown, and points logic are identical to Owner.

**Image Limit Code Location**: [`PropertyController.php (V2) line 283`](file:///Users/abc/Downloads/testing/app/Http/Controllers/API/V2/PropertyController.php#L283)

```php
$maxImages = ($ownerType === 'Consultant') ? 5 : 15;
```

---

### C. Lease (`property_for = 'lease'`)

> [!IMPORTANT]
> `lease` is a **property listing type**, NOT an owner type. The `owner_type` for lease properties is still `Owner` or `Consultant`. Lease affects the **enquiry cooldown** and **points system**.

| Aspect | Rule |
|---|---|
| **Cooldown** | **30 days** (same as rent) |
| **Points deduction** | **Yes** — treated same as rent |
| **Unlock duration** | **45 days** (property stays unlocked in `rent_unlocked_properties`) |
| **Status on store** | `property_for = 'lease'` → stored `status = 'renting'` |
| **Enquiry form validation** | `property_for` accepted as `sell`, `rent`, or `lease` |

**Status mapping** on property creation:
```php
'status' => match($request->property_for) {
    'sell'  => 'selling',
    'rent'  => 'renting',
    'lease' => 'renting',  // lease maps to 'renting' status
    default => 'selling'
},
```

**Points check for lease** (same as rent):
```php
if (
    session()->has('customer_id') &&
    in_array(strtolower($property->property_for ?? ''), ['rent', 'lease'])
) {
    // ... deduct 1 point or reuse 45-day unlock
}
```

---

## 4️⃣ Complete Enquiry Flow Diagram

```
User submits enquiry form
        │
        ▼
 ┌─────────────────────────────────────┐
 │  Validate request fields            │
 │  (name, phone, email, pro_id, etc.) │
 └─────────────────────────────────────┘
        │
        ▼
 ┌─────────────────────────────────────┐
 │  canEnquire($phone, $pro_id)        │
 │                                     │
 │  property_for === 'sell'?           │
 │    YES → cooldown = 60 min          │
 │    NO  → cooldown = 30 days         │
 │                                     │
 │  Last enquiry within cooldown?      │
 │    YES → return 429, show wait time │
 │    NO  → proceed                    │
 └─────────────────────────────────────┘
        │
        ▼
 ┌─────────────────────────────────────┐
 │  Is property_for rent OR lease?     │
 │    NO (sell) → skip points block    │
 │    YES → Is customer logged in?     │
 │              NO → skip points block │
 │              YES → ↓                │
 └─────────────────────────────────────┘
        │
        ▼
 ┌─────────────────────────────────────┐
 │  Already unlocked within 45 days?   │
 │    YES → free access, skip deduct   │
 │    NO  → deductRentPoints(id, 1)    │
 │          FAIL → return 403          │
 │          OK   → insert unlock row   │
 └─────────────────────────────────────┘
        │
        ▼
 ┌─────────────────────────────────────┐
 │  agent_enqurie::create(...)         │
 │  → Insert into agent_enquries table │
 └─────────────────────────────────────┘
        │
        ▼
 ┌─────────────────────────────────────┐
 │  Notifications                      │
 │  → SMS to Owner                     │
 │  → SMS to Enquirer                  │
 │  → WhatsApp to Owner                │
 │  → WhatsApp to Enquirer             │
 │  → Email to Owner                   │
 │  → Email to Enquirer                │
 └─────────────────────────────────────┘
        │
        ▼
  Return JSON: { status: 'success',
                 owner_name, owner_phone }
```

---

## 5️⃣ Summary Comparison Table

| Feature | **Owner (Sell)** | **Owner (Rent)** | **Owner (Lease)** | **Consultant (any)** |
|---|---|---|---|---|
| **Cooldown** | 60 min | 30 days | 30 days | Same as property_for |
| **Points required** | ❌ No | ✅ 1 point | ✅ 1 point | Same as property_for |
| **Unlock validity** | N/A | 45 days | 45 days | Same |
| **Image upload limit** | 15 | 15 | 15 | **5** |
| **Status stored** | `selling` | `renting` | `renting` | Depends on property_for |
| **Notification targets** | Owner + Enquirer | Owner + Enquirer | Owner + Enquirer | Owner + Enquirer |

---

## 6️⃣ HTTP Response Codes

| Scenario | Code | Message |
|---|---|---|
| Validation fails | `422` | Field errors |
| Already enquired (cooldown active) | `429` | "Try again after 60 min / 30 days" |
| Not enough rent points | `403` | "You do not have enough points. Please buy a plan." |
| Property not found | `404` / `fail` | — |
| Success | `200` | `{ status: 'success', owner_name, owner_phone }` |

---

## 7️⃣ Key API Endpoints

| Endpoint (route) | Controller Method | Purpose |
|---|---|---|
| `POST /agent-enquiry` | `houselinkController::agentform_create` | Standard enquiry (web/logged-in session) |
| `POST /agent-enquiry-signup` | `houselinkController::agentform_create_signup` | Enquiry with optional mobile customer ID |
| `GET /check-enquiry-status` | `IndexController::checkEnquiryStatus` | Pre-check if cooldown is active |
| `POST /bulk-messages` | `PropertyController::sendBulkMessages` | Admin bulk enquiry to multiple properties |

---

## 8️⃣ `agent_enquries` Table — Fields Stored

| Field | Description |
|---|---|
| `name` | Enquirer's name |
| `phone` | Enquirer's phone (used for cooldown check) |
| `email` | Enquirer's email |
| `pro_id` | Property ID (FK to `properties`) |
| `pro_cus` | Property owner's customer ID (FK to `customer_list`) |
| `property_name` | Property name at time of enquiry |
| `message` | Optional message from enquirer |
| `created_at` | Timestamp — used for cooldown calculation |
