import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left section - Logo + Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full border border-yellow-400"
          />
          <span className="text-xl font-semibold text-gray-800">
            HD Booking
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
