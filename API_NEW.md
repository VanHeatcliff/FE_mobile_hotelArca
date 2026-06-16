# Hotel Arca — Frontend API Reference

> **Base URL:** `http://localhost:8080`
> CORS: `*` (all origins allowed)
> All dates in ISO 8601 (`2026-06-16T14:00:00Z`)

---

## Quick Start — Customer Journey

```
1. Register         POST /api/register         (no auth)
2. Login            POST /api/login             (no auth)
3. Browse rooms     GET  /api/rooms             (auth)
4. Book a room      POST /api/bookings          (auth)
5. Pay              POST /api/payments          (auth)
6. Get travel plan  POST /ai-travel-plan        (no auth, pass id_booking)
7. Leave review     POST /api/reviews           (auth)
8. Chat with staff  POST /api/chats             (auth)
                   POST /api/chats/:id/messages  (auth)
```

---

## Endpoint Map

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/register` | — | Register new customer |
| `POST` | `/api/login` | — | Login (any role) |
| `POST` | `/ai-recommend` | — | AI room recommendation |
| `POST` | `/ai-travel-plan` | — | AI Lombok travel destinations |
| `GET` | `/api/customers` | JWT | List customers |
| `GET` | `/api/customers/:id` | JWT | Get one customer |
| `POST` | `/api/customers` | JWT | Create customer |
| `PUT` | `/api/customers/:id` | JWT | Update customer |
| `DELETE` | `/api/customers/:id` | JWT | Delete customer |
| `GET` | `/api/owners` | JWT | List owners |
| `POST` | `/api/owners` | JWT | Create owner |
| `PUT` | `/api/owners/:id` | JWT | Update owner |
| `DELETE` | `/api/owners/:id` | JWT | Delete owner |
| `GET` | `/api/staffs` | JWT | List staff |
| `GET` | `/api/staffs/:id` | JWT | Get one staff |
| `POST` | `/api/staffs` | JWT | Create staff |
| `PUT` | `/api/staffs/:id` | JWT | Update staff |
| `DELETE` | `/api/staffs/:id` | JWT | Delete staff |
| `GET` | `/api/room-types` | JWT | List room types |
| `POST` | `/api/room-types` | JWT | Create room type |
| `PUT` | `/api/room-types/:id` | JWT | Update room type |
| `DELETE` | `/api/room-types/:id` | JWT | Delete room type |
| `GET` | `/api/rooms` | JWT | List rooms (with room_type) |
| `GET` | `/api/rooms/:id` | JWT | Get one room (with room_type) |
| `POST` | `/api/rooms` | JWT | Create room |
| `PUT` | `/api/rooms/:id` | JWT | Update room |
| `DELETE` | `/api/rooms/:id` | JWT | Delete room |
| `GET` | `/api/bookings` | JWT | List bookings |
| `GET` | `/api/bookings/:id` | JWT | Get one booking |
| `POST` | `/api/bookings` | JWT | Create booking |
| `PUT` | `/api/bookings/:id` | JWT | Update booking |
| `DELETE` | `/api/bookings/:id` | JWT | Delete booking |
| `GET` | `/api/payments` | JWT | List payments |
| `POST` | `/api/payments` | JWT | Create payment |
| `PUT` | `/api/payments/:id` | JWT | Update payment |
| `DELETE` | `/api/payments/:id` | JWT | Delete payment |
| `GET` | `/api/chats` | JWT | List chats |
| `POST` | `/api/chats` | JWT | Create chat |
| `PUT` | `/api/chats/:id` | JWT | Update chat |
| `DELETE` | `/api/chats/:id` | JWT | Delete chat (cascades messages) |
| `GET` | `/api/chats/:id/messages` | JWT | List messages in a chat |
| `POST` | `/api/chats/:id/messages` | JWT | Send a message |
| `PUT` | `/api/chats/:id/messages/:msgId` | JWT | Edit a message |
| `DELETE` | `/api/chats/:id/messages/:msgId` | JWT | Delete a message |
| `GET` | `/api/reviews` | JWT | List reviews |
| `POST` | `/api/reviews` | JWT | Create review |
| `PUT` | `/api/reviews/:id` | JWT | Update review |
| `DELETE` | `/api/reviews/:id` | JWT | Delete review |
| `GET` | `/api/revenue_reports` | JWT | List revenue reports |
| `POST` | `/api/revenue_reports` | JWT | Create revenue report |
| `PUT` | `/api/revenue_reports/:id` | JWT | Update revenue report |
| `DELETE` | `/api/revenue_reports/:id` | JWT | Delete revenue report |

---

## Authentication

Every protected endpoint needs:

```
Authorization: Bearer <token>
```

Token expires in **24 hours**.

---

### Register — `POST /api/register` *(public)*

```json
// Request
{ "name": "Alice", "email": "alice@example.com", "password": "secret123", "phone_number": "08123456789" }
// name: required
// email: required, must be unique
// password: required, min 6 characters
// phone_number: optional

