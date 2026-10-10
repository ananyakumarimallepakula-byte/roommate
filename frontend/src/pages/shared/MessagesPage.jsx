import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatApi, userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Badge } from '../../components/Badge';
import { Send, MessageSquare, User, Clock, Check, CheckCheck, Search } from 'lucide-react';

export const MessagesPage = () => {
  const { user } = useAuth();
  const { showError } = useToast();
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newTextMessage, setNewTextMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Fallback target user if starting a new conversation from ?userId=...
  const [targetUser, setTargetUser] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await chatApi.getConversations({ page: 0, size: 50 });
      const convList = res.data?.content || [];
      setConversations(convList);

      // If queryUserId is present, find if conversation already exists
      if (queryUserId) {
        const found = convList.find(c => c.otherUser?.id === Number(queryUserId));
        if (found) {
          setActiveConversation(found);
        } else {
          // Fetch user details to start a fresh chat
          try {
            const userRes = await userApi.getUserById(queryUserId);
            if (userRes.data) {
              setTargetUser(userRes.data);
            }
          } catch (e) {
            // ignore
          }
        }
      } else if (convList.length > 0 && !activeConversation) {
        setActiveConversation(convList[0]);
      }
    } catch (err) {
      showError(err.message || 'Failed to load conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [queryUserId, showError]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await chatApi.getMessages(activeConversation.id);
        setMessages(res.data || []);
      } catch (err) {
        showError(err.message || 'Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversation, showError]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newTextMessage.trim()) return;

    const recipientId = activeConversation
      ? activeConversation.otherUser?.id
      : targetUser?.id;

    if (!recipientId) return;

    try {
      setSending(true);
      const res = await chatApi.sendMessage({
        recipientId,
        content: newTextMessage.trim()
      });

      const sentMsg = res.data;
      setMessages(prev => [...prev, sentMsg]);
      setNewTextMessage('');

      // Refresh conversations list to update order and lastMessage
      const convRes = await chatApi.getConversations({ page: 0, size: 50 });
      const convList = convRes.data?.content || [];
      setConversations(convList);

      if (!activeConversation) {
        const newConv = convList.find(c => c.otherUser?.id === recipientId);
        if (newConv) {
          setActiveConversation(newConv);
          setTargetUser(null);
        }
      }
    } catch (err) {
      showError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const name = c.otherUser?.fullName?.toLowerCase() || '';
    return name.includes(searchFilter.toLowerCase());
  });

  const currentRecipient = activeConversation?.otherUser || targetUser;

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.6rem', margin: 0 }}>Direct Messages</h1>
      </div>

      <div
        className="card"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          padding: 0,
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Left Pane: Conversation List */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          {/* Search Bar */}
          <div style={{ padding: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search conversations..."
                className="input-field"
                style={{ paddingLeft: '2.2rem', fontSize: '0.875rem' }}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          {/* Conversations scroll area */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConversations ? (
              <div className="flex-center" style={{ padding: '2rem' }}>
                <LoadingSpinner size="md" />
              </div>
            ) : filteredConversations.length === 0 && !targetUser ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p>No conversations yet.</p>
                <p style={{ fontSize: '0.8rem' }}>Connect with roommates or property owners to start chatting.</p>
              </div>
            ) : (
              <div>
                {targetUser && !activeConversation && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      background: 'var(--primary-50)',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{targetUser.fullName} (New Chat)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send a message to start conversation</div>
                  </div>
                )}

                {filteredConversations.map((conv) => {
                  const isSelected = activeConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => { setActiveConversation(conv); setTargetUser(null); }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary-50)' : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--primary-600)' : '4px solid transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {conv.otherUser?.avatarUrl ? (
                          <img
                            src={conv.otherUser.avatarUrl.startsWith('http') ? conv.otherUser.avatarUrl : `http://localhost:8080${conv.otherUser.avatarUrl}`}
                            alt={conv.otherUser.fullName}
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: 'var(--primary-100)',
                              color: 'var(--primary-600)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600
                            }}
                          >
                            {conv.otherUser?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {conv.otherUser?.fullName}
                            </span>
                            {conv.lastMessageAt && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {new Date(conv.lastMessageAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                              {conv.lastMessage || 'No messages yet'}
                            </span>
                            {conv.unreadCount > 0 && (
                              <Badge variant="primary" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          {currentRecipient ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  background: 'var(--bg-primary)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                {currentRecipient.avatarUrl ? (
                  <img
                    src={currentRecipient.avatarUrl.startsWith('http') ? currentRecipient.avatarUrl : `http://localhost:8080${currentRecipient.avatarUrl}`}
                    alt={currentRecipient.fullName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600
                    }}
                  >
                    {currentRecipient.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{currentRecipient.fullName}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Role: {currentRecipient.role || 'Member'} • {currentRecipient.email}
                  </span>
                </div>
              </div>

              {/* Message List */}
              <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loadingMessages ? (
                  <div className="flex-center" style={{ height: '100%' }}>
                    <LoadingSpinner size="md" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Say hello to start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          alignSelf: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: isMe ? '16px' : '4px',
                            background: isMe ? 'var(--primary-600)' : 'var(--bg-primary)',
                            color: isMe ? '#ffffff' : 'var(--text-primary)',
                            boxShadow: 'var(--shadow-sm)',
                            fontSize: '0.925rem',
                            wordBreak: 'break-word',
                            border: isMe ? 'none' : '1px solid var(--border-color)'
                          }}
                        >
                          {msg.content}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.7rem',
                            color: 'var(--text-secondary)',
                            marginTop: '2px',
                            padding: '0 4px'
                          }}
                        >
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            msg.isRead ? <CheckCheck size={13} color="var(--primary-600)" /> : <Check size={13} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '0.85rem 1.25rem',
                  background: 'var(--bg-primary)',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="input-field"
                  style={{ flex: 1, margin: 0 }}
                  value={newTextMessage}
                  onChange={(e) => setNewTextMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending || !newTextMessage.trim()}
                  style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={16} /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-secondary)' }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <h3>Select a conversation</h3>
              <p style={{ fontSize: '0.9rem' }}>Choose a contact from the list on the left to read and send messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
