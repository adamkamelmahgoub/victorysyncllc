
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Effective Date: January 9, 2025
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Data Controller</h2>
                <p className="text-gray-700 leading-relaxed">
                  VictorySync LLC, a New Jersey limited liability company, is the data controller for personal information 
                  collected through our services. We are committed to protecting your privacy and handling your data responsibly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. What We Collect</h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect several types of information to provide and improve our services:
                </p>
                <h3 className="text-lg font-medium mt-4 mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Name, email address, phone number</li>
                  <li>Company information and job title</li>
                  <li>Billing and payment information</li>
                  <li>Account credentials and preferences</li>
                </ul>
                <h3 className="text-lg font-medium mt-4 mb-2">Service Data:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Call recordings and transcripts</li>
                  <li>CRM synchronization data</li>
                  <li>Customer interaction logs</li>
                  <li>Performance analytics and metrics</li>
                </ul>
                <h3 className="text-lg font-medium mt-4 mb-2">Technical Data:</h3>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>IP addresses and device information</li>
                  <li>Browser type and version</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and tracking pixels</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Legal Bases for Processing</h2>
                <p className="text-gray-700 leading-relaxed">
                  We process your data based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li><strong>Contract Performance:</strong> To provide services you've requested</li>
                  <li><strong>Legitimate Interest:</strong> To improve services and prevent fraud</li>
                  <li><strong>Consent:</strong> For marketing communications (opt-in)</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. How We Use Your Data</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your data is used for:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Service delivery and customer support</li>
                  <li>Performance analytics and reporting</li>
                  <li>Billing and account management</li>
                  <li>Service improvement and optimization</li>
                  <li>Marketing communications (with consent)</li>
                  <li>Compliance with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. AI Processing Disclosure</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use artificial intelligence and machine learning technologies to enhance our services, including:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Call transcription and summarization</li>
                  <li>Sentiment analysis and quality scoring</li>
                  <li>Automated workflow optimization</li>
                  <li>Predictive analytics for performance improvement</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  All AI processing is performed in accordance with applicable privacy laws and our security standards.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Data Sharing</h2>
                <p className="text-gray-700 leading-relaxed">
                  We share your data only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist in service delivery</li>
                  <li><strong>Legal Requirements:</strong> When required by law or court order</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                  <li><strong>Consent:</strong> When you explicitly authorize sharing</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  International transfers are protected by appropriate safeguards such as Standard Contractual Clauses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Security Measures</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement comprehensive security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Encryption in transit and at rest</li>
                  <li>Role-based access controls</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your data for the following periods:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li><strong>Account Data:</strong> Until account closure plus 7 years</li>
                  <li><strong>Call Recordings:</strong> 3 years or as specified in your contract</li>
                  <li><strong>Analytics Data:</strong> 5 years in aggregated form</li>
                  <li><strong>Legal Requirements:</strong> As required by applicable law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">9. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate information</li>
                  <li><strong>Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Restriction:</strong> Limit processing of your data</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  To exercise these rights, contact us at privacy@victorysync.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">10. Cookies & Tracking</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies for:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Essential website functionality</li>
                  <li>Performance and analytics (Google Analytics)</li>
                  <li>Marketing and advertising (with consent)</li>
                  <li>User preferences and settings</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  You can manage cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 13. We do not knowingly collect personal information from 
                  children. If we become aware of such collection, we will delete the information immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">12. California Privacy Rights (CCPA)</h2>
                <p className="text-gray-700 leading-relaxed">
                  California residents have additional rights under the California Consumer Privacy Act:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of sale of personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-2">
                  <strong>Note:</strong> We do not sell personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">13. Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of material changes by email or through 
                  our website. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For privacy-related questions or to exercise your rights, contact us at:
                </p>
                <div className="mt-2 text-gray-700">
                  <p><strong>VictorySync LLC - Privacy Office</strong></p>
                  <p>Email: privacy@victorysync.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Address: New Jersey, USA</p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>Data Protection Officer:</strong> dpo@victorysync.com
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
