
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-victory-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Data Controller:</strong> VictorySync LLC, New Jersey, USA
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us and automatically when you use our services:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information (PII)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Contact information (name, email address, phone number, company details)</li>
                  <li>Account credentials and billing information</li>
                  <li>Professional information and job titles</li>
                  <li>Communication preferences and marketing consents</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Data</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Call recordings and transcripts from our call center services</li>
                  <li>Customer service communications and chat logs</li>
                  <li>CRM synchronization data and customer interaction history</li>
                  <li>AI automation inputs and outputs</li>
                  <li>Performance metrics and KPI data</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Data</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Usage analytics and platform interaction data</li>
                  <li>IP addresses, browser types, and device information</li>
                  <li>Log files and error reports</li>
                  <li>Cookies and tracking technologies data</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Legal Basis for Processing</h2>
              <p className="text-gray-600 mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Contract Performance:</strong> Processing necessary to provide our services and fulfill our contractual obligations</li>
                <li><strong>Consent:</strong> Where you have given explicit consent for marketing communications or specific data uses</li>
                <li><strong>Legitimate Interests:</strong> For business operations, security, and service improvement (GDPR Article 6(1)(f))</li>
                <li><strong>Legal Compliance:</strong> To meet regulatory requirements and legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use collected information for the following purposes:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Delivery</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Providing call center services and customer support</li>
                  <li>AI automation and workflow processing</li>
                  <li>CRM integrations and data synchronization</li>
                  <li>Performance monitoring and quality assurance</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Operations</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Account management and billing</li>
                  <li>Customer support and technical assistance</li>
                  <li>Security monitoring and fraud prevention</li>
                  <li>Legal compliance and dispute resolution</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing (Opt-in Only)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Sending newsletters and service updates (with consent)</li>
                  <li>Promotional communications about new features</li>
                  <li>Industry insights and best practices sharing</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI Processing Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We use artificial intelligence and machine learning technologies to enhance our services:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>LLM Summarization:</strong> Large Language Models process call transcripts and communications to generate summaries and insights</li>
                <li><strong>Sentiment Analysis:</strong> AI analyzes customer interactions to identify satisfaction levels and emotional context</li>
                <li><strong>Automated Responses:</strong> AI systems generate suggested responses and automate routine communications</li>
                <li><strong>Predictive Analytics:</strong> Machine learning algorithms analyze patterns to predict outcomes and optimize service delivery</li>
                <li><strong>Quality Scoring:</strong> AI evaluates call quality and agent performance automatically</li>
              </ul>
              <p className="text-gray-600 mt-4">
                All AI processing is conducted with appropriate security measures and human oversight where required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Sub-processors</h2>
              <p className="text-gray-600 mb-4">
                We share your information only in the following circumstances:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Providers</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Cloud hosting providers (AWS, Google Cloud)</li>
                  <li>Communication platforms (Twilio, Aircall)</li>
                  <li>CRM integrations (HubSpot, Pipedrive)</li>
                  <li>Payment processors and billing systems</li>
                  <li>Analytics providers (Google Analytics)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>In connection with business transfers or acquisitions</li>
                  <li>With your explicit consent for specific purposes</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">International Transfers</h3>
                <p className="text-gray-600">
                  Your data may be processed in countries outside your residence. We ensure appropriate safeguards 
                  are in place, including Standard Contractual Clauses and adequacy decisions where applicable.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Security Measures</h2>
              <p className="text-gray-600 mb-4">
                We implement comprehensive security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Encryption:</strong> Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Security Audits:</strong> Regular penetration testing and vulnerability assessments</li>
                <li><strong>Employee Training:</strong> Comprehensive security awareness and data protection training</li>
                <li><strong>Incident Response:</strong> 24/7 monitoring with rapid breach response procedures</li>
                <li><strong>Compliance:</strong> SOC 2 Type II and ISO 27001 certified security practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your data for specific periods based on the type of information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Account Data:</strong> For the duration of your account plus 7 years for legal compliance</li>
                <li><strong>Call Recordings:</strong> 12 months for quality assurance and training purposes</li>
                <li><strong>Chat Logs:</strong> 24 months for service improvement and dispute resolution</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized data retained for 36 months</li>
                <li><strong>Marketing Data:</strong> Until you withdraw consent or as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the following rights regarding your personal data:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR Rights (EU Residents)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                  <li><strong>Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CCPA Rights (California Residents)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Know:</strong> Request information about data collection and sharing</li>
                  <li><strong>Delete:</strong> Request deletion of personal information</li>
                  <li><strong>Opt-Out:</strong> Opt out of the sale of personal information (we do not sell data)</li>
                  <li><strong>Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                </ul>
              </div>

              <p className="text-gray-600">
                To exercise your rights, contact us at privacy@victorysync.com. We will respond within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Types of Cookies</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for site functionality and security</li>
                  <li><strong>Analytics Cookies:</strong> Google Analytics for usage statistics (anonymized)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Track effectiveness of campaigns (with consent)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Tracking</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Google Analytics (anonymized IP addresses)</li>
                  <li>Facebook Pixel (for advertising attribution)</li>
                  <li>LinkedIn Insight Tag (for B2B marketing)</li>
                </ul>
              </div>

              <p className="text-gray-600">
                You can control cookies through your browser settings or our cookie preference center.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have collected such 
                information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. 
                Material changes will be communicated via:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our platform</li>
                <li>Updated effective date at the top of this policy</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information & Data Protection Officer</h2>
              <p className="text-gray-600 mb-4">
                For privacy-related questions, data subject requests, or concerns about our data practices:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">General Privacy Inquiries</h4>
                    <p className="text-gray-600">
                      <strong>Email:</strong> privacy@victorysync.com<br />
                      <strong>Phone:</strong> + (718)-813-2106<br />
                      <strong>Response Time:</strong> Within 30 days
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                    <p className="text-gray-600">
                      <strong>Email:</strong> dpo@victorysync.com<br />
                      <strong>For:</strong> GDPR requests, compliance questions<br />
                      <strong>Response Time:</strong> Within 72 hours
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    <strong>VictorySync LLC</strong><br />
                    11 Brookside Rd, Millstone, New Jersey, 08510, United States
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
