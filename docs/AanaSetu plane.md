# AnnaSetu — Product Plan and Operating Workflow

## 1. Purpose and fixed scope

AnnaSetu is a surplus-food rescue and redistribution platform. Its purpose is to coordinate food that is still suitable for timely consumption from a donor to a verified volunteer and then to an approved distribution point or verified need zone.

The primary donor use case is surplus food after a wedding, party, ceremony, community function, college/company event, or catered event. Hotels, restaurants, and caterers are supported as secondary donor types.

AnnaSetu is a coordination and accountability platform. It does **not** promise that every food item is safe, that a photo is absolute proof, or that a beneficiary must use a phone. The responsible admin verifies the available information and makes the assignment decision.

### Fixed product decisions

- One main AnnaSetu application serves both donors and volunteers.
- A user authenticates, then sees only the personal panel for their assigned role.
- The admin uses a separate authenticated dashboard, backed by the same API and database.
- Donor and volunteer screens are mobile-first; the admin dashboard is desktop-first.
- Beneficiaries do not create accounts.
- Admins control approval, volunteer verification, assignment, monitoring, and proof review.
- The MVP uses in-app notifications. SMS, WhatsApp, push notifications, and payments are not MVP features.
- The MVP is deadline-driven: the pickup/deadline is central to every rescue.

## 2. The problem being solved

Useful cooked food is often left after an event, but it can only be rescued for a short time. Donors need a simple way to report the food and its pickup details; volunteers need a clear, verified assignment; admins need visibility and a record of the outcome. People in need may not have devices or internet access, so AnnaSetu coordinates through known distribution points or approved need zones rather than requiring individual beneficiary accounts.

## 3. People and responsibilities

| Role | Uses | Main responsibility | Cannot do in MVP |
|---|---|---|---|
| Donor | Main app | Report food and follow its status | Assign volunteers, approve proof, view admin data |
| Volunteer | Main app | Accept assigned rescue, pick up, distribute, submit evidence | Self-approve, alter deadlines, assign themselves arbitrary donations |
| Admin | Separate admin panel | Verify, match, assign, monitor, and close rescues | Treat unverified evidence as automatically final |
| Beneficiary | No platform account | Receive food through the distribution plan | Log in, accept tasks, or access donor/volunteer data |
| Distribution point / need zone | Admin-managed record | Destination for a rescue | A standalone user role in the MVP |

## 4. MVP journey: REPORT → VERIFY → ASSIGN → PICK UP → DISTRIBUTE → REVIEW → COMPLETE

### Step 0 — Account and readiness

1. A donor registers or signs in and selects/has the `DONOR` role.
2. A volunteer registers, supplies the required profile and verification information, and sets service preferences: area, available days/times, maximum travel distance, and transport type.
3. The volunteer remains `PENDING` until an admin verifies and activates the profile.
4. An admin signs in separately. Admin access is never inferred from the interface alone; it is checked by the backend.

### Step 1 — Donor reports surplus food

The donor selects **Report Surplus Food** and submits:

- donor/event type (wedding, party, ceremony, event, caterer, hotel, restaurant, other);
- food description and approximate quantity/servings;
- preparation time;
- safe-consumption / pickup deadline (not a casual “expiry” label);
- food photograph;
- pickup address and map location;
- contact and alternate contact details; and
- any handling notes.

The app validates required fields and makes the deadline visible. The report is saved as `SUBMITTED`; it is not offered to a volunteer yet.

### Step 2 — Admin verifies the report and prepares a plan

The admin reviews the food details, photo, contactability, location, quantity, preparation time, deadline, and operational feasibility. The admin either:

- approves it for matching;
- requests clarification/correction; or
- rejects/cancels it with a recorded reason.

For an approved donation, the admin selects an existing verified distribution point or need zone and checks whether a suitable volunteer is available. The destination is a controlled hand-off target such as a shelter, community kitchen, NGO point, food bank, registered local organization, or an admin-approved distribution zone. The app never assumes the volunteer should search randomly for people on the street.

### Step 3 — Admin assigns a volunteer

The admin considers the deadline, distance, volunteer availability, service area, maximum distance, transport type, and food quantity. The assignment is sent as an in-app notification with enough information to decide:

- meals/quantity;
- pickup deadline and countdown;
- pickup area;
- distribution destination;
- approximate distance; and
- accept / decline action.

The donation becomes `ASSIGNED_AWAITING_ACCEPTANCE`. It is assigned to one volunteer at a time. If the volunteer declines, does not respond before the response window, or the assignment is cancelled, the admin records the outcome and can assign another verified volunteer.

### Step 4 — Volunteer accepts and reaches the pickup

When the volunteer accepts, the donation becomes `ACCEPTED`. The volunteer sees the donor contact, pickup map, food summary, destination, and deadline. The volunteer may use the map location to navigate.

At the location, the volunteer marks **Arrived at pickup**. This creates a time/location checkpoint visible to the donor and admin. After collecting the food, the volunteer confirms **Picked up**. The donor and admin receive an in-app status update.

