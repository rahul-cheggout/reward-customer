import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import {
  BANK_NAME,
  sendOtp,
  verifyOtp,
  storeCheggoutPwaSession,
  establishChegSession
} from '../services/api';
import {
  MobileIcon,
  OtpKeypadIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  LoginArrowIcon,
  AlertCircleIcon,
  FeatureCardIcon,
  FeatureBankIcon,
  FeatureGiftIcon,
  FeatureFlashIcon,
  HeroDecorativeSvg,
  FloatingChips,
  AuthRightGlowSvg
} from '../components/Icons';

const HERO_FEATURES = [
  { label: 'Real-time Points Tracker Across All Cards', icon: <FeatureCardIcon /> },
  { label: 'Instant Voucher Claim (Amazon, Flipkart & D2C)', icon: <FeatureGiftIcon /> },
  { label: 'RuPay & Visa Exclusive Cardmember Privileges', icon: <FeatureBankIcon /> },
  { label: 'Instant & Secure OTP Access via Mobile', icon: <FeatureFlashIcon /> }
];

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { bank, setBankInfo } = useBank();

  const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(30);

  useEffect(() => {
    let timer;
    if (step === 'otp' && resendSeconds > 0) {
      timer = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendSeconds]);

  const handleSendOtp = async () => {
    if (!MOBILE_REGEX.test(mobileNumber)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg('');
    try {
      const res = await sendOtp(mobileNumber);
      setDevOtp(res.devOtp || null);
      setStep('otp');
      setResendSeconds(30);
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Could not send verification OTP. Please try again.';
      setErrorMsg(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsVerifying(true);
    setErrorMsg('');
    try {
      const res = await verifyOtp(mobileNumber, otp);
      login(res.token, res.user);
      if (res.bank) {
        setBankInfo(res.bank);
      }
      if (res.cheggoutPwa?.token) {
        storeCheggoutPwaSession(res.cheggoutPwa, mobileNumber, BANK_NAME);
      } else {
        establishChegSession(mobileNumber, BANK_NAME);
      }
      navigate('/cards', { replace: true });
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Verification failed. Please check the OTP and try again.';
      setErrorMsg(errMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendSeconds > 0) return;
    setIsResending(true);
    setErrorMsg('');
    try {
      const res = await sendOtp(mobileNumber);
      setDevOtp(res.devOtp || null);
      setResendSeconds(30);
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Could not resend OTP. Please wait a moment.';
      setErrorMsg(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (devOtp) {
      setOtp(devOtp);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Column: Hero Showcase */}
      <div className="auth-left">
        <HeroDecorativeSvg />
        <FloatingChips />

        <div className="auth-hero">
          <div className="hero-iob-emblem-row">
            <div className="hero-logo-badge">
              <img src="/iob_logo.png" alt="Indian Overseas Bank" />
            </div>
            <div className="hero-bank-name">
              <span>Indian Overseas Bank</span>
              <span className="hero-tagline">Good People to Grow With</span>
            </div>
          </div>

          <h1>Turn your credit card points into luxury rewards.</h1>
          <p>
            Your exclusive rewards portal — check live point balances across all your IOB credit cards, claim instant brand vouchers, and enjoy curated cardmember privileges.
          </p>

          <div className="hero-features">
            {HERO_FEATURES.map((item) => (
              <div key={item.label} className="hero-feature">
                <span className="hero-feature-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-security-stamp">
            <span className="material-icons">verified_user</span>
            <span>RBI Authorized • 256-Bit Bank-Grade Encryption</span>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div className="auth-right">
        <AuthRightGlowSvg />

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src="/iob_logo.png" alt="IOB" />
            </div>
            <div className="auth-logo-text">
              <span className="auth-logo-name">Indian Overseas Bank</span>
              <span className="auth-logo-sub">Cardmember Rewards Portal</span>
            </div>
          </div>

          {step === 'mobile' && (
            <>
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-sub">Enter your registered mobile number to view your reward balance</p>

              <div className="field-group">
                <label>Registered Mobile Number</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <MobileIcon />
                  </span>
                  <span className="input-prefix">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, ''));
                      setErrorMsg('');
                    }}
                    autoFocus
                  />
                  {MOBILE_REGEX.test(mobileNumber) && (
                    <span className="input-suffix valid">
                      <CheckCircleIcon />
                    </span>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="auth-error">
                  <AlertCircleIcon />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                className="auth-btn"
                disabled={isSendingOtp || !MOBILE_REGEX.test(mobileNumber)}
                onClick={handleSendOtp}
              >
                {isSendingOtp ? (
                  <>
                    <span className="btn-spinner" /> Generating Secure OTP…
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="back-row">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => {
                    setStep('mobile');
                    setOtp('');
                    setErrorMsg('');
                  }}
                  aria-label="Change mobile number"
                >
                  <span className="material-icons">arrow_back</span>
                </button>
                <div className="mobile-preview">
                  <div className="mobile-av">
                    <MobileIcon />
                  </div>
                  <div>
                    <p className="mobile-number-text">+91 {mobileNumber}</p>
                    <p className="mobile-sub">6-digit verification code sent</p>
                  </div>
                </div>
              </div>

              <h2 className="auth-title">Enter Verification Code</h2>
              <p className="auth-sub">Enter the 6-digit OTP sent to your registered mobile number</p>

              {/* Discrete Dev OTP auto-fill badge */}
              {devOtp && (
                <div className="dev-otp-pill" onClick={handleAutoFillOtp} title="Click to auto-fill">
                  <span className="material-icons">vpn_key</span>
                  <span>Demo Mode OTP: <strong>{devOtp}</strong> (Click to auto-fill)</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div className="field-group">
                  <label>One-Time Password (OTP)</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <OtpKeypadIcon />
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="• • • • • •"
                      className="otp-letter-spacing"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ''));
                        setErrorMsg('');
                      }}
                      autoFocus
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="auth-error">
                    <AlertCircleIcon />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <span className="btn-spinner" /> Verifying Access…
                    </>
                  ) : (
                    <>
                      <span>Verify & Access Portal</span>
                      <LoginArrowIcon />
                    </>
                  )}
                </button>
              </form>

              <div className="resend-countdown-row">
                {resendSeconds > 0 ? (
                  <span className="resend-timer-text">
                    Resend code in <strong>{resendSeconds}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="resend-link-active"
                    onClick={handleResendOtp}
                    disabled={isResending}
                  >
                    {isResending ? 'Resending code…' : 'Resend Code Now'}
                  </button>
                )}
              </div>
            </>
          )}

          <div className="auth-footer-shield">
            <ShieldCheckIcon />
            <span>Secured with Bank-Grade SSL & 256-Bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
