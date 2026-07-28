// Placeholder data for the admin dashboard.
// These arrays stand in for the future backend responses. Once the
// backend + API exist, replace the AdminDataContext seed with real fetches.

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  createdAt: string; // ISO string
  read: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string; // ISO string
}

export const mockMessages: ContactMessage[] = [
  {
    id: "m0",
    name: "Adaeze Nwankwo",
    email: "adaeze.nwankwo@meridiancapitalpartners.africa",
    reason: "Strategic Partnership",
    subject:
      "Proposal for a multi-year advisory partnership across our real estate, private equity, and executive education verticals",
    message:
      "Dear Ugo,\n\nI hope this message finds you well. I am writing on behalf of Meridian Capital Partners, a pan-African investment firm managing a diversified portfolio across real estate development, private equity, and infrastructure, with active mandates in Nigeria, Ghana, Kenya, and Rwanda. Over the past eighteen months our leadership team has followed your work closely — from the institutional frameworks you have championed through HXafrica to your writing on the strategy-execution gap that so often undermines otherwise sound ventures on the continent. Your perspective resonates deeply with the challenges we are actively grappling with as we scale.\n\nLet me give you some context on why we are reaching out now. We are at an inflection point. Our real estate arm has grown from three flagship developments to a pipeline of over twenty projects spanning residential, mixed-use, and commercial assets, and the operational complexity has outpaced the systems and leadership depth we built in our earlier, more entrepreneurial phase. We have capable people, capital, and access to land and deal flow — what we lack is a coherent, repeatable operating model that translates our strategic ambitions into disciplined execution on the ground, project after project, market after market.\n\nWe are therefore exploring a multi-year advisory partnership rather than a one-off engagement, and we believe you are uniquely positioned to help us in three specific areas:\n\nFirst, real estate strategy and institutional structuring. We want to move from opportunistic, relationship-driven deals toward an institutional-grade investment process with clear underwriting standards, governance, and risk controls that would satisfy international limited partners. Your experience building credible real estate vehicles in the Nigerian context would be invaluable here.\n\nSecond, executive mentorship and leadership development. We have identified roughly a dozen high-potential leaders across our verticals whom we would like you to mentor over an extended period — not through generic training, but through the kind of direct, candid, execution-focused guidance you are known for. Several of them will be stepping into managing-director roles within the next two years, and the cost of getting those transitions wrong is significant.\n\nThird, thought leadership and market positioning. As we prepare to raise our next fund, we want to sharpen how we articulate our differentiated view of the African opportunity to global allocators. We would value your counsel on positioning, and potentially a series of co-authored perspectives or joint speaking engagements that establish our firm as a serious, strategy-led institution.\n\nOn commercials, we are flexible and prepared to structure this in whatever way best reflects the value and the time commitment — whether that is a retainer, an equity-linked arrangement, a hybrid, or a per-mandate structure. We would rather find the right long-term alignment than negotiate a narrow scope.\n\nAs a first step, could we schedule a ninety-minute exploratory session in Lagos or virtually within the next two to three weeks? I would come prepared with our current strategy deck, a candid assessment of where we believe our execution is breaking down, and the profiles of the leaders we hope you might mentor. If it would help, I am also happy to arrange for you to meet two or three members of our investment committee so you can gauge whether the chemistry and the mission feel right to you before either side commits to anything.\n\nThank you for taking the time to read this rather long note — I felt it was better to be thorough than to be vague. We have a great deal of respect for your work and would consider it a genuine privilege to build something enduring together.\n\nWith warm regards,\nAdaeze Nwankwo\nManaging Partner, Meridian Capital Partners",
    createdAt: "2026-07-24T13:05:00.000Z",
    read: false,
  },
  {
    id: "m1",
    name: "Aliko Dangote",
    email: "office@dangote.com",
    reason: "Strategic Partnership",
    subject: "Joint venture in Abuja real estate",
    message:
      "Ugo, I came across HXafrica and would like to explore a strategic partnership around institutional real estate in the FCT. Could we schedule a call next week?",
    createdAt: "2026-07-22T09:14:00.000Z",
    read: false,
  },
  {
    id: "m2",
    name: "Ngozi Okonjo",
    email: "ngozi@example.org",
    reason: "Speaking Engagement",
    subject: "Keynote — Africa Fintech Summit",
    message:
      "We would be honored to have you deliver the closing keynote on the strategy-execution gap. Please let me know your availability and terms.",
    createdAt: "2026-07-20T15:42:00.000Z",
    read: true,
  },
  {
    id: "m3",
    name: "David Mensah",
    email: "d.mensah@startup.co",
    reason: "Executive Mentorship",
    subject: "Mentorship for an early-stage SME",
    message:
      "I run a proptech startup in Accra and would value your mentorship on scaling our brokerage operations sustainably.",
    createdAt: "2026-07-18T11:05:00.000Z",
    read: false,
  },
  {
    id: "m4",
    name: "Fatima Bello",
    email: "fatima.bello@media.ng",
    reason: "Media Inquiry",
    subject: "Interview request — 2026 tax system",
    message:
      "Requesting a 30-minute interview on how SMEs should prepare for the new NRS requirements. Deadline is end of month.",
    createdAt: "2026-07-15T08:30:00.000Z",
    read: true,
  },
];

export const mockSubscribers: Subscriber[] = [
  { id: "s1", email: "investor@blackstone.com", createdAt: "2026-07-23T10:00:00.000Z" },
  { id: "s2", email: "chidi.okeke@gmail.com", createdAt: "2026-07-21T18:20:00.000Z" },
  { id: "s3", email: "amara@ventures.africa", createdAt: "2026-07-19T07:45:00.000Z" },
  { id: "s4", email: "j.williams@realtorsfirst.co", createdAt: "2026-07-17T14:10:00.000Z" },
  { id: "s5", email: "team@100pay.co", createdAt: "2026-07-12T09:55:00.000Z" },
  { id: "s6", email: "hello@pageboyinteriors.com", createdAt: "2026-07-08T16:30:00.000Z" },
];
