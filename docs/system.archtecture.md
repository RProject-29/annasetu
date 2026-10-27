# AnnaSetu — Functional System Architecture

## 1. System statement

AnnaSetu has two user-facing interfaces and one shared system of record:

```text
Mobile-first AnnaSetu main app                Desktop-first AnnaSetu admin panel
Donor panel + Volunteer panel                 Authenticated Admin panel
                 \                                     /
                  \                                   /
                     Shared API and business rules
                                |
               MongoDB application records + Firebase identity
                                |
                   Maps API for locations and directions
```

Donor and volunteer are two roles in the same main app, not two separate products. After authentication, the role recorded by AnnaSetu determines the available dashboard, routes, API actions, and data. The admin panel is a distinct interface because administration needs broader review and monitoring tools; it still uses the same backend and database.

## 2. Access and role behavior

### Donor

The donor may create drafts/reports, edit a report before review when allowed, respond to clarification, view their own active and past donations, and see the rescue timeline. The donor never selects a volunteer, sees unrelated volunteers, views another donor’s reports, or approves completion.

### Volunteer

A volunteer cannot execute rescues until the profile has admin status `VERIFIED_ACTIVE`. The volunteer sees their own availability/profile, assigned offers, accepted rescues, route locations, action timeline, notifications, and personal history. In the MVP they do not browse/claim all reports; admin assignment creates the offer.

### Admin

An admin reviews reports and volunteer applications, maintains distribution-point/need-zone records, selects a destination, assigns a volunteer, observes rescue checkpoints, reviews proof, and audits status history. Admin actions must record which admin acted and why when the action rejects, cancels, reassigns, or flags work.

### Beneficiary and distribution destination

Beneficiaries have no identity/account in the application. A destination is a trusted administrative record—not a login role—containing a name/zone, location, contact/operating notes, and active/verified state. It is selected by the admin for a specific rescue.

## 3. Core functional modules

| Module | What it does | Main users |
|---|---|---|
| Identity and profiles | Links Firebase identity to AnnaSetu role/profile and access state | All authenticated users |
| Food reports | Creates and displays donor reports with deadline, photo, pickup point and contact | Donor, Admin |
| Volunteer verification | Stores application/preferences and lets admin activate/reject | Volunteer, Admin |
| Destination management | Maintains approved distribution points and need zones | Admin |
| Assignment | Finds appropriate verified volunteers and creates one controlled rescue offer | Admin, Volunteer |
| Rescue workflow | Records accept/decline, arrival, pickup, distribution, and evidence | Volunteer, Donor, Admin |
| Notifications | Shows in-app event notices with read/unread state | All authenticated roles |
| Maps and checkpoints | Captures/shows authorized locations and travel context | Volunteer, Admin; limited donor view |
| Review and impact | Lets admin close records and shows counters/history | Admin; own-history view for donor/volunteer |

## 4. End-to-end functional flow

```text
Donor submits a report
    ↓
System validates required details and creates SUBMITTED record
    ↓
Admin reviews → clarification / reject / approve for matching
    ↓
Admin chooses an approved destination and a verified volunteer
    ↓
Volunteer receives in-app assignment offer
    ↓
Volunteer accepts or declines
    ├── decline/timeout → Admin reassigns or cancels
    └── accept → volunteer follows pickup location
                       ↓
                arrival checkpoint
                       ↓
                pickup confirmation
                       ↓
                assigned destination / zone
                       ↓
                distribution evidence submitted
                       ↓
                admin reviews → completed / clarification / flagged
```

## 5. Donation state machine

