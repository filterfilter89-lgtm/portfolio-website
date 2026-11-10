import React, { useState, useEffect, useCallback } from 'react';
import { submitContact } from '../utils/api';

/**
 * Dedicated Contact Page Component
 * - 100% Visual fidelity to the website's stationery, vinyl, and editorial design language
 * - Back button in top-left with ONLY an arrow (no text or labels)
 * - Complete contact channels: email copy, direct mailto, and functional inquiry form submitting to /api/contact
 * - Accessible keyboard navigation (ESC returns to previous page)
 */
export default function ContactView({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Video Editing',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // ESC key to return
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onBack) onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('basiljose8989@gmail.com');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      setIsCopied(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setFormStatus('loading');
    setErrorMessage('');

    try {
      await submitContact({
        name: formData.name || 'Anonymous',
        email: formData.email,
        service: formData.service,
        message: formData.message,
        subject: `Portfolio Inquiry from ${formData.name || formData.email}`
      });
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        service: 'Video Editing',
        message: ''
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      setFormStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try emailing directly.');
    }
  };

  return (
    <div className="contact-page-wrapper">
      {/* Back Button: Strictly back arrow only (No text labels) */}
      <button
        type="button"
        className="clean-back-btn"
        onClick={onBack}
        aria-label="Return to previous page"
        title="Back (ESC)"
      >
        <svg
          className="back-arrow-svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Main Contact Editorial Card */}
      <main className="contact-container">
        <div className="contact-card">
          {/* Header Title Block */}
          <div className="contact-header-block">
            <span className="contact-eyebrow">[ INQUIRIES &amp; COMMISSIONS ]</span>
            <h1 className="contact-headline">Get in Touch</h1>
            <p className="contact-lead">
              Have a project in mind, a visual reel inquiry, or interested in collaborating? Let's connect.
            </p>
          </div>

          <div className="contact-layout-grid">
            {/* Left Column: Direct Info & Details */}
            <div className="contact-info-col">
              {/* Direct Email Card */}
              <div className="contact-channel-card">
                <span className="channel-label">DIRECT EMAIL</span>
                <a href="mailto:basiljose8989@gmail.com" className="channel-value">
                  basiljose8989@gmail.com
                </a>
                <div className="channel-actions">
                  <button
                    type="button"
                    className="channel-action-btn"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address to clipboard"
                  >
                    {isCopied ? '&#10003; COPIED' : 'COPY EMAIL'}
                  </button>
                  <a
                    href="mailto:basiljose8989@gmail.com"
                    className="channel-action-btn is-primary"
                  >
                    SEND EMAIL &#8599;
                  </a>
                </div>
              </div>

              {/* Specialties & Location */}
              <div className="contact-meta-card">
                <div className="contact-meta-group">
                  <span className="meta-label">DISCIPLINES</span>
                  <span className="meta-value">Video Editing &#8226; Art Direction &#8226; Graphic Design &#8226; Photography</span>
                </div>

                <div className="contact-meta-group">
                  <span className="meta-label">LOCATION</span>
                  <span className="meta-value">Kochi, Kerala &#8226; Open to Global Remote</span>
                </div>

                <div className="contact-meta-group">
                  <span className="meta-label">RESUME / CV</span>
                  <a
                    href="/basil jose final cv.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-link"
                  >
                    Download PDF Document &#8599;
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Functional Inquiry Form */}
            <div className="contact-form-col">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    YOUR NAME
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Maya Chen"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="e.g. maya@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-service" className="form-label">
                    PROJECT SCOPE
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    className="form-select"
                    value={formData.service}
                    onChange={handleChange}
                    disabled={formStatus === 'loading'}
                  >
                    <option value="Video Editing">Video Editing &amp; Post-Production</option>
                    <option value="Graphic Design">Graphic Design &amp; Brand Identity</option>
                    <option value="Commercial Reels">Commercial &amp; Social Video Reels</option>
                    <option value="Photography">Photography &amp; Creative Direction</option>
                    <option value="General Inquiry">General Collaboration / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">
                    MESSAGE *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="4"
                    className="form-textarea"
                    placeholder="Tell me about your project, goals, or timeline..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={formStatus === 'loading'}
                  />
                </div>

                {/* Form feedback status */}
                {formStatus === 'success' && (
                  <div className="form-banner is-success" role="alert">
                    &#10003; Thank you! Your message has been received. I'll get back to you shortly.
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="form-banner is-error" role="alert">
                    &#9888; {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={formStatus === 'loading'}
                >
                  {formStatus === 'loading' ? 'TRANSMITTING...' : 'SEND INQUIRY &#8594;'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