### Step 5 — Distribution and evidence

The volunteer travels to the assigned distribution point or need zone. On distribution, the volunteer submits:

- distribution photograph;
- number of people served;
- quantity distributed;
- distribution time and location checkpoint; and
- a short note, including any quantity not distributed.

Submission changes the rescue to `PROOF_SUBMITTED`, not immediately final. The application records the volunteer, donation, timestamps, location data supplied at checkpoints, and evidence attachment reference.

### Step 6 — Admin proof review and completion

The admin compares the assignment, pickup checkpoint, distribution checkpoint, quantity, photo, timestamp, and destination plan. The admin then:

- marks it `COMPLETED` if the record is satisfactory;
- requests clarification if something is missing; or
- flags/escalates it for review.

The donor sees a completed rescue summary after completion. A submitted photograph is supporting evidence, not an automatic guarantee of perfect distribution.

## 5. Status model and safe transitions

```text
DRAFT
  → SUBMITTED
  → UNDER_REVIEW
  → APPROVED_FOR_MATCHING
  → ASSIGNED_AWAITING_ACCEPTANCE
  → ACCEPTED
  → VOLUNTEER_AT_PICKUP
  → PICKED_UP
  → DISTRIBUTION_IN_PROGRESS
  → PROOF_SUBMITTED
  → COMPLETED

At any appropriate earlier point:
  → CLARIFICATION_REQUIRED | REJECTED | CANCELLED | EXPIRED
```

Only the API may advance a status. Every transition creates a timestamped activity entry stating the actor, old status, new status, and optional reason. The system blocks transitions that skip required milestones: for example, proof cannot be submitted before pickup is confirmed.

## 6. Time and communication rules

There is no universal fixed duration because food safety and event timing vary. Each donation has an admin-visible and volunteer-visible deadline. The UI displays a countdown and urgency state.

Example only:

```text
07:05  Donor reports food
07:05–07:10  Admin verifies and prepares assignment
07:10  Volunteer receives in-app assignment
07:12  Volunteer accepts
07:30  Volunteer arrives at pickup
07:35  Food is picked up
07:50  Food reaches the distribution destination
08:00  Evidence is submitted for admin review
```

In the MVP, notifications are generated for important events: report received, clarification requested, assignment received, accepted/declined, arrived, picked up, proof submitted, completed, cancelled, and approaching/expired deadline. They are read inside AnnaSetu; they are not SMS or WhatsApp messages.

## 7. MVP boundaries

### Included in MVP

- Firebase-authenticated donor, volunteer, and admin access;
- role-based personal dashboards;
- donor food reports with photo and location;
- volunteer registration and admin approval;
- admin-controlled destination selection and volunteer assignment;
- in-app notifications;
- checkpoint-based pickup/distribution tracking;
- map-based locations and distance assistance;
- proof submission and admin review;
- donation history and basic impact counts.

### Explicitly future work

- SMS, WhatsApp, native push, or email delivery;
- monetary payment, reimbursement, fuel payment, or wallet;
- volunteer rewards, points, badges, certificates, or partner incentives;
- automatic AI matching, prediction, or route optimization;
- continuous live tracking of volunteers;
- beneficiary apps/accounts and demand requests;
- automated legal/compliance decisions;
- third-party partner integrations.

## 8. Delivery plan

| Phase | Outcome |
|---|---|
| 1. Foundation | React/Vite clients, Express API, MongoDB connection, Firebase Auth setup, role guards |
| 2. Identity and roles | Registration/login, profile records, volunteer verification queue, admin login/authorization |
| 3. Donor flow | Food report form, image capture/upload, location selection, active/history views |
| 4. Admin control | Donation review, distribution destinations, volunteer matching and assignment |
| 5. Rescue execution | Volunteer offer, accept/decline, pickup and distribution checkpoints, evidence form |
| 6. Visibility | Notifications, activity timeline, admin monitoring list/map, impact counters |
| 7. Quality | Field validation, permissions, expired/cancelled handling, testing, responsive review |

## 9. Acceptance checklist for the working prototype

The MVP is demonstrably complete when an evaluator can sign in as each role and successfully perform this controlled scenario:

1. A donor reports event surplus with deadline, photo, and pickup location.
2. An admin reviews and approves the report, selects a destination, and assigns an approved volunteer.
3. The volunteer receives an in-app offer, accepts it, and records arrival/pickup.
4. The volunteer submits distribution details and a photograph.
5. The admin reviews the evidence and completes the rescue.
6. The donor, volunteer, and admin each see only the information and actions appropriate to their role.

## 10. Operational cautions

- Food should only be approved when the available timing and handling information supports a responsible decision. Real deployment must confirm applicable local food-safety and operating requirements.
- Donor contacts, volunteer verification information, precise locations, and photographs are sensitive. Show them only to the roles that need them for the current rescue.
- A proof photograph must be treated as evidence for review, not a claim of certainty.
- An expired deadline stops new assignment and should prominently alert the admin.
