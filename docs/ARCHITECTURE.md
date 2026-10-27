# AnnaSetu — Technical Architecture and Build Contract

## 1. Technology decisions (locked for this project)

| Layer | Technology | Responsibility |
|---|---|---|
| Main app and admin interface | React.js + Vite | Role-based web user interfaces |
| API server | Node.js + Express.js | Business rules, validation, permissions, API endpoints |
| Application database | MongoDB | Profiles, reports, assignments, timelines, notifications, evidence metadata/data |
| Authentication | Firebase Authentication | Sign-up/sign-in and Firebase identity tokens |
| Location/maps | Maps API | Map selection, place/location display, routing assistance and distance context |
| Source control | Git + GitHub | Repository history, collaboration, code review/backups |

Do not introduce unrelated frameworks, payment systems, messaging providers, AI platforms, or a custom authentication system into the MVP. Firebase Authentication is the identity provider. The AnnaSetu backend verifies Firebase ID tokens; it does not create a competing username/password or custom token authority.

## 2. Logical deployment view

```text
Browser on mobile (Donor / Volunteer)    Browser on desktop (Admin)
                |                                      |
                +----------- React + Vite --------------+
                                      |
                         HTTPS JSON API requests
                                      |
                           Node.js + Express API
                       auth / validation / authorization
                         /           |            \
          Firebase Authentication  MongoDB        Maps API
                identity           system data    locations/routes
```

The main app and admin panel may be separate frontend entry points or route groups in the same React/Vite project. They must have separate layouts and protected routes. Both call the same Express API. Deployment provider choices are intentionally not fixed here; whichever environment is used must serve the frontend over HTTPS and configure secrets outside source control.

## 3. Repository structure

```text
annasetu/
  client/                         # React + Vite main app: donor and volunteer
    src/
      app/                        # app bootstrap, router, providers
      features/
        auth/
        donor/
        volunteer/
        notifications/
        profile/
      components/
      services/                   # API client, Firebase client, map client
      styles/
  admin/                          # React + Vite admin interface (or admin route group)
    src/
      features/
        dashboard/
        reports/
        volunteers/
        assignments/
        destinations/
        proof-review/
      components/
      services/
      styles/
  server/
    src/
      config/                     # environment/config loading
      middleware/                 # Firebase token verification, role guard, errors
      modules/
        users/
        donations/
        volunteers/
        destinations/
        assignments/
        notifications/
        uploads/
        impact/
      routes/
      models/
      services/                   # rule-based matching, audit/event writers
      utils/
  docs/
  .env.example                    # names only, never real secrets
  README.md
```

The exact split between `client/` and `admin/` may be one or two Vite projects, but the behavior must remain identical to this contract: mobile-focused donor/volunteer UI, desktop-focused authenticated admin UI, one API, one MongoDB data model.

## 4. Authentication and authorization design

### Authentication sequence

```text
1. React app signs user in with Firebase Authentication.
2. Firebase returns an ID token to the client.
3. Client sends: Authorization: Bearer <Firebase ID token> to Express.
4. Express verifies the token using Firebase Admin capabilities.
5. Express obtains Firebase UID, loads AnnaSetu user profile from MongoDB.
6. Route-level authorization checks the stored AnnaSetu role and account state.
7. Only then is a protected action executed.
```

Firebase authentication proves the identity; MongoDB stores AnnaSetu-specific role, profile, verification, availability, and operational state. A UI check is for user experience only. Every protected Express route must repeat the authorization check.

### Roles and states

| Role | Account state | Access |
|---|---|---|
| `DONOR` | `ACTIVE` | Own reports, profile, notifications |
| `VOLUNTEER` | `PENDING` | Profile and verification status only |
| `VOLUNTEER` | `VERIFIED_ACTIVE` | Own offers, assignments, checkpoints, proof submission |
| `ADMIN` | `ACTIVE` | Admin interface and all authorized administrative functions |

The API must derive user identity from the verified token, never trust a submitted `userId`, `role`, or `admin=true` value from the browser.

## 5. MongoDB data design

Use MongoDB collections below. Store timestamps in UTC and convert only for display. Use ObjectIds for internal relations and retain `firebaseUid` as a unique field on `users`.

### `users`

```text
_id, firebaseUid (unique), role, accountStatus,
name, phone, email, profilePhotoRef,
createdAt, updatedAt
```

`accountStatus` includes `ACTIVE`, `PENDING`, `REJECTED`, and `SUSPENDED` as applicable. Admins must not be created through an ordinary role-selection screen.

### `volunteerProfiles`

```text
_id, userId (unique), verificationStatus, verificationNotes,
identityDocumentRef, address, serviceAreas[], availability[],
maximumDistanceKm, transportType, isAvailable,
completedRescues, mealsDistributed, reviewedBy, reviewedAt,
createdAt, updatedAt
```

