export const DONATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CLARIFICATION_REQUIRED: 'CLARIFICATION_REQUIRED',
  APPROVED_FOR_MATCHING: 'APPROVED_FOR_MATCHING',
  ASSIGNED_AWAITING_ACCEPTANCE: 'ASSIGNED_AWAITING_ACCEPTANCE',
  ACCEPTED: 'ACCEPTED',
  VOLUNTEER_AT_PICKUP: 'VOLUNTEER_AT_PICKUP',
  PICKED_UP: 'PICKED_UP',
  DISTRIBUTION_IN_PROGRESS: 'DISTRIBUTION_IN_PROGRESS',
  PROOF_SUBMITTED: 'PROOF_SUBMITTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  FLAGGED: 'FLAGGED'
};

export const STATUS_CONFIG = {
  [DONATION_STATUS.DRAFT]: {
    label: 'Draft',
    variant: 'neutral',
    description: 'Report not yet submitted.'
  },
  [DONATION_STATUS.SUBMITTED]: {
    label: 'Submitted',
    variant: 'info',
    description: 'Food report received; awaiting admin operational review.'
  },
  [DONATION_STATUS.UNDER_REVIEW]: {
    label: 'Under Review',
    variant: 'info',
    description: 'Admin is verifying food safety, deadline, and destination.'
  },
  [DONATION_STATUS.CLARIFICATION_REQUIRED]: {
    label: 'Clarification Needed',
    variant: 'urgent',
    description: 'Admin requested details from donor before assignment.'
  },
  [DONATION_STATUS.APPROVED_FOR_MATCHING]: {
    label: 'Approved for Matching',
    variant: 'info',
    description: 'Approved; searching for nearby available verified volunteers.'
  },
  [DONATION_STATUS.ASSIGNED_AWAITING_ACCEPTANCE]: {
    label: 'Offer Sent',
    variant: 'urgent',
    description: 'Assigned to a volunteer; waiting for prompt acceptance.'
  },
  [DONATION_STATUS.ACCEPTED]: {
    label: 'Rescue Accepted',
    variant: 'success',
    description: 'Volunteer accepted rescue and is en route to pickup.'
  },
  [DONATION_STATUS.VOLUNTEER_AT_PICKUP]: {
    label: 'At Pickup Location',
    variant: 'info',
    description: 'Volunteer arrived at donor premises.'
  },
  [DONATION_STATUS.PICKED_UP]: {
    label: 'Food Picked Up',
    variant: 'info',
    description: 'Surplus food collected securely by volunteer.'
  },
  [DONATION_STATUS.DISTRIBUTION_IN_PROGRESS]: {
    label: 'In Transit to Dropoff',
    variant: 'info',
    description: 'Volunteer is transporting food to the approved destination.'
  },
  [DONATION_STATUS.PROOF_SUBMITTED]: {
    label: 'Proof Under Review',
    variant: 'urgent',
    description: 'Distribution evidence submitted; awaiting admin completion check.'
  },
  [DONATION_STATUS.COMPLETED]: {
    label: 'Rescue Completed',
    variant: 'success',
    description: 'Verified & closed. Meals safely nourished the community!'
  },
  [DONATION_STATUS.CANCELLED]: {
    label: 'Cancelled',
    variant: 'danger',
    description: 'Rescue was cancelled.'
  },
  [DONATION_STATUS.REJECTED]: {
    label: 'Rejected',
    variant: 'danger',
    description: 'Report was declined due to food safety or logistics constraints.'
  },
  [DONATION_STATUS.EXPIRED]: {
    label: 'Deadline Expired',
    variant: 'danger',
    description: 'Safe consumption deadline passed before distribution.'
  },
  [DONATION_STATUS.FLAGGED]: {
    label: 'Flagged for Review',
    variant: 'urgent',
    description: 'Evidence requires administrative clarification.'
  }
};
