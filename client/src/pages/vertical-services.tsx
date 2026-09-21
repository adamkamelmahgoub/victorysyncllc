import { Link } from 'wouter';
import { useSeo } from '@/hooks/useSeo';

type Section = { heading: string; copy: string };
type Page = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Section[];
  closing: string;
};

const pages: Record<string, Page> = {
  '/appointment-setting-for-home-services': {
    slug: '/appointment-setting-for-home-services',
    title: 'Appointment Setting for Home Services | VictorySync',
    description: 'Qualify home service inquiries and book useful estimates with US-managed appointment setting, clear intake rules, and organized handoffs.',
    h1: 'Appointment Setting for Home Services',
    intro: 'A homeowner who asks for an estimate is usually comparing availability, trust, and timing. If nobody follows up while the need is fresh, even a strong crew can lose the conversation. VictorySync helps home service teams turn inquiries into organized, qualified appointments. Trained agents can answer the first questions, capture the job details your dispatcher needs, and work within the service areas and booking rules you approve.',
    sections: [
      { heading: 'Start with the work you actually take', copy: 'A useful booking begins with fit. Before an agent calls, we map your trades, neighborhoods, service radius, operating hours, and the jobs you want to accept. A plumbing emergency, a planned HVAC replacement, and a routine cleaning request should not follow the same script. The team uses your criteria to ask about the property, the problem, the preferred time, and any access or urgency details. You decide which requests can go straight onto a calendar and which need a dispatcher or estimator to review.' },
      { heading: 'Respond while the request is still active', copy: 'Homeowners may submit a form during lunch, call between errands, or leave a message after a technician has gone home. The first follow-up should be clear and helpful: confirm what they asked for, check whether the issue has changed, and explain the next step. An agent can continue an approved sequence of calls and messages when the first attempt does not connect. The point is to create a dependable path from inquiry to conversation, while respecting the contact rules and timing you set.' },
      { heading: 'Book an estimate your team can use', copy: 'A calendar entry without context forces the field team to start over. We aim to pass along the service type, location, customer contact details, timing, and notes on the issue in the format your team prefers. If a photo, model number, or special access instruction matters, we can add it to the intake checklist after you approve the workflow. Your staff can then arrive prepared for the conversation. The handoff is especially valuable when office staff and technicians share responsibility for scheduling.' },
      { heading: 'Keep urgent calls on a separate path', copy: 'Some requests cannot wait for a routine estimate slot. Together we define what counts as urgent, who receives an escalation, and what the agent may promise. That keeps the customer from hearing an arrival time that your crew has not confirmed. Where you offer emergency service, the agent can gather the facts and connect the caller to the designated person. Where you do not, the response can be honest about the next available step. We will not present an emergency dispatch process as live until your team approves it.' },
      { heading: 'Review the full funnel', copy: 'You should be able to see more than a count of calls placed. Useful reporting separates new inquiries, conversations, disqualified jobs, booked estimates, reschedules, and requests still waiting for an answer. Reviewing dispositions and call recordings with your account lead helps you spot gaps in the script or calendar setup. Perhaps leads from one ZIP code are outside your coverage, or estimate requests need a different qualification question. Those details should change the workflow before they become a recurring scheduling problem.' },
      { heading: 'Fit the process to your tools', copy: 'VictorySync can work from an approved playbook and the access you provide to your CRM, calendar, and phone tools. We will confirm permissions, handoff fields, appointment types, and escalation contacts before launch. If your team uses a shared inbox, field service software, or a manual dispatcher board, the setup should reflect that reality. A pilot can focus on one lead source or service line, so your team can evaluate the quality of conversations and the usefulness of booked appointments before expanding coverage.' },
    ],
    closing: 'Tell us where inquiries arrive, what makes a good job, and how your crew schedules work. We will map a practical appointment setting workflow around those facts.',
  },
  '/cold-calling-for-plumbers': {
    slug: '/cold-calling-for-plumbers',
    title: 'Cold Calling for Plumbers | VictorySync',
    description: 'Reach property managers and commercial prospects with managed cold calling for plumbers, approved scripts, and clear reporting.',
    h1: 'Cold Calling for Plumbers',
    intro: 'A plumbing company grows through more than emergency calls. Property managers, facility teams, builders, and local businesses may need a dependable contractor for recurring work, maintenance, or future projects. Reaching them takes a different conversation from answering a homeowner with a leak. VictorySync can support a focused outbound program for plumbing companies that want to introduce their services, identify the right contact, and set a useful next step for their sales or operations team.',
    sections: [
      { heading: 'Choose a list with a real reason to call', copy: 'Broad lists create low quality conversations. We begin with the accounts you can serve: property type, location, service capacity, commercial or residential focus, and the work you want more of. A company seeking multi-site maintenance needs different prospects from one seeking remodel referrals. Your team approves the source of the list, exclusions, and any existing customer relationships that should be protected. Agents then work through a defined campaign, rather than treating every phone number as the same opportunity.' },
      { heading: 'Open with relevance, not a generic pitch', copy: 'The purpose of the first call is to find the right person and learn whether a conversation is warranted. An agent can ask who manages plumbing vendors, whether the organization uses an approved contractor list, and how it handles urgent versus planned work. If the contact is not responsible, the agent can ask for the appropriate role and update the record. The script should use your actual capabilities and service area. We will not promise response times, certifications, or pricing that your business has not approved.' },
      { heading: 'Qualify the kind of opportunity', copy: 'A property manager exploring a backup vendor is different from a facilities lead ready to request a proposal. We can capture sites, current process, timing, decision maker, and the reason for considering another plumbing partner. That context helps your team decide whether to schedule a discovery call, send company information, or follow up later. Agents should also record a clear no when a prospect declines. Good qualification protects both your sales time and the prospect experience.' },
      { heading: 'Handle timing with care', copy: 'Plumbing work is often urgent, but an outbound prospect may be planning months ahead. Pressing for a meeting before there is a reason can make the call less useful. We can use an approved follow-up cadence for contacts who request another time, while giving people a clear way to decline future outreach. Your team controls campaign hours and contact rules. Any calling program should be reviewed against applicable laws, your consent records, and your company policies before it begins.' },
      { heading: 'Make the handoff specific', copy: 'When a prospect agrees to meet, the calendar invitation and CRM note should explain why. We can record their role, properties or facilities discussed, current vendor arrangement if shared, relevant service needs, and the agreed next step. Your estimator or business development lead can then prepare for a real conversation rather than a cold introduction. If the contact asks for credentials, insurance information, or service references, your team should provide verified materials; the agent should not improvise them.' },
      { heading: 'Measure learning as well as meetings', copy: 'Outbound reporting should show attempts, connections, right-party conversations, declined contacts, follow-up requests, and qualified appointments. Call recordings and disposition notes can reveal whether the list, opening, or offer needs adjustment. A small pilot can test one segment, such as local property managers, before your company commits to a broader campaign. The review should include appointment quality and your team’s feedback, not just the number of calendar slots filled.' },
    ],
    closing: 'Share your service area, ideal commercial or referral accounts, and the work you want to win. We can plan an outbound calling pilot around a list and message you approve.',
  },
  '/appointment-setting-for-real-estate': {
    slug: '/appointment-setting-for-real-estate',
    title: 'Real Estate Appointment Setting | VictorySync',
    description: 'Follow up with real estate buyers and sellers, qualify timing and intent, and book useful agent conversations with organized handoffs.',
    h1: 'Appointment Setting for Real Estate',
    intro: 'Real estate inquiries arrive with very different levels of intent. One buyer wants a showing this weekend. Another is researching a move next year. A seller may be comparing agents before asking for a valuation. Treating all of them as ready for the same appointment wastes time and can feel pushy. VictorySync helps real estate teams follow up consistently, learn what the person needs, and book the right conversation with the right agent.',
    sections: [
      { heading: 'Respond to the source and the question', copy: 'A portal inquiry about a specific listing should start with that property. An open house sign-up calls for a different introduction, and a valuation form may need a seller consultation. We can build approved talk tracks for each lead source so the caller recognizes why your team is reaching out. Agents confirm the details that matter before moving to scheduling. If the property is unavailable or the inquiry is outdated, the agent should say so and offer a sensible next step approved by your team.' },
      { heading: 'Understand buyer readiness', copy: 'For buyers, qualification may include location, property type, price range, desired timing, financing stage, and whether they are already represented. These questions should be asked conversationally, with respect for what the buyer is comfortable sharing. A person ready to tour needs a different appointment from someone exploring neighborhoods. Your agents decide which conversations belong on their calendar and which should enter a longer follow-up path. The purpose is to make the first agent conversation better informed.' },
      { heading: 'Give sellers a clear first step', copy: 'A prospective seller may want a price opinion, marketing plan, or simply a sense of whether now is the right time. The caller can ask about the property, target timing, decision makers, and questions for the listing agent. The appointment should be described accurately: a consultation, a property visit, or another format your team actually offers. Agents should not quote valuations or make market claims unless you have supplied approved information for that specific situation.' },
      { heading: 'Keep the agent’s calendar usable', copy: 'Booking rules matter in real estate. The right agent may depend on geography, property type, team coverage, or current client load. We can follow your routing rules and check the calendar options you make available. A useful handoff includes the lead source, property or area of interest, timeline, representation status when known, and the questions the prospect wants answered. This context lets the agent prepare and reduces repeated questions at the start of the meeting.' },
      { heading: 'Follow up without losing trust', copy: 'Many prospects are not ready the first day they inquire. We can document a respectful cadence for people who ask to be contacted later, along with a clear stop process for those who decline. Your team supplies the contact permissions and approves channel use. If a prospect changes their criteria, those changes should appear in the CRM instead of living only in a call recording. Consistent notes make later conversations feel connected rather than repetitive.' },
      { heading: 'Review quality and compliance together', copy: 'Real estate outreach has practical and legal boundaries. Your brokerage should review scripts, representations, consent, fair housing language, and any state-specific rules before a campaign goes live. We can then use approved wording and escalate questions that require a licensed professional. Reporting can separate contacts reached, qualified buyer and seller conversations, appointments set, and reasons a lead was not booked. Agent feedback on meeting quality should guide updates to the qualification criteria.' },
    ],
    closing: 'Tell us which lead sources need attention, how you assign agents, and what qualifies as a valuable first appointment. We will map the follow-up and booking process to your team.',
  },
  '/inbound-support-for-law-firms': {
    slug: '/inbound-support-for-law-firms',
    title: 'Inbound Support for Law Firms | VictorySync',
    description: 'Answer law firm calls with trained agents, firm-approved intake questions, and clear routing to the right staff member.',
    h1: 'Inbound Support for Law Firms',
    intro: 'A call to a law firm may be a new matter, a current client looking for an update, or someone with a time-sensitive question. Each deserves a calm, accurate response, but the next step is not always the same. VictorySync can help a firm answer calls, collect approved intake information, and route messages to the people responsible for them. The firm defines what agents may say, what they must never imply, and which calls require immediate escalation.',
    sections: [
      { heading: 'Separate new matters from existing clients', copy: 'New inquiries often need to know whether the firm handles the type of matter and how to request a consultation. Existing clients may need their legal team, billing contact, or a status message delivered. We can use separate scripts and routing rules so a caller does not have to explain the same issue to multiple people. For new matters, agents collect only the details the firm approves. For active clients, the team follows the identity and message procedures the firm sets.' },
      { heading: 'Protect the boundary around legal advice', copy: 'An answering agent should not evaluate a case, discuss likely outcomes, quote legal fees, or suggest that an attorney-client relationship exists. The firm supplies approved language for these moments and the escalation contact for questions beyond intake. Agents can explain the next administrative step: whether someone will return the call, whether a consultation can be requested, and what information should be ready. That clarity helps callers without asking a non-lawyer to make legal judgments.' },
      { heading: 'Design intake around the practice', copy: 'A family law inquiry, an estate planning request, and a business dispute have different intake needs. The firm can specify practice areas, jurisdictions, conflict-check fields, and details that should be withheld from a general answering team. We can organize those questions into a clear sequence. The aim is to give staff enough context to route the inquiry, while avoiding unnecessary sensitive detail at the wrong stage. The firm remains responsible for deciding whether to accept a matter.' },
      { heading: 'Handle urgent calls under written rules', copy: 'Some callers will describe a deadline, court date, safety concern, or an active matter requiring prompt attention. Agents need a written escalation matrix with named contacts and backup paths. Where the firm cannot provide immediate help, the agent should use approved wording rather than promising a response time. Call disposition and timestamp should be available for review. We can test the escalation process before launch so staff understand what happens when the primary contact is unavailable.' },
      { heading: 'Keep messages organized and accessible', copy: 'A useful intake record identifies the caller, preferred callback details, matter category, urgency under the firm’s rules, and the next person responsible. The format should fit the firm’s case management or secure messaging process. Access permissions, retention, call recording, and any transcription should be reviewed with the firm before use. If recording is enabled, the firm should approve the consent wording and handling rules. We will not describe a generic workflow as compliant with every jurisdiction or matter type.' },
      { heading: 'Review the caller experience', copy: 'Reporting can show when calls arrive, which categories are most common, how many inquiries are transferred or scheduled, and whether messages are closed out. A quality review can examine clarity, courtesy, correct routing, and adherence to the firm’s script. The firm can then refine intake questions or staffing coverage based on actual call patterns. A pilot on a defined line or time window provides a practical way to evaluate the process before routing more calls.' },
    ],
    closing: 'Share your practice areas, intake rules, escalation contacts, and secure handoff process. We can plan an answering workflow for your firm’s review and approval.',
  },
};

export default function VerticalService({ path }: { path: string }) {
  const page = pages[path];
  useSeo({ title: page.title, description: page.description });
  return <div className="bg-white text-slate-900">
    <section className="border-b border-blue-100 bg-blue-50 px-5 py-20 text-slate-950 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-700">Industry services</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{page.h1}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700">{page.intro}</p>
        <Link href="/book-call" className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Book a consultation</Link>
      </div>
    </section>
    <article className="mx-auto max-w-4xl space-y-12 px-5 py-16 sm:px-8">
      {page.sections.map(section => <section key={section.heading}>
        <h2 className="text-2xl font-bold text-slate-950">{section.heading}</h2>
        <p className="mt-4 text-base leading-8 text-slate-700">{section.copy}</p>
      </section>)}
      <section className="rounded-xl bg-slate-100 p-8">
        <h2 className="text-2xl font-bold">Plan the next step</h2>
        <p className="mt-4 leading-8 text-slate-700">{page.closing}</p>
        <Link href="/book-call" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Book a consultation</Link>
      </section>
    </article>
  </div>;
}