Verification documents are sensitive. Their access is restricted to the profile owner where appropriate and authorized admin reviewers; they are never returned by general lists.

### `donations`

```text
_id, publicReference, donorId,
donorType, eventType, foodDescription, quantityMeals, handlingNotes,
preparedAt, safeConsumptionDeadline,
foodPhotoRef, pickupContact, alternateContact,
pickupLocation { address, latitude, longitude, placeId? },
status, statusReason,
destinationId, assignedVolunteerId, assignmentResponseBy,
createdAt, updatedAt, completedAt?
```

`publicReference` is a non-sensitive readable reference such as `AS-2026-0001`; it is not an authorization secret. Exact contacts should be returned only to the assigned volunteer/admin for an active rescue.

### `destinations`

```text
_id, name, type, verificationStatus, active,
location { address, latitude, longitude, placeId? },
contactName?, contactPhone?, capacityNotes, operatingNotes,
createdBy, reviewedBy?, createdAt, updatedAt
```

Types may include `SHELTER`, `COMMUNITY_KITCHEN`, `NGO_POINT`, `FOOD_BANK`, `REGISTERED_ORGANIZATION`, and `NEED_ZONE`.

### `assignments`

```text
_id, donationId, volunteerId, destinationId,
status, offeredAt, responseBy, acceptedAt?, declinedAt?, declineReason?,
cancelledAt?, cancellationReason?, assignedBy, createdAt, updatedAt
```

Keep assignment records even after reassignment. Only one assignment may be active for a donation at a time.

### `rescueEvents`

```text
_id, donationId, assignmentId?, actorUserId?, actorRole,
eventType, fromStatus?, toStatus?, reason?,
location { latitude?, longitude?, address? },
metadata, createdAt
```

This is append-only application history. It powers the timeline and audit trail.

### `distributionProofs`

```text
_id, donationId (unique per submitted final proof), assignmentId, volunteerId,
photoRef, quantityDistributed, peopleServed,
distributedAt, distributionLocation { latitude?, longitude?, address? },
notes, reviewStatus, reviewedBy?, reviewedAt?, reviewNotes?, createdAt, updatedAt
```

### `notifications`

```text
_id, recipientId, type, title, body, donationId?, assignmentId?,
isRead, createdAt, readAt?
```

### File data

Food photos, proof photos, profile images, and verification documents must not be embedded as large base64 strings in ordinary documents. For the defined stack, store attachment binary data in MongoDB GridFS and store only the file reference plus metadata in the applicable record. Enforce size/type limits at the Express upload boundary. Do not place uploads, verification documents, or secrets in Git.

### Essential indexes

- `users.firebaseUid` unique;
- `volunteerProfiles.userId` unique;
- `donations.donorId + createdAt` for donor history;
- `donations.status + safeConsumptionDeadline` for admin urgency queue;
- `assignments.donationId + status` to enforce active assignment logic;
- `notifications.recipientId + isRead + createdAt` for inbox;
- geospatial `2dsphere` indexes on normalized pickup/destination GeoJSON fields if nearby filtering is implemented.

## 6. API contract

Use JSON over HTTPS. All error responses have a stable `code`, human-readable `message`, and optional field-level `details`; do not return stack traces or database internals.

### Authentication/profile

| Method and path | Who | Purpose |
|---|---|---|
| `GET /api/me` | authenticated | Return current safe profile, role, and permitted dashboard state |
| `POST /api/profiles/donor` | signed-in donor | Create/update donor profile fields |
| `POST /api/profiles/volunteer` | signed-in volunteer | Submit/update volunteer profile and preferences |
| `GET /api/notifications` | authenticated | List own notifications |
| `PATCH /api/notifications/:id/read` | recipient | Mark own notification read |

### Donor and rescue operations

| Method and path | Who | Purpose |
|---|---|---|
| `POST /api/donations` | donor | Create a submitted food report |
| `GET /api/donations/mine` | donor | List own reports |
| `GET /api/donations/:id` | owner/assigned volunteer/admin | Safe, role-filtered details |
| `PATCH /api/donations/:id` | donor before review or admin | Permitted corrections |
| `POST /api/donations/:id/cancel` | owner/admin | Cancel with reason |
| `POST /api/assignments/:id/accept` | assigned verified volunteer | Accept offer |
| `POST /api/assignments/:id/decline` | assigned verified volunteer | Decline offer/reason |
| `POST /api/donations/:id/arrival` | assigned volunteer | Record pickup arrival checkpoint |
| `POST /api/donations/:id/pickup` | assigned volunteer | Confirm collection |
| `POST /api/donations/:id/distribution-proof` | assigned volunteer | Submit evidence/form |

### Admin operations

