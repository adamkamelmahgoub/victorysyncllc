export type MarketingPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; body: string }[];
  points: string[];
  related?: { label: string; href: string }[];
};

export type ServiceFlow = {
  heading: string;
  summary: string;
  steps: { title: string; description: string; output: string }[];
};

export const serviceFlows: Record<string, ServiceFlow> = {
  '/inbound-support': {
    heading: 'From the first ring to a resolved next step.',
    summary: 'We shape the answering experience around your business rules, then make every call easy to review.',
    steps: [
      { title: 'Define the playbook', description: 'Agree on hours, greetings, common questions, intake fields, urgent cases, and who owns each escalation.', output: 'Approved call guide and routing rules' },
      { title: 'Prepare the team', description: 'Train agents on your services, tone, tools, and examples of calls they should transfer rather than answer.', output: 'Agent briefing and access plan' },
      { title: 'Handle the conversation', description: 'A person answers, captures the reason for the call, follows the approved path, and confirms the next action.', output: 'Call disposition and useful notes' },
      { title: 'Review and improve', description: 'Review call patterns and quality feedback together, then update the guide where customers need clearer answers.', output: 'Quality notes and playbook changes' },
    ],
  },
  '/appointment-setting': {
    heading: 'A booked meeting should arrive with context.',
    summary: 'The process starts with your definition of a useful appointment and ends with a handoff your team can act on.',
    steps: [
      { title: 'Set qualification rules', description: 'Agree on customer fit, service area, timing, exclusions, calendar availability, and what information your team needs.', output: 'Qualification and booking criteria' },
      { title: 'Connect lead sources', description: 'Route approved inquiries from forms, campaigns, or your CRM to the right queue with a clear owner.', output: 'Lead source and routing map' },
      { title: 'Call and confirm', description: 'Agents ask discovery questions, handle common objections within your guidance, and offer the right available time.', output: 'Confirmed appointment and notes' },
      { title: 'Close the loop', description: 'Send the agreed handoff, track outcomes and no-shows, and adjust qualification using your team’s feedback.', output: 'Handoff and review rhythm' },
    ],
  },
  '/cold-calling': {
    heading: 'Outbound calling with a clear reason to call.',
    summary: 'Audience, compliance checks, messaging, and the next step are set before a person dials.',
    steps: [
      { title: 'Plan the audience', description: 'Define who belongs in the campaign, where the list comes from, calling windows, DNC handling, and exclusions.', output: 'Approved audience and list rules' },
      { title: 'Build the conversation', description: 'Agree on opening language, discovery questions, objection guidance, and when to stop or escalate.', output: 'Call guide and qualification rubric' },
      { title: 'Call and qualify', description: 'Agents make the calls, listen for fit and timing, and record each meaningful outcome in the approved system.', output: 'Documented dispositions' },
      { title: 'Transfer or follow up', description: 'Ready prospects can be transferred live, booked, or placed in an agreed follow-up path; results inform the next list.', output: 'Handoff and campaign learning' },
    ],
  },
  '/digital-marketing': {
    heading: 'Build demand with the response already designed.',
    summary: 'Campaign work and human follow-up share one definition of a qualified lead.',
    steps: [
      { title: 'Agree on the economics', description: 'Review the offer, audience, geography, budget, ad-account ownership, success measures, and approval process.', output: 'Campaign brief and budget guardrails' },
      { title: 'Create the path', description: 'Plan the creative, ads, landing experience, form questions, tracking, and CRM destination for each inquiry.', output: 'Creative and lead-flow plan' },
      { title: 'Launch with follow-up', description: 'Publish approved campaigns and route new inquiries to the team responsible for timely human contact.', output: 'Connected campaign and calling workflow' },
      { title: 'Improve from evidence', description: 'Compare campaign signals with call outcomes and customer questions before changing spend, creative, or qualification.', output: 'Review notes and next tests' },
    ],
  },
  '/ai-automation': {
    heading: 'Automate the handoffs around a human conversation.',
    summary: 'We start with the people and permissions in the workflow, then decide which repetitive steps benefit from automation.',
    steps: [
      { title: 'Map the journey', description: 'Identify data sources, trigger events, ownership, exceptions, and points where a person must review or act.', output: 'Workflow and access map' },
      { title: 'Design the rules', description: 'Specify routing, reminders, summaries, CRM fields, and fallback behavior before building anything.', output: 'Approved automation specification' },
      { title: 'Test with real scenarios', description: 'Check normal cases, missing data, duplicate leads, and escalation paths with the people who will use the workflow.', output: 'Tested handoff examples' },
      { title: 'Monitor and revise', description: 'Review errors and agent feedback, refine the rules, and keep a person accountable for the customer interaction.', output: 'Change log and review cadence' },
    ],
  },
  '/live-transfers': {
    heading: 'Reconnect, qualify, and hand off while interest is live.',
    summary: 'The transfer rules are agreed in advance so agents know when to reconnect a lead and when your team is ready to take over.',
    steps: [
      { title: 'Segment the leads', description: 'Agree on which prior inquiries may be contacted, list ownership, exclusions, DNC handling, and the context available to agents.', output: 'Approved reactivation audience' },
      { title: 'Set transfer criteria', description: 'Define fit, intent, timing, receiving-team availability, and the information a closer needs before taking the call.', output: 'Qualification and transfer rules' },
      { title: 'Reopen the conversation', description: 'An agent calls with relevant context, checks whether the need remains, and qualifies current interest.', output: 'Current lead disposition' },
      { title: 'Connect and review', description: 'Ready leads move to a live transfer or agreed booking path; outcomes show which segments deserve more attention.', output: 'Warm handoff and feedback' },
    ],
  },
  '/sales-closers': {
    heading: 'Give qualified opportunities a disciplined sales conversation.',
    summary: 'Closing support is shaped around the offer, authority, approvals, and handoff points your business defines.',
    steps: [
      { title: 'Learn the offer', description: 'Review the product, buyer questions, pricing authority, exclusions, and what an agent may or may not promise.', output: 'Approved sales guide' },
      { title: 'Prepare the pipeline', description: 'Agree on what makes an opportunity sales-ready and how context moves from setter or campaign to closer.', output: 'Sales-ready criteria and notes' },
      { title: 'Lead the conversation', description: 'A trained person handles discovery, explains the approved offer, addresses questions, and follows the agreed next step.', output: 'Documented conversation outcome' },
      { title: 'Protect the handoff', description: 'Any proposal, payment, contract, or specialist decision follows your approval process; the team reviews outcomes and objections.', output: 'Clear next action and review notes' },
    ],
  },
};

