import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, RefreshCw, SlidersHorizontal, Send } from 'lucide-react';
import { matchingApi, requestApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { RoommateCard } from '../../components/RoommateCard';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const RoommateMatchesPage = () => {
  const { showSuccess, showError } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Connection request modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchMatches = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await matchingApi.getMatches();
      if (res.data) {
        setMatches(res.data);
      }
      if (isManualRefresh) showSuccess('Matches recalculated successfully');
    } catch (err) {
      showError(err.message || 'Could not load matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleOpenConnectModal = (candidateUser) => {
    setSelectedCandidate(candidateUser);
    setRequestMessage(`Hi ${candidateUser.fullName}, I noticed we matched with high compatibility on ROOMMATE. Would you like to connect and discuss finding a flat together?`);
    setRequestModalOpen(true);
  };

  const handleSendRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    try {
      setSubmittingRequest(true);
      await requestApi.sendRequest({
        receiverId: selectedCandidate.id,
        message: requestMessage.trim()
      });
      showSuccess(`Connection request sent to ${selectedCandidate.fullName}!`);
      setRequestModalOpen(false);
      // Refresh match list so status reflects immediately
      fetchMatches();
    } catch (err) {
      showError(err.message || 'Failed to send request');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Deterministic Weighted Engine</span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Compatible Roommates</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Ranked in real time based on your budget, location, sleep habits, and lifestyle preferences.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => fetchMatches(true)}
              loading={refreshing}
            >
              <RefreshCw size={16} /> Refresh Matches
            </Button>
            <Link to="/student/preferences" className="btn btn-primary">
              <SlidersHorizontal size={16} /> Edit My Preferences
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Evaluating compatibility algorithms..." />
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-3">
            {matches.map((match) => (
              <RoommateCard
                key={match.student.id}
                match={match}
                onSendRequest={handleOpenConnectModal}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Users size={48} style={{ color: 'var(--text-sub)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Compatible Roommates Yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We could not find active students matching your criteria. Make sure your preferences are saved and try broadening your budget or location flexibility.
            </p>
            <Link to="/student/preferences" className="btn btn-primary">
              Edit Roommate Preferences
            </Link>
          </div>
        )}

      </div>

      {/* Connection Request Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Connect with ${selectedCandidate?.fullName}`}
      >
        <form onSubmit={handleSendRequestSubmit}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Sending a connection request lets you start a conversation and explore sharing an accommodation together.
          </p>

          <Input
            as="textarea"
            label="Introductory Message"
            rows={4}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submittingRequest}>
              <Send size={16} /> Send Connection Request
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
