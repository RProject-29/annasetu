# AnnaSetu — UI, Interface, and Experience Style Guide

## 1. Design mandate

AnnaSetu has two different interface priorities:

- **Donor and volunteer:** one mobile-first AnnaSetu app. Design for people using a phone during a time-sensitive event, often with one hand and limited time.
- **Admin:** a separate authenticated desktop-first dashboard. Design for review, assignment, mapping, monitoring, and verification work on a larger screen.

Do not begin with a desktop layout and merely shrink it for mobile. For the main app, mobile is the primary design. Desktop/tablet behavior is an adaptation. The admin dashboard is the stated exception.

## 2. Product personality

The interface should feel calm, trustworthy, urgent when necessary, and respectful. It should not feel like a social network, a food-delivery marketplace, or a gamified reward app.

Use plain, supportive actions:

- **Report surplus food**
- **Review request**
- **Accept rescue**
- **Arrived at pickup**
- **Confirm pickup**
- **Submit distribution proof**
- **Review proof**

Avoid language that overpromises. Prefer “Proof submitted for review” over “Food delivery fully verified.” Prefer “Safe-consumption deadline” over “expiry” for cooked food.

## 3. Shared visual rules

### Layout and spacing

- Use one primary action per mobile screen.
- Keep content in clear cards with a strong title, key facts, and a single next action.
- Use generous spacing and a predictable vertical order: status/urgency → core facts → supporting details → action.
- Keep controls finger-friendly. Interactive targets should be comfortably tappable, with space between destructive and non-destructive actions.
- Keep important action controls reachable near the bottom of a mobile screen; ensure fixed bottom navigation never hides form submission actions.
- Never rely only on color to explain a status; pair color with a text label and icon/shape where useful.

### Typography and writing

- Use a legible sans-serif system font stack.
- Favor short labels and readable sentences over dense administrative wording.
- Use a clear hierarchy: page title, card title, key value, supporting label, helper text.
- Quantities should be written consistently: `150 meals`, `2.4 km`, `Pickup before 8:30 PM`.
- Display local user-facing times while retaining UTC in the system data.

### Color and status semantics

The exact palette can be chosen during implementation, but its semantic meaning must stay consistent.

| Meaning | Suggested treatment | Always show text |
|---|---|---|
| Primary action / confirmed | accessible green family | `Completed`, `Available`, `Confirmed` |
| Urgent / deadline near | amber/orange family | `Pickup deadline approaching` |
| Error / cancelled / expired | red family | `Expired`, `Cancelled`, `Action needed` |
| Informational / pending | blue/neutral family | `Awaiting review`, `Assigned` |
| Disabled / unavailable | muted neutral | `Unavailable` |

Red must not be the default accent. Urgency should be noticeable but should not make the screen stressful when a rescue is still actionable.

### Icons and imagery

- Use familiar icons alongside labels: location pin, clock, camera, food container, person, notification.
- Do not use icon-only controls for critical actions.
- Food and proof photographs should have a visible capture/upload state, preview, error/retry state, and privacy-minded explanation where helpful.
- Maps are supporting context, not the only representation of a location. Always show a readable address or area label.

## 4. Main app navigation

### Donor navigation

Use a persistent bottom navigation on mobile:

```text
Home | Report | History | Profile
```

The Home screen emphasizes active donations and the primary **Report surplus food** action. “Report” may be a prominent central action if that improves the mobile layout.

### Volunteer navigation

Use a persistent bottom navigation on mobile:

```text
Home | Requests | Active | Profile
```

`Requests` shows only admin-offered assignments. `Active` shows only the volunteer’s active accepted rescue and its next checkpoint. Notification entry can appear in the header/inbox rather than occupying a bottom-nav slot.

### Shared navigation rules

- The app renders navigation based on the authenticated role.
- A donor must not see volunteer tasks; a volunteer must not see donor report controls.
- Deep links/routes that do not belong to the user’s role must redirect to an appropriate authorized screen, not expose a partial view.
- Logout is available from Profile/settings and confirms only if it would interrupt an unfinished form or active flow.

## 5. Donor screen specifications

### Donor home

Priority order:

1. active donation card, if any;
2. prominent **Report surplus food** button;
3. short impact/history summary;
4. unread notifications.

An active card shows status, meal quantity, pickup deadline countdown, next expected step, and **View status**. Do not make the donor search through a table to find the active rescue.

### Report surplus food flow

Use a short progressive form rather than one intimidating page. Show clear progress, allow back navigation, and preserve entered information locally while the form is open.

1. **Event and donor type** — wedding, party, ceremony, event, caterer, hotel, restaurant, other.
2. **Food details** — description, approximate meals/quantity, handling notes.
3. **Time safety context** — preparation time and safe-consumption/pickup deadline with concise helper text.
4. **Food photo** — camera/gallery selection, preview, replacement/removal before submit.
5. **Pickup place** — current location or map selection plus editable readable address.
6. **Contact and review** — primary/alternate contact, summary, declaration/confirm action.

At submit, show a confirmation screen with report reference, deadline, what happens next, and a clear **Track donation** action. Do not promise a pickup until the admin has approved and assigned it.

### Donation timeline/detail

Show a vertical timeline with plain-state copy:

```text
Reported → Under review → Volunteer assigned → Picked up → Proof under review → Completed
```

Show cancelled, clarification, or expired conditions at the top of the screen with a short explanation and the allowed next action. Hide the volunteer’s sensitive personal details unless needed for the active pickup.

## 6. Volunteer screen specifications

### Volunteer onboarding and status

The first volunteer screen after registration is not a rescue list. It is an application/verification state page:

```text
Submit details → Pending review → Verified and active
```

