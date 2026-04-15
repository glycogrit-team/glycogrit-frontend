import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function Navbar() {
  return (
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
            <Link to="/gallery" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Gallery
            </Link>
            <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