export const siteContent = {
  hero: {
    eyebrow: 'U.S.-managed in New Jersey · Agent team in Cairo',
    title: 'From first click to the next conversation.',
    body: 'VictorySync connects digital marketing with the people who follow up. We help U.S. businesses attract leads, call them, qualify opportunities, book appointments, and support customers in one coordinated workflow.',
  },
  services: [
    { title: 'Appointment setting', href: '/appointment-setting', detail: 'Follow up with interested prospects and book qualified conversations.', icon: '01' },
    { title: 'Cold calling & qualification', href: '/cold-calling', detail: 'Reach the right people with approved scripts and clear qualification criteria.', icon: '02' },
    { title: 'Live transfers & reactivation', href: '/live-transfers', detail: 'Reconnect with existing leads and hand ready prospects to your team.', icon: '03' },
    { title: 'Inbound support & answering', href: '/inbound-support', detail: 'Give callers a trained person and a clear next step.', icon: '04' },
    { title: 'Sales conversations', href: '/sales-closers', detail: 'Support qualified prospects through the sales process you approve.', icon: '05' },
    { title: 'Digital marketing', href: '/digital-marketing', detail: 'Connect ads, creative, SEO, websites, and landing pages to lead follow-up.', icon: '06' },
    { title: 'AI automation & CRM', href: '/ai-automation', detail: 'Use routing, reminders, and summaries to support the human team.', icon: '07' },
  ],
  journey: [
    { title: 'Campaign', detail: 'Define the offer, audience, creative, and destination.' },
    { title: 'Inquiry', detail: 'Capture the lead and route it to the right workflow.' },
    { title: 'Human follow-up', detail: 'A trained agent calls or responds using your approved playbook.' },
    { title: 'Qualification', detail: 'Check fit, timing, and next steps against your criteria.' },
    { title: 'Appointment', detail: 'Book the right conversation and record the handoff.' },
    { title: 'Review', detail: 'Use activity and call feedback to improve the next cycle.' },
  ],
  clients: [
    { name: 'Unified Service Partners', logo: '/clients/unified-service-partners.webp', industry: 'Roofing and home services', website: 'https://www.unifiedservicepartners.com/about-us/' },
    { name: 'GenX Capital Group', logo: '/clients/genx-capital-group.webp', industry: 'Investment and M&A', website: 'https://genxcapital3x.com/contact/' },
    { name: 'The Score Machine', logo: '/clients/the-score-machine.webp', industry: 'Credit intelligence software', website: 'https://thescoremachine.com/' },
  ],
  process: [
    { title: 'Understand the work', detail: 'We map your offer, audience, existing tools, qualification rules, and the customer experience you want.' },
    { title: 'Build the workflow', detail: 'We agree on campaigns, scripts, access, handoffs, reporting, and the people responsible for each step.' },
    { title: 'Launch and review', detail: 'Your team sees activity, listens to feedback, and refines the process with us.' },
  ],
  trust: [
    'Access is limited to approved tools and workflows', 'A named team owns the campaign', 'Calls and outcomes can be reviewed together',
    'Scripts and escalation rules are agreed before launch', 'Outbound lists and DNC handling are part of campaign planning', 'Scope and spend are approved before work begins',
  ],
  faqs: [
    { q: 'What does VictorySync do?', a: 'We bring digital marketing and human-led contact center work together. Depending on your agreement, the team can support ads, lead follow-up, qualification, appointment setting, inbound answering, sales conversations, and CRM workflows.' },
    { q: 'Where are your team members based?', a: 'VictorySync is managed from Millstone Township, New Jersey. Trained agent operations are based in Cairo, Egypt.' },
    { q: 'Do you run ads too?', a: 'Yes. Digital marketing work can include Meta and Google ads, creative, SEO, social media, websites, and landing pages. The specific channels are agreed during scoping.' },
    { q: 'Who pays the ad spend?', a: 'Media spend is separate from VictorySync service fees. The ad account, budget, and payment arrangement are agreed before a campaign launches.' },
    { q: 'Can you help close sales?', a: 'Sales conversation support can be included when the offer, training, and handoff process are a fit. We agree the scope before launch.' },
    { q: 'Can your team work in our CRM?', a: 'We can work in approved CRM, calendar, and phone tools. Access and permissions are defined as part of onboarding.' },
    { q: 'How does pricing work?', a: 'Starter contact center work starts from $10 per agent hour. Final pricing depends on coverage, channels, tools, staffing, and campaign scope. Marketing fees and ad spend are scoped separately.' },
    { q: 'How do you protect customer conversations?', a: 'We agree on scripts, access, recording, quality review, and escalation rules with you. People remain responsible for conversations; AI supports summaries and workflows.' },
  ],
  pricing: [
    { name: 'Starter', price: 'From $10 per agent hour', description: 'A focused inbound or outbound workflow with trained agent support.', features: ['Agreed scripts and qualification rules', 'Daily activity reporting', 'Defined handoff and escalation'] },
    { name: 'Growth', price: 'Custom quote', description: 'Coordinated follow-up across more leads, channels, or team members.', features: ['Campaign and calling alignment', 'Account team and quality review', 'CRM and calendar workflows'] },
    { name: 'Scale', price: 'Custom quote', description: 'A broader growth operation with marketing and customer conversations connected.', features: ['Multi-channel planning', 'Team coaching and reporting', 'Regular optimization reviews'] },
  ],
};

