// Placeholder data for the admin dashboard.
// Subscribers stand in for a future backend response. Once the subscribers
// backend + API exist, replace the AdminDataContext seed with real fetches.
// (Messages already moved to React Query — see src/api/messages.api.ts.)

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string; // ISO string
}

export const mockSubscribers: Subscriber[] = [
  { id: "s1", email: "investor@blackstone.com", createdAt: "2026-07-23T10:00:00.000Z" },
  { id: "s2", email: "chidi.okeke@gmail.com", createdAt: "2026-07-21T18:20:00.000Z" },
  { id: "s3", email: "amara@ventures.africa", createdAt: "2026-07-19T07:45:00.000Z" },
  { id: "s4", email: "j.williams@realtorsfirst.co", createdAt: "2026-07-17T14:10:00.000Z" },
  { id: "s5", email: "team@100pay.co", createdAt: "2026-07-12T09:55:00.000Z" },
  { id: "s6", email: "hello@pageboyinteriors.com", createdAt: "2026-07-08T16:30:00.000Z" },
];