// Response 201
{ "id_customer": 7, "name": "Alice", "email": "alice@example.com", "phone_number": "08123456789" }
// Password is never returned (json:"-" tag on model)

// Response 409 — duplicate email
{ "error": "Email sudah terdaftar" }

// Response 400 — validation
{ "error": "Key: 'RegisterRequest.Password' Error:Field validation for 'Password' failed on the 'min' tag" }
```

### Login — `POST /api/login` *(public)*

```json
// Request
{ "email": "customer@arca.com", "password": "password123", "role": "customer" }
// role ∈ "customer" | "owner" | "staff"

// Response 200
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Andi Tamu", "email": "customer@arca.com", "role": "customer" }
}

// Response 401 — wrong credentials or wrong role
{ "error": "Email atau password salah" }
```

---

## Customers

```
GET    /api/customers          → list all
GET    /api/customers/:id      → get one
POST   /api/customers          → create
PUT    /api/customers/:id      → update
DELETE /api/customers/:id      → delete
```

```json
// POST body (all fields required)
{ "name": "Alice", "email": "alice@example.com", "password": "secret", "phone_number": "08123456789" }

// PUT body (partial — only send fields you want to change)
{ "name": "Alice Updated", "phone_number": "08111111111" }
// If password is included and non-empty, it will be re-hashed

// Response — password field is always excluded
{ "id_customer": 1, "name": "Alice", "email": "alice@example.com", "phone_number": "08123456789" }

// DELETE response
{ "message": "Customer berhasil dihapus" }
```

---

## Owners

```
GET    /api/owners             → list all
POST   /api/owners             → create
PUT    /api/owners/:id         → update
DELETE /api/owners/:id         → delete
```

```json
// POST body
{ "name": "Bob", "email": "bob@example.com", "password": "secret" }

// Response
{ "id_owner": 1, "name": "Bob", "email": "bob@example.com" }
```

---

## Staff

```
GET    /api/staffs             → list all
GET    /api/staffs/:id         → get one
POST   /api/staffs             → create
PUT    /api/staffs/:id         → update
DELETE /api/staffs/:id         → delete
```

```json
// POST body
{ "name": "Charlie", "email": "charlie@arca.com", "password": "secret" }

// Response
{ "id_staff": 1, "name": "Charlie", "email": "charlie@arca.com" }
```

---

## Room Types

```
GET    /api/room-types         → list all
POST   /api/room-types         → create
PUT    /api/room-types/:id     → update
DELETE /api/room-types/:id     → delete
```

```json
// POST body
{ "name": "Deluxe", "price": 750000, "description": "King bed, city view, bathtub, minibar" }

// Response
{ "id_room_type": 2, "name": "Deluxe", "price": 750000, "description": "King bed, city view, bathtub, minibar" }
```

---

## Rooms

```
GET    /api/rooms              → list all
GET    /api/rooms/:id          → get one
POST   /api/rooms              → create
PUT    /api/rooms/:id          → update (partial — send only changed fields)
DELETE /api/rooms/:id          → delete
```

```json
// POST body
{ "room_number": "301", "id_room_type": 1, "availability": true }

