import React, { useState, useEffect } from 'react';
import { register, login, getProfile } from '../services/authApi';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
    
    if (!newMember.email || !newMember.password) {
      showMessage('ইমেইল এবং পাসওয়ার্ড প্রয়োজন', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await register(newMember.email, newMember.password);
      
      if (result.success) {
        // Add the new member to the list
        const newMemberData = {
          id: result.user_id,
          email: newMember.email,
          created_at: new Date().toISOString(),
          token: result.token
        };
        
        setMembers(prev => [...prev, newMemberData]);
        setNewMember({ email: '', password: '' });
        showMessage('সদস্য সফলভাবে নিবন্ধিত হয়েছে!', 'success');
      } else {
        showMessage('নিবন্ধন ব্যর্থ হয়েছে', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showMessage(`নিবন্ধন ত্রুটি: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testLogin = async (email, password) => {
    try {
      const result = await login(email, password);
      if (result.success) {
        showMessage(`লগইন সফল! টোকেন: ${result.token.substring(0, 20)}...`, 'success');
      }
    } catch (error) {
      showMessage(`লগইন ত্রুটি: ${error.message}`, 'error');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>সমিতি সদস্য তালিকা</h1>
      
      {/* Message Display */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Add New Member Form */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px' 
      }}>
        <h2>নতুন সদস্য যোগ করুন</h2>
        <form onSubmit={handleSubmitNewMember}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              ইমেইল:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newMember.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              placeholder="example@somiti.com"
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
              পাসওয়ার্ড:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={newMember.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
              placeholder="কমপক্ষে ৬ অক্ষর"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'নিবন্ধন হচ্ছে...' : 'সদস্য নিবন্ধন করুন'}
          </button>
        </form>
      </div>

      {/* Members List */}
      <div>
        <h2>নিবন্ধিত সদস্যগণ ({members.length})</h2>
        {members.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            এখনো কোন সদস্য নিবন্ধিত হয়নি
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {members.map((member, index) => (
              <div
                key={member.id}
                style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                      সদস্য #{index + 1}
                    </h3>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                      <strong>ইমেইল:</strong> {member.email}
                    </p>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                      <strong>আইডি:</strong> {member.id}
                    </p>
                    <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>
                      <strong>নিবন্ধনের তারিখ:</strong> {new Date(member.created_at).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => testLogin(member.email, 'test123')}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '5px 10px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      লগইন টেস্ট
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Accounts */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '8px' 
      }}>
        <h3>টেস্ট অ্যাকাউন্ট</h3>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          <strong>ইমেইল:</strong> fresh@somiti.com
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          <strong>পাসওয়ার্ড:</strong> fresh123
        </p>
        <button
          onClick={() => testLogin('fresh@somiti.com', 'fresh123')}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            padding: '5px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: '10px'
          }}
        >
          টেস্ট অ্যাকাউন্ট দিয়ে লগইন করুন
        </button>
      </div>
    </div>
  );
};

export default MemberList;