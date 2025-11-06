## **Model Schemas**

### **1. User Model**

**Purpose:** Store customer details.
**Fields:**

* `user_id` (PK)
* `name`
* `email` (unique)
* `password_hash`
* `phone`
* `address`
* `profile_image`
* `role` (`user` | `admin` | `vendor`)
* `date_joined`
* `is_active` (boolean)

### **2. Vehicle Model**

**Purpose:** Store information about cars/bikes available for rent.
**Fields:**

* `vehicle_id` (PK)
* `vendor_id` (FK → Vendor)
* `name` / `model_name`
* `type` (`car` | `bike`)
* `brand`
* `registration_number`
* `price_per_hour`
* `price_per_day`
* `images` (array / separate Image table)
* `availability_status` (`available`, `booked`, `maintenance`)
* `location`
* `description`
* `created_at`
* `updated_at`

### **3. Booking Model**

**Purpose:** Track user bookings and rental periods.
**Fields:**

* `booking_id` (PK)
* `user_id` (FK → User)
* `vehicle_id` (FK → Vehicle)
* `vendor_id` (FK → Vendor)
* `pickup_location`
* `dropoff_location`
* `pickup_datetime`
* `dropoff_datetime`
* `duration_hours`
* `total_cost`
* `status` (`pending`, `confirmed`, `cancelled`, `completed`)
* `payment_status` (`unpaid`, `paid`, `refunded`)
* `created_at`

### **4. Payment Model**

**Purpose:** Handle transactions via Razorpay or similar gateways.
**Fields:**

* `payment_id` (PK)
* `booking_id` (FK → Booking)
* `user_id` (FK → User)
* `amount`
* `payment_method`
* `transaction_id` (from Razorpay)
* `payment_status` (`success`, `failed`, `refunded`)
* `payment_date`

### **5. Vendor Model**

**Purpose:** Store vehicle owner details.
**Fields:**

* `vendor_id` (PK)
* `user_id` (FK → User)  // if vendors log in via same user table
* `company_name` / `vendor_name`
* `contact_number`
* `email`
* `address`
* `is_verified` (boolean)
* `total_earnings`
* `registered_at`

### **8. Admin Dashboard Data (Derived Models or Views)**

Not separate DB tables — these can be **computed from existing models**:

* Total vehicles
* Active bookings
* Total revenue
* Pending approvals
* Failed transactions

### **Entity Relationships**

* **User (1 - M) Booking**
* **Vendor (1 - M) Vehicle**
* **Vehicle (1 - M) Booking**
* **Booking (1 - 1) Payment**
* **Vendor (1 - M) Booking** (through vehicle ownership)