// GET response — includes nested room_type when available
{
  "id_room": 1,
  "room_number": "101",
  "id_room_type": 1,
  "availability": true,
  "room_type": { "id_room_type": 1, "name": "Standard", "price": 350000, "description": "..." }
}

// PUT — toggle availability only
{ "availability": false }
// Note: availability: false will correctly persist (boolean zero-values are handled)
```

**Important:** Room `availability` is automatically managed by the booking service:
- Creating a booking → sets room `availability: false`
- Deleting a booking → sets room `availability: true`

---

## Bookings

```
GET    /api/bookings           → list all
GET    /api/bookings/:id       → get one
POST   /api/bookings           → create
PUT    /api/bookings/:id       → update
DELETE /api/bookings/:id       → delete
```

```json
// POST body
{
  "id_customer": 1,
  "id_room": 2,
  "date_in":  "2026-06-16T14:00:00Z",
  "date_out": "2026-06-19T12:00:00Z",
  "total_payment": 2250000,
  "status_payment": "pending"
}
// status_payment: "pending" | "paid" | "cancelled" (default: "pending" if omitted)

// Response
{
  "id_booking": 14,
  "id_customer": 1,
  "id_room": 2,
  "date_in": "2026-06-16T14:00:00Z",
  "date_out": "2026-06-19T12:00:00Z",
  "total_payment": 2250000,
  "status_payment": "pending"
}
```

**Side effects:**
| Action | What happens |
|--------|-------------|
| Create booking | Customer validated (404 if not found), room validated (404 if not found, 409 if unavailable), room set to `availability: false` |
| Delete booking | Room released (`availability: true`) |

---

## Payments

```
GET    /api/payments           → list all
POST   /api/payments           → create
PUT    /api/payments/:id       → update
DELETE /api/payments/:id       → delete
```

```json
// POST body
{
  "id_booking": 14,
  "total_payment": 2250000,
  "method": "transfer",
  "date": "2026-06-16T10:00:00Z",
  "status": "paid"
}
// method: free-text ("transfer", "cash", "credit_card", etc.)
// status: free-text ("paid", "pending", etc.)

// Response
{ "id_payment": 1, "id_booking": 14, "total_payment": 2250000, "method": "transfer", "date": "...", "status": "paid" }
```

**Side effect on create:** Updates the booking's `status_payment` to `"paid"`.

---

## Chats

```
GET    /api/chats              → list all
POST   /api/chats              → create
PUT    /api/chats/:id          → update
DELETE /api/chats/:id          → delete (deletes all messages in this chat)
```

```json
// POST body
{ "id_customer": 1, "id_staff": 1 }
// date is auto-generated (no need to send)

// Response
{ "id_chat": 1, "id_customer": 1, "id_staff": 1, "date": "2026-06-16T10:00:00+07:00" }
```

**Side effect on create:** Validates both customer and staff exist (404 if either not found).

---

## Chat Messages

```
GET    /api/chats/:id/messages         → list messages (ordered by date ASC)
POST   /api/chats/:id/messages         → send a message
PUT    /api/chats/:id/messages/:msgId  → edit a message
DELETE /api/chats/:id/messages/:msgId  → delete a message
```

```json
// POST body
{ "sender_type": "customer", "message": "Halo, apakah kamar tersedia?" }
// sender_type ∈ "customer" | "staff"

// Response
{
  "id_chat_message": 1,
  "id_chat": 1,
  "sender_type": "customer",
  "message": "Halo, apakah kamar tersedia?",
  "date": "2026-06-16T10:00:00+07:00"
}
// date is auto-generated
```

---

## Reviews

```
GET    /api/reviews            → list all
POST   /api/reviews            → create
PUT    /api/reviews/:id        → update
DELETE /api/reviews/:id        → delete
```

```json
// POST body
{ "id_customer": 1, "id_room": 2, "rating": 5, "comment": "Kamar bersih, pelayanan ramah!" }
// rating: 1–5 (enforced server-side)