| Method and path | Purpose |
|---|---|
| `GET /api/admin/dashboard` | Admin totals and urgent/active queues |
| `GET /api/admin/donations` | Filtered donation review list |
| `POST /api/admin/donations/:id/review` | Approve, clarify, reject, cancel, or flag with reason |
| `GET /api/admin/volunteers` | Verification and active-volunteer list |
| `POST /api/admin/volunteers/:id/review` | Activate/reject/suspend volunteer with notes |
| `GET, POST /api/admin/destinations` | List/create destinations |
| `PATCH /api/admin/destinations/:id` | Update/activate destination |
| `POST /api/admin/donations/:id/assignments` | Create controlled volunteer offer and destination plan |
| `POST /api/admin/assignments/:id/cancel` | Cancel/reassign with reason |
| `POST /api/admin/proofs/:id/review` | Complete, request clarification, or flag proof |

The server, not the client, selects/validates state transitions. The status transition service must write its `rescueEvents` audit item and notifications in the same successful application operation.

## 7. Core service logic

### Donation creation

1. Verify Firebase identity and `DONOR` role.
2. Validate fields, dates, image metadata, coordinate range, and required contact.
3. Ensure `preparedAt < safeConsumptionDeadline`.
4. Store attachment, donation record, `SUBMITTED` state, rescue event, and admin notification.

### Volunteer offer

1. Verify admin role.
2. Verify donation state is eligible and deadline has not passed.
3. Verify destination is active/approved and volunteer is active, available, and without conflicting active rescue.
4. Create assignment with response-by time.
5. Set donation state `ASSIGNED_AWAITING_ACCEPTANCE`.
6. Write audit event and notify volunteer.

### Proof submission/review

1. Verify the caller owns the accepted assignment and pickup exists.
2. Validate proof fields/photo and record the checkpoint.
3. Set `PROOF_SUBMITTED`, event, and admin notification.
4. Admin reviews checklist, records decision/notes, then completes or flags/clarifies.

## 8. Validation, safety, and security requirements

- Use HTTPS for all deployed traffic.
- Keep Firebase configuration, database connection string, Maps API key, and Firebase service credentials in environment variables; never commit real values.
- Verify Firebase ID tokens server-side on every protected request.
- Apply role/state authorization on every route and resource ownership check on every record lookup.
- Validate request body shape, IDs, dates, numeric ranges, phone/contact format, coordinate range, image MIME type and size.
- Rate-limit and log authentication-adjacent and upload endpoints when implementation begins.
- Use generic error messages for login/access failures and never expose secrets, tokens, precise unrelated contacts, verification documents, or internal error traces.
- Restrict uploaded proof/photos to intended viewers. Verification documents require stricter admin-only access.
- Keep audit records append-only from application routes; ordinary users cannot edit old checkpoints.
- Use MongoDB backups and test restore procedures in deployment. Backups are operational protection, not a feature users see.

## 9. Configuration contract

Define a checked-in `.env.example` with variable names only, for example:

```text
NODE_ENV=
PORT=
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_MAPS_API_KEY=
```

Do not use example values that look real. The server-only Firebase credentials must never be exposed to the React client; client-side Firebase configuration must be limited to its intended public configuration values.

## 10. Deployment and operations guidance

1. Build the React/Vite interfaces as static frontend assets.
2. Run the Node/Express API in an environment with environment-variable configuration and HTTPS.
3. Provide secure network access from the API to MongoDB.
4. Register approved production origins for the frontend and restrict API CORS to them.
5. Configure Maps API key restrictions for approved web origins/API usage.
6. Seed or create the first admin using a controlled operational process, never a public “become admin” button.
7. Create a health endpoint that verifies only service liveness; it must not expose private configuration.
8. Monitor server errors and backup health without storing passwords, tokens, or sensitive personal data in logs.

## 11. Testing contract

### Unit tests

- deadline and status-transition validation;
- role/state guards;
- matching eligibility calculation;
- ownership checks;
- proof/pickup sequencing.

### Integration tests

- Firebase-token verification boundary (using safe test identities);
- donor report → admin review → assignment → volunteer acceptance → pickup → proof → completion;
- decline, timeout, cancellation, and expired-deadline paths;
- isolation: donor A cannot access donor B’s report; unverified volunteer cannot accept; volunteer cannot access admin route.

### Interface tests

- mobile layouts on small screens for donor/volunteer;
- desktop workflow readability for admin;
- large touch targets, clear urgency state, error messages, loading states, and keyboard/basic accessibility behavior.

## 12. Non-goals and future technical extensions

Do not add these before the MVP works end-to-end: payments, SMS/WhatsApp providers, continuous GPS tracking, AI model services, route optimization, beneficiary logins, rewards ledger, or external NGO integrations. They need their own requirements, permissions, and data/security review. The current design keeps these out without blocking later extension.
