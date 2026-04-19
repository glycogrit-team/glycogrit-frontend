import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAdmin, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      setShowLoginModal(false);
      setEmail('');
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">GlycoGrit</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/challenges" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Challenges
              </Link>
              <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                About
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                How It Works
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">{user.email}</span>
                    {isAdmin && (
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
                    Sign In
                  </Button>
                  <Button size="sm">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <p className="text-gray-600 mb-4 text-sm">
              For testing: Use "glycogrit@gmail.com" to login as admin, or any other email for regular user.
            </p>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" fullWidth>
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setShowLoginModal(false);
                    setEmail('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