// Response
{ "id_review": 1, "id_customer": 1, "id_room": 2, "rating": 5, "comment": "Kamar bersih, pelayanan ramah!" }

// PUT — update with partial body
{ "rating": 4, "comment": "Lumayan bersih" }
// rating: if provided, must be 1–5. Omit to keep current rating.
```

**Side effect on create:** Validates customer and room exist (404 if not found).

---

## Revenue Reports

```
GET    /api/revenue_reports    → list all
POST   /api/revenue_reports    → create
PUT    /api/revenue_reports/:id → update
DELETE /api/revenue_reports/:id → delete
```

```json
// POST body
{
  "period": "2026-06",
  "total_revenue": 15000000,
  "total_booking": 5,
  "total_review": 3,
  "detail_income": "Transfer: 10jt, Cash: 5jt"
}

// Response
{ "id_revenue": 1, "period": "2026-06", "total_revenue": 15000000, "total_booking": 5, "total_review": 3, "detail_income": "Transfer: 10jt, Cash: 5jt" }
```

---

## AI Room Recommendation

### `POST /ai-recommend` *(public)*

Suggests the best room type and available rooms based on natural language preferences. Powered by ML (TF-IDF) with keyword fallback.

```json
// Request
{ "message": "Saya cari kamar mewah dengan kolam renang" }

// Response
{ "reply": "Berdasarkan preferensi Anda, kami merekomendasikan tipe **Suite** — Room 301 dengan harga Rp1500000/malam. Kamar mewah dengan living room, kolam renang pribadi, pelayanan 24 jam." }

// Empty/missing message → 400
{ "reply": "Tolong tuliskan preferensi kamar yang Anda inginkan." }
// No room types in database → 200 with fallback message
```

The response includes actual room numbers (not just room type). Only available rooms are listed.

---

## AI Travel Destination Recommendation

### `POST /ai-travel-plan` *(public)*

Recommends Lombok travel destinations based on your booking duration and activity preferences. Duration is calculated automatically from your booking's `date_out − date_in`.

```json
// Request
{ "message": "Saya suka pantai dan snorkeling", "id_booking": 14 }

// Response
{
  "reply": "Untuk liburan 3 hari di Lombok, kami merekomendasikan:\n\n— Pantai & Pesisir —\n  • Pantai Pink — Lombok Timur\n    Durasi ideal: 3 hari (cocok untuk Anda)\n    Salah satu dari hanya tujuh pantai pasir pink di dunia...\n\n— Wisata Pulau (Gili) —\n  • Gili Trawangan — Gili\n    Durasi ideal: 2 hari (cocok untuk Anda)\n    Pulau wisata terkenal dengan snorkeling, diving..."
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `id_booking` | **Yes** | Booking ID from a completed room booking. Duration = `date_out − date_in` (days, rounded up). |
| `message` | No | Activities you enjoy (beach, snorkeling, hiking, culture, etc.). Empty → destinations matched only by duration. |

**Categories:** `pantai` (beach), `pulau` (island/Gili), `air_terjun` (waterfall), `gunung` (mountain), `budaya` (culture)

**Duration-based matching:**
- **1–2 days** → nearby spots (Senggigi, Tanjung Aan, Desa Sade, Bukit Merese)
- **3–4 days** → medium range (Gili islands, Pantai Pink, Benang Kelambu)
- **5+ days** → full circuit (Rinjani, Pink Beach, Sekotong)

**Errors:**
| Status | When |
|--------|------|
| 400 | `id_booking` is missing or zero |
| 404 | Booking ID not found |

---

## Error Reference

Every error response follows this shape:

```json
{ "error": "descriptive message in Indonesian" }
```

AI endpoints use `"reply"` instead of `"error"` for user-facing messages:

```json
{ "reply": "Tolong sertakan id_booking..." }
```

| HTTP | Meaning | Example trigger |
|------|---------|----------------|
| 200 | Success | — |
| 201 | Created | POST register, create booking |
| 400 | Bad request | Missing required fields, rating < 1, short password |
| 401 | Unauthorized | Missing/expired/wrong token |
| 404 | Not found | Invalid ID, booking not found for travel plan |
| 409 | Conflict | Duplicate email on register, booking unavailable room |
| 500 | Server error | DB failure, bcrypt failure |

---

## ID Field Reference

All IDs are `uint` (unsigned integers, starting from 1).

| Entity | JSON key |
|--------|----------|
| Customer | `id_customer` |
| Owner | `id_owner` |
| Staff | `id_staff` |
| Room | `id_room` |
| Room Type | `id_room_type` |
| Booking | `id_booking` |
| Payment | `id_payment` |
| Chat | `id_chat` |
| Chat Message | `id_chat_message` |
| Review | `id_review` |
| Revenue Report | `id_revenue` |

---

## Seed Accounts

| Email | Password | Role |
|-------|----------|------|
| `customer@arca.com` | `password123` | customer |
| `owner@arca.com` | `password123` | owner |
| `staff@arca.com` | `password123` | staff |

---

## Integration Examples

### JavaScript / Fetch

```js
const API = "http://localhost:8080";

let token = null;

// --- Auth ---
async function register(name, email, password, phone) {
  const res = await fetch(`${API}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone_number: phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data; // { id_customer, name, email, phone_number }
}