Collect profile, verification information, service area, availability, maximum distance, and transport type in manageable steps. Explain why each sensitive document is requested and show `Pending review` after submission. Before verification, the dashboard should not imply that the volunteer can accept work.

### Volunteer home

Show the current operational state first:

```text
Status: Available / On active rescue / Pending verification
```

Then show the nearest action: an assignment offer, current rescue card, or availability prompt. Supporting metrics (completed rescues/meals distributed) are secondary and must not turn volunteer work into a competition in the MVP.

### Assignment offer

An offer card/screen must let the volunteer make an informed decision quickly:

- quantity/meals;
- pickup deadline with countdown;
- pickup area/distance;
- assigned distribution destination/zone;
- transport/handling notes when provided; and
- large, separated **Accept** and **Decline** controls.

Acceptance should use a confirmation sheet/modal that reiterates the deadline and route commitment. Decline can offer optional short reasons. Do not present simultaneous offers in a way that lets the volunteer accidentally take conflicting rescues.

### Active rescue

Use a stepper with only the next valid action enabled:

```text
1. Accepted
2. Navigate to pickup
3. Arrived at pickup
4. Confirm pickup
5. Navigate to distribution point
6. Submit distribution proof
```

Every step shows map/address context, contact/action information only where required, deadline, and a visible way to report an issue to the admin. `Confirm pickup` must be a deliberate action with a short confirmation—not an accidental single tap.

### Distribution proof

The form includes photo, people served, quantity distributed, location/checkpoint display, and notes. Explain that the submission is reviewed by the admin. Validate missing fields inline and retain the draft if upload/network retry is necessary.

## 7. Admin dashboard specifications

### Desktop-first layout

Use a left sidebar and a dense but readable working area. Recommended primary sections:

```text
Dashboard
Donation Review
Assignments
Active Rescues
Volunteer Verification
Destinations / Need Zones
Proof Review
Users
Reports / Impact
```

Top-level dashboard content should highlight urgent operational work before aggregate numbers:

1. deadline-near/unreviewed donations;
2. offers waiting for response;
3. pickups/distributions in progress;
4. proofs awaiting review;
5. operational metrics.

### Admin tables and detail drawers

Use filters, status chips, sortable time/deadline columns, and a detail drawer/page. Avoid forcing the admin to inspect every record in a modal. The detail view should place the action and the evidence next to the relevant facts:

- donation information and photo;
- deadline and pickup map;
- donor contact (authorized view);
- selected destination;
- matching volunteer list/preferences;
- timeline/audit events;
- proof and review checklist.

### Assignment workspace

Show the donation and candidate volunteer information side-by-side. Candidate presentation can include availability, service area fit, distance, transport, current workload, and verification state. It should aid the human admin; it must not imply a hidden AI decision. The primary action is **Send assignment offer**, followed by a confirmation that identifies the volunteer and response deadline.

### Active rescue monitoring

Use a map/list combination. Each active rescue card shows the current status, deadline, assigned volunteer, pickup, destination, and latest deliberate checkpoint. Label this honestly as “latest update” or “last checkpoint,” not live tracking, unless continuous tracking is explicitly implemented later with user consent.

### Proof review

Place evidence beside a checklist and a clear decision:

```text
Photo present | quantity recorded | people served | location recorded | timeline checked

[Complete rescue]  [Request clarification]  [Flag for review]
```

Rejection/clarification/flagging requires a note. Completion asks for confirmation, then makes the record read-only to ordinary users.

## 8. Responsive behavior

| Surface | Primary layout | Responsive adaptation |
|---|---|---|
| Donor/Volunteer phone | one-column cards, bottom navigation, step-by-step forms | tablet gains width but keeps task flow and touch targets |
| Donor/Volunteer desktop | supportive responsive view only | no desktop-first assumptions or dense tables |
| Admin desktop | sidebar, table/map split, detail panels | tablet may collapse sidebar and stack map/list; mobile is limited but usable for urgent review |

## 9. States every screen must design

Every feature must include more than the happy path:

- loading/skeleton;
- empty state with a next action;
- network failure and retry;
- validation/error message next to the affected field;
- unauthorized/role-restricted state;
- deadline expired;
- pending verification;
- cancellation/decline;
- image upload progress/failure;
- notification read/unread;
- confirmation for irreversible or high-impact actions.

Do not hide an error behind a generic toast alone. Keep the field-level issue visible until the user fixes it.

## 10. Accessibility and trust essentials

- Use sufficient contrast and text labels for every status.
- Make forms usable with keyboard focus on desktop and screen-reader-friendly labels/validation semantics.
- Avoid time limits for filling forms; only the food deadline is time-sensitive.
- Ask location/camera permissions at the moment they are needed and explain the purpose.
- Minimize display of phone numbers, exact home addresses, identity documents, and photos. Show sensitive data only to authorized roles for an active task.
- Provide human-readable confirmation after every consequential action.

## 11. UI elements that are not MVP

Do not design payment flows, wallet screens, beneficiary registration, public social feeds, reward leaderboards, always-on live-tracking maps, chatbot/AI surfaces, or SMS/WhatsApp settings as active MVP features. Future rewards can be represented only as a future roadmap note, not a live interface promise.

## 12. Visual completion checklist

- Main app is usable at common narrow mobile widths without horizontal scrolling.
- The primary action is obvious on each donor/volunteer screen.
- All deadline-bearing screens visibly show urgency and local time.
- Status wording matches the system state model exactly.
- Donor and volunteer UIs never expose each other’s actions.
- Admin can review a report, send an offer, monitor checkpoints, and review proof without losing context.
- The interface distinguishes “submitted,” “under review,” and “completed”; it never marks proof as final before admin review.
