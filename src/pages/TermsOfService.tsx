import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>

            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> April 15, 2026
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to GlycoGrit ("we," "our," or "us"). By accessing or using our website, mobile application, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
                <p className="text-gray-700 mb-4">
                  GlycoGrit is a cycling community platform that provides:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Organized cycling challenges and events</li>
                  <li>Community engagement and social features</li>
                  <li>Activity tracking and progress monitoring</li>
                  <li>Photo galleries and community content</li>
                  <li>Communication tools for riders</li>
                  <li>Event registration and management</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Registration</h3>
                <p className="text-gray-700 mb-4">
                  To access certain features of our Services, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be responsible for all activities that occur under your account</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Eligibility</h3>
                <p className="text-gray-700 mb-4">
                  You must be at least 13 years old to use our Services. If you are under 18, you must have parental or guardian consent to use our Services.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Account Termination</h3>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
                <p className="text-gray-700 mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others, including intellectual property rights</li>
                  <li>Post or share inappropriate, offensive, or harmful content</li>
                  <li>Harass, bully, or threaten other users</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems (bots) without our permission</li>
                  <li>Interfere with the proper functioning of the Services</li>
                  <li>Collect or harvest user information without consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Challenges and Events</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Participation</h3>
                <p className="text-gray-700 mb-4">
                  By participating in GlycoGrit challenges and events, you:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Acknowledge that cycling involves inherent risks</li>
                  <li>Accept full responsibility for your own safety</li>
                  <li>Agree to follow all traffic laws and safety regulations</li>
                  <li>Confirm you are physically fit to participate</li>
                  <li>Release GlycoGrit from liability for any injuries or damages</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Challenge Rules</h3>
                <p className="text-gray-700 mb-4">
                  Each challenge may have specific rules and requirements. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Read and follow all challenge-specific rules</li>
                  <li>Submit accurate activity data</li>
                  <li>Not cheat or manipulate results</li>
                  <li>Respect other participants and organizers</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Registration and Fees</h3>
                <p className="text-gray-700">
                  Some events may require registration fees. All fees are non-refundable unless otherwise stated. We reserve the right to cancel events and issue refunds at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content and Intellectual Property</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Your Content</h3>
                <p className="text-gray-700 mb-4">
                  You retain ownership of content you post on GlycoGrit. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Display, distribute, and promote your content on our Services</li>
                  <li>Use your content for marketing and promotional purposes</li>
                  <li>Modify or adapt your content for different formats</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Our Content</h3>
                <p className="text-gray-700 mb-4">
                  All content provided by GlycoGrit, including text, graphics, logos, and software, is protected by intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Reverse engineer or decompile our software</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Copyright Infringement</h3>
                <p className="text-gray-700">
                  If you believe content on our Services infringes your copyright, please contact us with detailed information about the alleged infringement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services and Links</h2>
                <p className="text-gray-700 mb-4">
                  Our Services may integrate with or link to third-party services, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Instagram and other social media platforms</li>
                  <li>Payment processors</li>
                  <li>Fitness tracking applications</li>
                  <li>Mapping and navigation services</li>
                </ul>
                <p className="text-gray-700">
                  We are not responsible for the content, privacy practices, or terms of service of third-party services. Your use of third-party services is at your own risk.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using our Services, you consent to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Our collection and processing of your personal data</li>
                  <li>Our use of cookies and tracking technologies</li>
                  <li>Our sharing of data with service providers</li>
                </ul>
                <p className="text-gray-700">
                  Please review our Privacy Policy for detailed information about how we handle your data.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Service Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>The Services will be uninterrupted, secure, or error-free</li>
                  <li>The information provided will be accurate or reliable</li>
                  <li>Any defects will be corrected</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Health and Safety Disclaimer</h3>
                <p className="text-gray-700 mb-4">
                  Cycling and physical activity involve inherent risks. You should:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Consult a healthcare professional before starting any fitness program</li>
                  <li>Use appropriate safety equipment</li>
                  <li>Follow all traffic laws and regulations</li>
                  <li>Exercise caution and good judgment during activities</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">9.3 Limitation of Liability</h3>
                <p className="text-gray-700">
                  To the maximum extent permitted by law, GlycoGrit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless GlycoGrit, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Your use of the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Your content posted on the Services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Payment and Refunds</h2>
                <p className="text-gray-700 mb-4">
                  If you make purchases through our Services:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                  <li>Payment is processed through secure third-party processors</li>
                  <li>Registration fees are generally non-refundable</li>
                  <li>Refunds may be issued at our discretion for cancelled events</li>
                  <li>You are responsible for any applicable taxes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your access to the Services immediately, without prior notice, for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Behavior that harms other users or our community</li>
                  <li>Any other reason at our sole discretion</li>
                </ul>
                <p className="text-gray-700">
                  Upon termination, your right to use the Services will immediately cease. All provisions of these Terms that should survive termination shall survive.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 Governing Law</h3>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 Dispute Resolution Process</h3>
                <p className="text-gray-700 mb-4">
                  In the event of any dispute arising from these Terms or your use of the Services:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>You agree to first attempt to resolve the dispute informally by contacting us</li>
                  <li>If informal resolution is unsuccessful, disputes shall be resolved through binding arbitration</li>
                  <li>You agree to waive your right to participate in class action lawsuits</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 Jurisdiction</h3>
                <p className="text-gray-700">
                  Any legal action or proceeding relating to these Terms shall be brought exclusively in the courts located in India.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. General Provisions</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.1 Entire Agreement</h3>
                <p className="text-gray-700 mb-4">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and GlycoGrit regarding the Services.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.2 Severability</h3>
                <p className="text-gray-700 mb-4">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.3 Waiver</h3>
                <p className="text-gray-700 mb-4">
                  Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">14.4 Assignment</h3>
                <p className="text-gray-700">
                  You may not assign or transfer these Terms or your rights hereunder. We may assign our rights and obligations without restriction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>GlycoGrit</strong></p>
                  <p className="text-gray-700 mb-2">Email: support@glycogrit.com</p>
                  <p className="text-gray-700 mb-2">Website: https://glycogrit.com</p>
                  <p className="text-gray-700">Instagram: @glycogrit</p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  These Terms of Service were last updated on April 15, 2026. By using GlycoGrit, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