async function login(email, password, role) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  token = data.token;
  return data.user;
}

function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// --- CRUD helpers ---
const api = {
  list:   (r)     => fetch(`${API}/api/${r}`, { headers: authHeaders() }).then(r => r.json()),
  get:    (r, id) => fetch(`${API}/api/${r}/${id}`, { headers: authHeaders() }).then(r => r.json()),
  create: (r, b)  => fetch(`${API}/api/${r}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(b) }).then(r => r.json()),
  update: (r, id, b) => fetch(`${API}/api/${r}/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(b) }).then(r => r.json()),
  del:    (r, id) => fetch(`${API}/api/${r}/${id}`, { method: "DELETE", headers: authHeaders() }).then(r => r.json()),
};

// --- AI (no auth needed) ---
async function recommendRoom(message) {
  const res = await fetch(`${API}/ai-recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
}

async function travelPlan(id_booking, message) {
  const res = await fetch(`${API}/ai-travel-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_booking, message: message || "" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.reply);
  return data.reply;
}

// --- Chat messages (nested routes don't fit api helper) ---
async function sendMessage(chatId, senderType, message) {
  const res = await fetch(`${API}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ sender_type: senderType, message }),
  });
  return res.json();
}

async function getMessages(chatId) {
  const res = await fetch(`${API}/api/chats/${chatId}/messages`, { headers: authHeaders() });
  return res.json();
}

// --- Typical customer flow ---
async function customerFlow() {
  // 1. Register
  await register("Alice", "alice@test.com", "secret123", "08123456789");

  // 2. Login
  await login("alice@test.com", "secret123", "customer");

  // 3. Browse rooms
  const rooms = await api.list("rooms");
  // Pick an available room
  const room = rooms.find(r => r.availability);

  // 4. Book it (3-day stay)
  const booking = await api.create("bookings", {
    id_customer: 1,
    id_room: room.id_room,
    date_in: "2026-06-20T14:00:00Z",
    date_out: "2026-06-23T12:00:00Z",
    total_payment: room.room_type.price * 3,
  });

  // 5. Pay
  await api.create("payments", {
    id_booking: booking.id_booking,
    total_payment: booking.total_payment,
    method: "transfer",
    date: new Date().toISOString(),
    status: "paid",
  });

  // 6. Get travel recommendations for the trip
  const plan = await travelPlan(booking.id_booking, "pantai dan snorkeling");
  console.log(plan);

  // 7. Leave a review
  await api.create("reviews", {
    id_customer: 1,
    id_room: room.id_room,
    rating: 5,
    comment: "Pengalaman menginap luar biasa!",
  });

  // 8. Chat with staff
  const chat = await api.create("chats", { id_customer: 1, id_staff: 1 });
  await sendMessage(chat.id_chat, "customer", "Halo, saya butuh bantuan.");
}
```
