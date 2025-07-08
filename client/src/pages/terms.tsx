
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Terms of Service
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Effective Date: January 9, 2025
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using VictorySync's services, you agree to be bound by these Terms of Service ("Terms"). 
                  If you do not agree to these Terms, please do not use our services. VictorySync LLC ("Company," "we," "us," or "our") 
                  is a New Jersey limited liability company providing business process outsourcing, AI automation, and call center services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  VictorySync provides comprehensive business process outsourcing services including:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Inbound and outbound call center services</li>
                  <li>AI-powered automation and workflow optimization</li>
                  <li>CRM integration and data management</li>
                  <li>Customer support and technical assistance</li>
                  <li>Lead generation and appointment setting</li>
                  <li>Custom business process solutions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Account Registration & Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  To access our services, you must create an account with accurate information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Fees, Billing, and Refunds</h2>
                <p className="text-gray-700 leading-relaxed">
                  Service fees are outlined in your service agreement. All fees are due within 30 days of invoice date. 
                  We accept major credit cards and bank transfers. Refunds are provided only as specified in your service agreement 
                  or as required by applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Service-Level Commitments & Uptime</h2>
                <p className="text-gray-700 leading-relaxed">
                  We strive to maintain 99.5% uptime for our services. Service-level agreements (SLAs) are defined in your 
                  individual service contract. We will use commercially reasonable efforts to meet these commitments.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Customer Data & Usage Rights</h2>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of your data. By using our services, you grant us a limited license to process your data 
                  as necessary to provide services. We will not use your data for any purpose beyond service delivery without your consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Prohibited Activities</h2>
                <p className="text-gray-700 leading-relaxed">
                  You may not use our services for:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Illegal activities or violation of applicable laws</li>
                  <li>Harassment, spam, or unsolicited communications</li>
                  <li>Transmission of malware or harmful code</li>
                  <li>Unauthorized access to systems or data</li>
                  <li>Activities that violate third-party rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  All VictorySync intellectual property, including software, processes, and methodologies, remains our property. 
                  You may not copy, modify, or distribute our intellectual property without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">9. Confidentiality & Non-Solicitation</h2>
                <p className="text-gray-700 leading-relaxed">
                  Both parties agree to maintain confidentiality of proprietary information. During the term of service and for 
                  12 months thereafter, you agree not to solicit our employees or contractors.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">10. Disclaimer of Warranties</h2>
                <p className="text-gray-700 leading-relaxed">
                  Services are provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, 
                  including warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our liability is limited to the amount paid for services in the 12 months preceding the claim. We are not liable 
                  for indirect, consequential, or punitive damages, even if we have been advised of their possibility.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">12. Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold us harmless from claims arising from your use of our services, violation of these 
                  Terms, or infringement of third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">13. Termination & Suspension</h2>
                <p className="text-gray-700 leading-relaxed">
                  Either party may terminate services with 30 days written notice. We may suspend services immediately for 
                  non-payment or violation of these Terms. Upon termination, you must pay all outstanding fees.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">14. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by the laws of New Jersey, USA, without regard to conflict of law principles. 
                  Any disputes will be resolved in the courts of New Jersey.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">15. Dispute Resolution & Arbitration</h2>
                <p className="text-gray-700 leading-relaxed">
                  Disputes exceeding $10,000 will be resolved through binding arbitration under the American Arbitration Association 
                  rules. Smaller disputes may be resolved in small claims court.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">16. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms at any time. Changes will be effective 30 days after posting. Continued use of services 
                  constitutes acceptance of updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">17. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these Terms, contact us at:
                </p>
                <div className="mt-2 text-gray-700">
                  <p><strong>VictorySync LLC</strong></p>
                  <p>Email: legal@victorysync.com</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Address: New Jersey, USA</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
