import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

export default function DataDeletion() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Data Deletion Instructions</h1>

            <p className="text-gray-600 mb-8">
              <strong>Last Updated:</strong> April 15, 2026
            </p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Right to Data Deletion</h2>
                <p className="text-gray-700 mb-4">
                  At GlycoGrit, we respect your privacy and your right to control your personal data. You have the right to request the deletion of your personal information that we have collected and stored.
                </p>
                <p className="text-gray-700">
                  This page explains how you can request the deletion of your data from our systems, including data collected through our website and any integrations with third-party platforms like Instagram.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Data We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We may collect and store the following types of data:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, profile information</li>
                  <li><strong>Activity Data:</strong> Cycling activities, challenge participation, progress tracking</li>
                  <li><strong>Social Media Data:</strong> Public Instagram content displayed on our Gallery page</li>
                  <li><strong>Communication Data:</strong> Messages, support inquiries, community interactions</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                  <li><strong>Payment Information:</strong> Transaction history (payment details are processed by third-party processors)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request Data Deletion</h2>
                <p className="text-gray-700 mb-4">
                  You can request deletion of your data through any of the following methods:
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Method 1: Email Request</h3>
                  <p className="text-blue-800 mb-3">
                    Send an email to: <strong>privacy@glycogrit.com</strong>
                  </p>
                  <p className="text-blue-800 mb-2">
                    Include in your email:
                  </p>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Subject line: "Data Deletion Request"</li>
                    <li>Your full name</li>
                    <li>Email address associated with your account</li>
                    <li>Username (if applicable)</li>
                    <li>Specific data you want deleted (or request complete deletion)</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Method 2: WhatsApp</h3>
                  <p className="text-green-800 mb-3">
                    Contact us via WhatsApp: <strong>+91 98765 43210</strong>
                  </p>
                  <p className="text-green-800">
                    Send a message with your data deletion request including your account details and the specific information you'd like deleted.
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Method 3: Account Settings</h3>
                  <p className="text-purple-800 mb-3">
                    If you have an account, you can:
                  </p>
                  <ol className="list-decimal list-inside text-purple-800 space-y-1">
                    <li>Log in to your GlycoGrit account</li>
                    <li>Go to Account Settings</li>
                    <li>Select "Privacy & Data"</li>
                    <li>Click "Request Data Deletion"</li>
                    <li>Follow the confirmation prompts</li>
                  </ol>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Deletion Process Timeline</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-4">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Request Received</h3>
                      <p className="text-gray-700">
                        We will acknowledge receipt of your data deletion request within <strong>24-48 hours</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-4">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Identity Verification</h3>
                      <p className="text-gray-700">
                        For security purposes, we may need to verify your identity before processing the deletion. This typically takes <strong>1-2 business days</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-4">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Deletion</h3>
                      <p className="text-gray-700">
                        Once verified, we will process your request and delete your data within <strong>30 days</strong>. You will receive a confirmation email once the deletion is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens When You Delete Your Data</h2>
                <p className="text-gray-700 mb-4">
                  When you request data deletion:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Your account will be permanently deactivated</li>
                  <li>Your personal information will be removed from our active databases</li>
                  <li>Your activity history and challenge participation data will be deleted</li>
                  <li>Any content you posted (photos, comments) will be removed</li>
                  <li>You will no longer receive communications from us</li>
                  <li>You will need to create a new account if you wish to use our services again</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data We May Retain</h2>
                <p className="text-gray-700 mb-4">
                  In some cases, we may need to retain certain data for legal, security, or operational reasons:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li><strong>Legal Obligations:</strong> Data required by law or for legal proceedings</li>
                  <li><strong>Transaction Records:</strong> Payment and transaction history for accounting purposes</li>
                  <li><strong>Security:</strong> Data needed to prevent fraud or abuse</li>
                  <li><strong>Backup Systems:</strong> Data in backup systems will be deleted in accordance with our data retention schedule (typically within 90 days)</li>
                </ul>
                <p className="text-gray-700">
                  Any retained data will be kept secure and used only for the purposes specified above.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Instagram and Third-Party Data</h2>
                <p className="text-gray-700 mb-4">
                  If you've connected your Instagram account or other third-party services:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>We will remove the connection between your GlycoGrit account and your Instagram account</li>
                  <li>Public Instagram content displayed on our Gallery page is sourced from our official @glycogrit account, not individual user accounts</li>
                  <li>To delete data from Instagram itself, you must do so through Instagram's platform</li>
                  <li>To delete data from other third-party services, please contact those services directly</li>
                </ul>
                <p className="text-gray-700">
                  For Instagram-specific data deletion, visit:{' '}
                  <a
                    href="https://help.instagram.com/contact/186020218683230"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Instagram Data Deletion Help
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Partial Data Deletion</h2>
                <p className="text-gray-700 mb-4">
                  If you don't want to delete all your data, you can request deletion of specific types of information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Activity history only</li>
                  <li>Profile information</li>
                  <li>Communication history</li>
                  <li>Specific posts or content</li>
                </ul>
                <p className="text-gray-700">
                  Please specify in your deletion request which data you want removed.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      How long does the deletion process take?
                    </h3>
                    <p className="text-gray-700">
                      The entire process typically takes up to 30 days from the time we verify your identity. You will receive a confirmation email once the deletion is complete.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Can I recover my data after deletion?
                    </h3>
                    <p className="text-gray-700">
                      No, data deletion is permanent. Once your data is deleted, it cannot be recovered. Please ensure you have downloaded any information you want to keep before requesting deletion.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Will deleting my data affect my challenge results?
                    </h3>
                    <p className="text-gray-700">
                      Yes, deleting your account and data will remove your challenge participation history and results. This action cannot be undone.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      What about data shared with third parties?
                    </h3>
                    <p className="text-gray-700">
                      We will notify any third-party service providers to delete your data from their systems as well. However, you may need to contact them directly to ensure complete deletion.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Do I need to delete my account to delete my data?
                    </h3>
                    <p className="text-gray-700">
                      Complete data deletion requires account closure. However, you can request partial data deletion while keeping your account active.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about data deletion or need assistance with your request:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>GlycoGrit Data Privacy Team</strong></p>
                  <p className="text-gray-700 mb-2">Email: privacy@glycogrit.com</p>
                  <p className="text-gray-700 mb-2">WhatsApp: +91 98765 43210</p>
                  <p className="text-gray-700 mb-4">Website: https://glycogrit.com</p>
                  <p className="text-gray-700 text-sm">
                    For general privacy inquiries, please see our{' '}
                    <Link to="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </section>

              <div className="mt-12 pt-8 border-t border-gray-200 bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Notice</h3>
                <p className="text-gray-700 mb-2">
                  Before requesting data deletion, please consider:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Data deletion is permanent and cannot be reversed</li>
                  <li>You will lose access to your account and all associated data</li>
                  <li>Any active challenge registrations or memberships will be cancelled</li>
                  <li>You may want to download your data before deletion</li>
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-gray-600 text-sm">
                  This data deletion policy was last updated on April 15, 2026. We reserve the right to update these procedures to comply with applicable laws and regulations.
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
