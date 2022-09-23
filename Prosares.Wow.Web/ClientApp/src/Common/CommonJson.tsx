export const TicketStatus = {
  NotStarted: 6,
  Responded: 7,
  ResolutionInProgress: 8,
  TestingInProgress: 9,
  Resolved: 10,
  Differed: 11,
  Cancelled: 12,
};

export const TaskStatus = {
  NotStarted: 1,
  InProgress: 2,
  OnHold: 3,
  Completed: 4,
};

export const TicketType = {
  repeated: 1,
  new: 0,
};

export const notChargableResonsOptions = [
  {
    value: 1,
    label: "Reason 1",
  },
  {
    value: 2,
    label: "Reason 2",
  },
  {
    value: 3,
    label: "Reason 3",
  },
  {
    value: 4,
    label: "Reason 4",
  },
];

export const leaveTypeOptions = [
  {
    value: 1,
    label: "Full Day",
  },
  {
    value: 2,
    label: "First Half",
  },
  {
    value: 3,
    label: "Second Half",
  },
  // {
  //   value: 4,
  //   label: "ML",
  // },
];

export const priorityOptions = [
  {
    value: 1,
    label: "Showstopper",
  },
  {
    value: 2,
    label: "Critical",
  },
  {
    value: 3,
    label: "Medium",
  },
  {
    value: 4,
    label: "Low",
  },
];

export const enagagementTypeOptions = [
  {
    value: 1,
    label: "AMC",
  },
  {
    value: 2,
    label: "PRODUCT",
  },
  {
    value: 3,
    label: "PROJECT",
  },
  {
    value: 4,
    label: "T&M",
  },
  {
    value: 5,
    label: "INTERNAL",
  },
];

export const poStatusOptions = [
  {
    value: 1,
    label: "Recieved",
  },
  {
    value: 2,
    label: "Expired",
  },
  {
    value: 3,
    label: "Pending",
  },
];

export const billingOptions = [
  {
    value: 1,
    label: "Monthly",
  },
  {
    value: 2,
    label: "Quarterly",
  },
  {
    value: 3,
    label: "Annual",
  },
  {
    value: 4,
    label: "Ticket Based",
  },
];

export const engagementStatusOptions = [
  {
    value: 1,
    label: "Not Started",
  },
  {
    value: 2,
    label: "In-Progress",
  },
  {
    value: 3,
    label: "Completed",
  },
];