| State | Entered by | Meaning | Allowed next state(s) |
|---|---|---|---|
| `DRAFT` | Donor | Unsubmitted form | `SUBMITTED`, `CANCELLED` |
| `SUBMITTED` | Donor/API | Awaiting review | `UNDER_REVIEW`, `CANCELLED`, `EXPIRED` |
| `UNDER_REVIEW` | Admin | Admin is checking details | `CLARIFICATION_REQUIRED`, `APPROVED_FOR_MATCHING`, `REJECTED`, `EXPIRED` |
| `CLARIFICATION_REQUIRED` | Admin | Donor must supply/change detail | `SUBMITTED`, `CANCELLED`, `EXPIRED` |
| `APPROVED_FOR_MATCHING` | Admin | Eligible for controlled assignment | `ASSIGNED_AWAITING_ACCEPTANCE`, `CANCELLED`, `EXPIRED` |
| `ASSIGNED_AWAITING_ACCEPTANCE` | Admin | One volunteer has an offer | `ACCEPTED`, `APPROVED_FOR_MATCHING`, `CANCELLED`, `EXPIRED` |
| `ACCEPTED` | Volunteer | Volunteer committed to rescue | `VOLUNTEER_AT_PICKUP`, `CANCELLED`, `EXPIRED` |
| `VOLUNTEER_AT_PICKUP` | Volunteer | Arrival checkpoint recorded | `PICKED_UP`, `CANCELLED`, `EXPIRED` |
| `PICKED_UP` | Volunteer | Food collected | `DISTRIBUTION_IN_PROGRESS`, `PROOF_SUBMITTED`, `CANCELLED` |
| `DISTRIBUTION_IN_PROGRESS` | Volunteer/API | Moving toward assigned destination | `PROOF_SUBMITTED`, `CANCELLED` |
| `PROOF_SUBMITTED` | Volunteer | Evidence awaits admin review | `COMPLETED`, `CLARIFICATION_REQUIRED`, `FLAGGED` |
| `COMPLETED` | Admin | Rescue record closed successfully | none |
| `REJECTED`, `CANCELLED`, `EXPIRED`, `FLAGGED` | Authorized actor | Closed or exceptional outcome | `UNDER_REVIEW` only if admin explicitly reopens where appropriate |

`EXPIRED` is system-enforced when the deadline is reached before a permitted completion point. Any exceptional transition must retain a reason and audit entry.

## 6. Assignment rules

The MVP uses transparent rule-based matching, not AI. The admin is always the final decision-maker.

1. Filter to `VERIFIED_ACTIVE` volunteers who are available.
2. Prefer volunteers whose service area, available time, and maximum distance fit the rescue.
3. Consider transport type, expected food quantity, deadline urgency, and current active assignment.
4. Select/override manually in the admin panel.
5. Create a single offer with a response-by time derived from the deadline.
6. On decline or timeout, return the donation to `APPROVED_FOR_MATCHING` and notify the admin.

The system should never silently overwrite an active accepted assignment. Reassignment after acceptance requires admin cancellation/exception handling and a recorded reason.

## 7. Checkpoints, maps, and monitoring

Maps are used to select, store, display, and navigate between pickup and distribution locations. The functional MVP supports three deliberate checkpoints:

1. pickup location from donor report;
2. volunteer arrival/pickup confirmation; and
3. volunteer distribution evidence location.

Admin monitoring shows status, last checkpoint, assigned volunteer, deadline, and relevant map pins. It does **not** claim continuous live tracking in the MVP. Continuous background live location is future work because it changes consent, privacy, battery, and operational requirements.

## 8. Evidence review rules

The required distribution submission contains a photograph, quantity distributed, people served, timestamp, location information, and note. The admin compares it with the assignment plan and the pickup/distribution timeline.

The admin checklist is:

- correct volunteer and donation;
- pickup was confirmed;
- reported time remains operationally credible;
- submitted location corresponds to the assigned destination/zone where possible;
- food quantity and people served are plausible and recorded;
- photo is present and relevant; and
- anomalies are documented.

The result is a decision record, not a false guarantee. Admin may request clarification or flag the record instead of completing it.

## 9. Notifications and activity timeline

Each important mutation writes both an activity item and targeted in-app notifications. The activity timeline is the authoritative visible history for a donation; a notification is a user alert and can be marked read without deleting the underlying event.

| Event | Donor | Volunteer | Admin |
|---|---:|---:|---:|
| Report received / clarification | yes | no | yes |
| Assignment offered | no | yes | yes |
| Accepted/declined | yes when accepted | yes | yes |
| Arrival / picked up | yes | yes | yes |
| Proof submitted | no | yes | yes |
| Completed/cancelled/expired | yes | yes if assigned | yes |

## 10. Critical business rules

- Deadline must be later than preparation time and must be provided before submit.
- Only verified active volunteers can be assigned or accept.
- Only the assigned volunteer can create pickup/distribution progress for that donation.
- Only an admin can approve/reject reports, assign/reassign, manage destinations, and mark final completion.
- A user’s role must be enforced by the API, not merely hidden in the interface.
- Donors can see only their own donations; volunteers can see only their own offers/assignments; admin access is restricted to admin accounts.
- Food reports and proof submissions retain audit history; ordinary users cannot rewrite historical checkpoints.
- Deadline expiry and cancellation must be visible and explainable to the affected users.

## 11. What is intentionally not claimed

The MVP does not include online beneficiary registration, automatic payment/reimbursement, automatic proof certification, fully automated matching, automatic food-safety certification, or continuous GPS surveillance. These can be evaluated later without changing the controlled rescue workflow above.
