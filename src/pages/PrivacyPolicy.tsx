import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> April 15, 2026
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to GlycoGrit ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p className="text-gray-700">
                  By accessing or using GlycoGrit, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Register for an account</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in challenges or events</li>
                  <li>Contact us through our website</li>
                  <li>Interact with us on social media</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  This information may include:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Profile information (username, profile picture)</li>
                  <li>Fitness activity data (distance, time, routes)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 mb-4">
                  When you visit our website, we may automatically collect certain information about your device and browsing actions, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing your registrations and managing your account</li>
                  <li>Sending you updates about challenges, events, and community activities</li>
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Analyzing usage patterns to enhance user experience</li>
                  <li>Detecting, preventing, and addressing technical issues or fraudulent activities</li>
                  <li>Complying with legal obligations and enforcing our terms of service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Social Media Integration</h2>
                <p className="text-gray-700 mb-4">
                  Our website integrates with Instagram to display photos from our community. When you view our Gallery page:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>We display publicly available Instagram content from our official @glycogrit account</li>
                  <li>We use Instagram's official API in compliance with their terms of service</li>
                  <li>We do not collect or store your personal Instagram data</li>
                  <li>Clicking on Instagram photos will redirect you to Instagram's platform</li>
                </ul>
                <p className="text-gray-700">
                  Your use of Instagram is governed by Instagram's Privacy Policy and Terms of Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                  <li><strong>Community Features:</strong> Information you choose to share publicly (such as challenge results or profile information) may be visible to other users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Restricted access to personal information</li>
                  <li>Secure storage of sensitive information</li>
                </ul>
                <p className="text-gray-700">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website</li>
                  <li>Improve website functionality and performance</li>
                  <li>Provide personalized content and recommendations</li>
                </ul>
                <p className="text-gray-700">
                  You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights and Choices</h2>
                <p className="text-gray-700 mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Access and Update:</strong> You can access and update your account information at any time</li>
                  <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to legal obligations</li>
                  <li><strong>Opt-Out:</strong> You can unsubscribe from marketing communications at any time</li>
                  <li><strong>Data Portability:</strong> You can request a copy of your personal information in a structured format</li>
                  <li><strong>Restrict Processing:</strong> You can request restriction of processing of your personal information</li>
                </ul>
                <p className="text-gray-700">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information from our systems.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
                <p className="text-gray-700">
                  Our website may contain links to third-party websites, including Instagram, Facebook, and other social media platforms. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Effective Date" at the top of this page. Your continued use of our services after such changes constitutes your acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. International Data Transfers</h2>
                <p className="text-gray-700">
                  Your information may be transferred to and maintained on servers located outside of your country of residence. By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your country.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>GlycoGrit</strong></p>
                  <p className="text-gray-700 mb-2">Email: privacy@glycogrit.com</p>
                  <p className="text-gray-700 mb-2">Website: https://glycogrit.com</p>
                  <p className="text-gray-700">Instagram: @glycogrit</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Data Retention</h2>
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  This Privacy Policy was last updated on April 15, 2026. By using GlycoGrit, you acknowledge that you have read and understood this Privacy Policy.
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