export const marketingPages: Record<string, MarketingPageContent> = {
  '/services': { eyebrow: 'What we do', title: 'One team for demand and the conversation that follows.', intro: 'Choose the parts of the growth journey you need. Our team connects marketing execution, live calls, qualification, and customer support around a shared operating plan.', sections: [
    { title: 'Build demand', body: 'Ads, SEO, creative, social, landing pages, and websites help the right people discover your offer.' },
    { title: 'Respond with a person', body: 'Agents follow approved scripts, answer questions, qualify interest, and route each contact to an appropriate next step.' },
    { title: 'See what happened', body: 'Clear dispositions and agreed reporting help you inspect the work and improve the next campaign.' },
  ], points: ['Digital marketing', 'Appointment setting', 'Cold calling', 'Inbound support', 'Lead reactivation', 'Sales conversations', 'AI-assisted workflows'] },
  '/inbound-support': { eyebrow: 'Inbound support', title: 'A clear, human answer when your customers call.', intro: 'Your callers should reach someone who understands the next step. Our agents work from your approved playbook to answer, route, document, and follow up.', sections: [
    { title: 'Make the first response count', body: 'Agree on greetings, intake questions, business hours, urgent routing, and what agents can resolve directly.' },
    { title: 'Keep context together', body: 'Call outcomes and relevant notes can be captured in the approved systems your team already uses.' },
    { title: 'Review quality', body: 'Use recordings and coaching where permitted to align the customer experience with your standards.' },
  ], points: ['Live call answering', 'Customer intake', 'Appointment requests', 'Call routing', 'Message capture', 'Quality review'], related: [{ label: 'Appointment setting', href: '/appointment-setting' }, { label: 'Platform', href: '/platform' }] },
  '/appointment-setting': { eyebrow: 'Appointment setting', title: 'Turn interest into a useful meeting.', intro: 'Speed matters after an inquiry, but so does fit. Our agents follow up, ask the right questions, and book appointments against your criteria.', sections: [
    { title: 'Define a qualified meeting', body: 'We agree on your service area, ideal customer, timing, exclusions, calendar rules, and required notes.' },
    { title: 'Follow up thoughtfully', body: 'A person handles the conversation while reminders and CRM workflows support the process.' },
    { title: 'Make handoffs easier', body: 'Your team receives the context needed to continue the conversation without making a prospect repeat themselves.' },
  ], points: ['Lead follow-up', 'Qualification', 'Calendar booking', 'Reminder workflows', 'CRM updates', 'Handoff notes'], related: [{ label: 'Digital marketing', href: '/digital-marketing' }, { label: 'How it works', href: '/how-it-works' }] },
  '/cold-calling': { eyebrow: 'Outbound calling', title: 'Start relevant conversations with the right prospects.', intro: 'Outbound work begins with a suitable list, a clear offer, and approved language. Trained people then call, listen, qualify, and document the result.', sections: [
    { title: 'Plan responsible outreach', body: 'We align audience, scripts, calling windows, list hygiene, do-not-call handling, and escalation before dialing.' },
    { title: 'Qualify beyond a script', body: 'Agents ask discovery questions and use your criteria to separate curiosity from a genuine opportunity.' },
    { title: 'Connect ready prospects', body: 'Qualified contacts can be transferred, booked, or placed into a follow-up sequence agreed with your team.' },
  ], points: ['Prospect qualification', 'Lead reactivation', 'Live transfers', 'Appointment booking', 'Call dispositions', 'DNC handling'], related: [{ label: 'Appointment setting', href: '/appointment-setting' }, { label: 'Pricing', href: '/pricing' }] },
  '/digital-marketing': { eyebrow: 'Digital marketing', title: 'Generate demand with the follow-up already in place.', intro: 'A campaign works best when the landing page, lead form, CRM, and calling team share one plan. We connect those pieces so promising inquiries get a human response.', sections: [
    { title: 'Plan the offer and audience', body: 'We review your market, service area, message, destination, budget, and what a qualified lead means to you.' },
    { title: 'Build the campaign', body: 'Work can include Meta and Google ads, creative, social media, SEO, websites, and landing pages.' },
    { title: 'Learn from conversations', body: 'Agent feedback can show which questions, objections, and offers deserve attention in the next creative iteration.' },
  ], points: ['Meta and Google ads', 'Creative and social media', 'SEO', 'Landing pages and websites', 'Lead form planning', 'Marketing-to-CRM handoff'], related: [{ label: 'Appointment setting', href: '/appointment-setting' }, { label: 'How it works', href: '/how-it-works' }] },
  '/ai-automation': { eyebrow: 'AI and CRM', title: 'Give your people better tools behind the scenes.', intro: 'AI can support the work around a conversation. Our model keeps a trained person responsible for the customer interaction while automation helps with routing, reminders, notes, and reporting.', sections: [
    { title: 'Map the workflow first', body: 'We identify where information enters, who needs it, when a human should act, and what must be reviewed.' },
    { title: 'Automate the repeatable steps', body: 'Routing, reminders, call summaries, CRM updates, and follow-up tasks can reduce manual handoffs.' },
    { title: 'Keep people accountable', body: 'Agents and managers review context and outcomes. Automated output should support decisions, not replace oversight.' },
  ], points: ['Lead routing', 'CRM workflow design', 'Summaries and notes', 'Reminders', 'Reporting support', 'Human review'], related: [{ label: 'Platform', href: '/platform' }, { label: 'Contact us', href: '/contact' }] },
  '/live-transfers': { eyebrow: 'Live transfers and reactivation', title: 'Bring the right conversation back to life.', intro: 'Existing leads can still have a current need. Our agents reconnect, qualify, and bring ready prospects to the right person on your team using transfer rules you approve.', sections: [
    { title: 'Start with eligible leads', body: 'We review source, prior contact, permissions, exclusions, and what makes reactivation appropriate for your business.' },
    { title: 'Check current intent', body: 'Agents establish whether the prospect still needs help and use your criteria to identify a timely opportunity.' },
    { title: 'Make the handoff count', body: 'A live transfer or booked next step includes useful context, so your team can continue the conversation.' },
  ], points: ['Lead reactivation', 'Qualification', 'Live transfer rules', 'Receiving-team availability', 'CRM dispositions', 'Outcome review'], related: [{ label: 'Cold calling', href: '/cold-calling' }, { label: 'Sales closers', href: '/sales-closers' }] },
  '/sales-closers': { eyebrow: 'Sales closers', title: 'A human sales conversation built around your offer.', intro: 'Qualified prospects need clear answers and an accountable next step. We can support the sales conversation within the pricing, approval, and customer-experience rules you set.', sections: [
    { title: 'Define authority', body: 'Agree on the offer, pricing boundaries, claims, objections, approvals, and situations that need a specialist or your team.' },
    { title: 'Take the handoff', body: 'The closer receives qualification notes and customer context before speaking, then runs discovery rather than starting cold.' },
    { title: 'Record the next move', body: 'Outcomes, objections, and follow-up actions are documented so your team can review quality and pipeline movement.' },
  ], points: ['Qualified lead handoff', 'Discovery', 'Approved offer presentation', 'Objection handling', 'Follow-up', 'Sales outcome review'], related: [{ label: 'Appointment setting', href: '/appointment-setting' }, { label: 'How it works', href: '/how-it-works' }] },
  '/platform': { eyebrow: 'Campaign visibility', title: 'See the work. Understand the next move.', intro: 'Your campaign should be understandable to the people paying for it. We agree on what gets recorded, how activity is summarized, and when the team meets to improve it.', sections: [
    { title: 'Useful activity', body: 'Call outcomes, appointment status, and follow-up notes provide context beyond a raw lead count.' },
    { title: 'Daily written summary', body: 'A concise written update can show what happened, what needs attention, and what the team plans next.' },
    { title: 'Approved access', body: 'We work within the systems and permissions agreed during onboarding, with quality review built into the operating rhythm.' },
  ], points: ['Campaign activity', 'Call outcomes', 'Written summaries', 'Quality review', 'CRM handoffs', 'Access controls'], related: [{ label: 'How it works', href: '/how-it-works' }, { label: 'Contact us', href: '/contact' }] },
  '/about-us': { eyebrow: 'About VictorySync', title: 'U.S. management. Cairo-based people. One standard of care.', intro: 'Victory Sync LLC is headquartered at 11 Brookside Road, Millstone Township, New Jersey. Its trained agent team operates from Cairo, Egypt. People lead customer conversations, while technology helps them prepare and follow through.', sections: [
    { title: 'Designed around accountability', body: 'A clear playbook, named owners, approved system access, and recurring review keep work visible to the client.' },
    { title: 'A full growth partner', body: 'Digital marketing can create demand, and our contact center team can follow up with the people who respond.' },
    { title: 'Human at the point of contact', body: 'Automation supports routing and documentation. A trained agent handles the customer conversation.' },
  ], points: ['Headquartered in New Jersey', 'Agent operations in Cairo', 'Human-led conversations', 'Marketing and calling together'], related: [{ label: 'How it works', href: '/how-it-works' }, { label: 'Contact us', href: '/contact' }] },
  '/appointment-setting-for-home-services': { eyebrow: 'Home services', title: 'Book better conversations for home service teams.', intro: 'When a homeowner asks for help, the next step should be clear. We can follow up, qualify the job, and schedule an estimate against your service area and calendar rules.', sections: [
    { title: 'Capture the job details', body: 'Agents can ask about location, service type, timing, and any details your technicians need before an estimate.' },
    { title: 'Protect your calendar', body: 'Agree on which requests qualify, who should receive urgent calls, and where each appointment belongs.' },
    { title: 'Connect marketing to booking', body: 'Campaigns and landing pages can be built around the same qualification criteria used on the phone.' },
  ], points: ['Homeowner follow-up', 'Estimate booking', 'Service-area screening', 'Urgent call routing', 'CRM notes'], related: [{ label: 'Plumber answering', href: '/answering-service-for-plumbers' }, { label: 'HVAC appointment setting', href: '/appointment-setting-for-hvac' }] },
  '/cold-calling-for-plumbers': { eyebrow: 'Plumbing outreach', title: 'Start useful commercial plumbing conversations.', intro: 'A focused outbound program can help plumbing teams reach property managers and other suitable business prospects with approved messages and clear qualification rules.', sections: [
    { title: 'Choose a relevant audience', body: 'Define locations, account types, decision makers, and services before outreach begins.' },
    { title: 'Handle objections with context', body: 'Agents can explain your offer, ask about current needs, and record the reason for each next step.' },
    { title: 'Hand off real interest', body: 'Qualified prospects can be scheduled or transferred according to the plan you approve.' },
  ], points: ['Commercial prospecting', 'Qualification', 'Approved scripts', 'Follow-up disposition', 'Meeting handoff'], related: [{ label: 'Plumber answering', href: '/answering-service-for-plumbers' }, { label: 'Cold calling', href: '/cold-calling' }] },
  '/answering-service-for-plumbers': { eyebrow: 'Plumber answering', title: 'A human answer for every plumbing inquiry in scope.', intro: 'Callers may need routine scheduling or urgent routing. Our team can follow your intake rules, collect the right details, and move the request to the next person.', sections: [
    { title: 'Separate urgent from routine', body: 'Define which symptoms trigger escalation, who is on call, and which requests can be booked normally.' },
    { title: 'Document the request', body: 'Capture location, contact details, service type, timing, and notes your field team needs.' },
    { title: 'Keep the customer informed', body: 'Agents use your approved language for availability, next steps, and handoffs.' },
  ], points: ['Call answering', 'Intake', 'Urgent call routing', 'Estimate requests', 'CRM notes'], related: [{ label: 'Home services', href: '/appointment-setting-for-home-services' }, { label: 'Inbound support', href: '/inbound-support' }] },
  '/appointment-setting-for-hvac': { eyebrow: 'HVAC teams', title: 'Move HVAC inquiries from interest to the right visit.', intro: 'Seasonal demand can make lead follow-up difficult. Agents can qualify the job, confirm location and timing, and book within the rules your team sets.', sections: [
    { title: 'Understand the request', body: 'Collect the equipment or service issue, urgency, location, and contact information your team needs.' },
    { title: 'Use the right calendar path', body: 'Maintenance, estimates, and urgent calls can follow different approved routing rules.' },
    { title: 'Learn from demand', body: 'Call dispositions show what prospects ask for and where the booking workflow can improve.' },
  ], points: ['Lead follow-up', 'Appointment booking', 'Maintenance inquiries', 'Urgent routing', 'Outcome reporting'], related: [{ label: 'Home services', href: '/appointment-setting-for-home-services' }, { label: 'Digital marketing', href: '/digital-marketing' }] },
  '/appointment-setting-for-real-estate': { eyebrow: 'Real estate', title: 'Keep buyer and seller inquiries moving.', intro: 'A new inquiry needs a useful conversation. We can follow up, learn timing and intent, and schedule an agent discussion with the context your team needs.', sections: [
    { title: 'Qualify carefully', body: 'Agents can ask approved questions about location, timing, property interest, and preferred next steps.' },
    { title: 'Respect the relationship', body: 'Representations, fair housing language, and licensed-agent boundaries should be approved by your brokerage.' },
    { title: 'Book with context', body: 'The receiving agent gets a summary so the next conversation starts in the right place.' },
  ], points: ['Buyer and seller follow-up', 'Timing and intent', 'Appointment booking', 'Brokerage-approved language', 'CRM notes'], related: [{ label: 'Appointment setting', href: '/appointment-setting' }, { label: 'Contact us', href: '/contact' }] },
  '/inbound-support-for-law-firms': { eyebrow: 'Legal intake', title: 'A thoughtful first response for law firm callers.', intro: 'New matters and existing clients need different paths. Agents can follow firm-approved intake and routing rules while leaving legal advice to qualified professionals.', sections: [
    { title: 'Capture only approved details', body: 'The firm defines intake questions, conflicts workflow, and what information a non-lawyer may collect.' },
    { title: 'Route the call correctly', body: 'Existing client messages, new inquiries, and urgent issues can each follow a separate path.' },
    { title: 'Keep the boundary clear', body: 'Agents do not evaluate cases, promise outcomes, or create an attorney-client relationship.' },
  ], points: ['New-matter intake', 'Existing-client routing', 'Approved scripts', 'Message capture', 'Escalation'], related: [{ label: 'Inbound support', href: '/inbound-support' }, { label: 'Contact us', href: '/contact' }] },
};
