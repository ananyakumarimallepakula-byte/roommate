import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Search, 
  Users, 
  Info, 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  PlusCircle, 
  ShieldCheck, 
  Menu, 
  X,
  Heart
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout, unreadNotifCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F46E5, #0D9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Home size={22} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            ROOM<span style={{ color: 'var(--primary)' }}>MATE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link 
            to="/" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.9375rem', 
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)' 
            }}
          >
            Home
          </Link>
          <Link 
            to="/rooms" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.9375rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.375rem',
              color: isActive('/rooms') ? 'var(--primary)' : 'var(--text-muted)' 
            }}
          >
            <Search size={16} />
            Find Rooms
          </Link>
          
          {/* Roommates link visible to all, points to matches if student or prompt */}
          <Link 
            to={role === 'STUDENT' ? '/student/matches' : '/rooms'} 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.9375rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.375rem',
              color: isActive('/student/matches') ? 'var(--primary)' : 'var(--text-muted)' 
            }}
          >
            <Users size={16} />
            Find Roommates
          </Link>
          
          <Link 
            to="/about" 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.9375rem', 
              color: isActive('/about') ? 'var(--primary)' : 'var(--text-muted)' 
            }}
          >
            About
          </Link>
        </div>

        {/* Desktop Right Controls (Auth aware) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <>
              {/* Messages */}
              <Link 
                to="/messages" 
                style={{ 
                  color: 'var(--text-muted)', 
                  position: 'relative', 
                  padding: '0.5rem', 
                  borderRadius: '8px' 
                }}
                title="Messages"
              >
                <MessageSquare size={20} />
              </Link>

              {/* Notifications */}
              <Link 
                to="/notifications" 
                style={{ 
                  color: 'var(--text-muted)', 
                  position: 'relative', 
                  padding: '0.5rem', 
                  borderRadius: '8px' 
                }}
                title="Notifications"
              >
                <Bell size={20} />
                {unreadNotifCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'var(--danger)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </Link>

              {/* Role-specific quick actions */}
              {role === 'OWNER' && (
                <Link to="/owner/add-accommodation" className="btn btn-primary btn-sm">
                  <PlusCircle size={16} />
                  Add Listing
                </Link>
              )}

              {/* User Avatar & Menu Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=4F46E5&color=fff`}
                    alt={user?.fullName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      background: '#FFFFFF',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      width: '220px',
                      padding: '0.5rem 0',
                      zIndex: 1000
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.fullName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                      <span className="badge badge-primary" style={{ marginTop: '0.375rem', fontSize: '0.65rem' }}>
                        {role}
                      </span>
                    </div>

                    {role === 'STUDENT' && (
                      <>
                        <Link 
                          to="/student/dashboard" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                        >
                          <User size={16} /> Student Dashboard
                        </Link>
                        <Link 
                          to="/student/matches" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                        >
                          <Users size={16} /> Roommate Matches
                        </Link>
                        <Link 
                          to="/student/saved" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                        >
                          <Heart size={16} /> Saved Listings
                        </Link>
                      </>
                    )}

                    {role === 'OWNER' && (
                      <>
                        <Link 
                          to="/owner/dashboard" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                        >
                          <User size={16} /> Owner Dashboard
                        </Link>
                        <Link 
                          to="/owner/listings" 
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                        >
                          <Home size={16} /> Manage Listings
                        </Link>
                      </>
                    )}

                    {role === 'ADMIN' && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.875rem', color: 'var(--primary)' }}
                      >
                        <ShieldCheck size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', margin: '0.25rem 0' }}></div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--danger)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: '#FFF' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/rooms" onClick={() => setMobileMenuOpen(false)}>Find Rooms</Link>
            <Link to={role === 'STUDENT' ? '/student/matches' : '/rooms'} onClick={() => setMobileMenuOpen(false)}>Find Roommates</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to={role === 'STUDENT' ? '/student/dashboard' : role === 'OWNER' ? '/owner/dashboard' : '/admin/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                  My Dashboard
                </Link>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>Messages</Link>
                <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>Notifications ({unreadNotifCount})</Link>
                <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ marginTop: '0.5rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm flex-1" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn btn-primary btn-sm flex-1" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
