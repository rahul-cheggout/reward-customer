import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import {
  BANK_NAME,
  IOB_DEFAULT_LOGO,
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
  { label: 'Credit Card Points Balance', icon: <FeatureCardIcon /> },
  { label: 'Works Across Multiple Banks', icon: <FeatureBankIcon /> },
  { label: 'Gift Cards, D2C & Hot Deals', icon: <FeatureGiftIcon /> },
  { label: 'Instant Mobile OTP Login', icon: <FeatureFlashIcon /> }
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

  const handleSendOtp = async () => {
    if (!MOBILE_REGEX.test(mobileNumber)) {
      setErrorMsg('Enter a valid 10-digit mobile number');
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg('');
    try {
      const res = await sendOtp(mobileNumber);
      setDevOtp(res.devOtp || null);
      setStep('otp');
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Could not send OTP. Please try again.';
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
      const errMsg = err?.response?.data?.error || 'Verification failed. Please try again.';
      setErrorMsg(errMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMsg('');
    try {
      const res = await sendOtp(mobileNumber);
      setDevOtp(res.devOtp || null);
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Could not resend OTP.';
      setErrorMsg(errMsg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <HeroDecorativeSvg />
        <FloatingChips />

        <div className="auth-hero">
          <div className="hero-icon">
            <img src={bank.logoUrl || IOB_DEFAULT_LOGO} alt="IOB" />
          </div>
          <h1>Turn your points into rewards.</h1>
          <p>
            Your credit card rewards portal — check your points balance across every card, redeem gift cards, shop D2C brands and grab hot deals.
          </p>

          <div className="hero-features">
            {HERO_FEATURES.map((item) => (
              <div key={item.label} className="hero-feature">
                <span className="hero-feature-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <AuthRightGlowSvg />

        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <img src={bank.logoUrl || IOB_DEFAULT_LOGO} alt="IOB" />
            </div>
            <div className="auth-logo-text">
              <span className="auth-logo-name">{bank.name || 'IOB Credit Card Rewards'}</span>
              <span className="auth-logo-sub">Your credit card rewards portal</span>
            </div>
          </div>

          {step === 'mobile' && (
            <>
              <h2 className="auth-title">Welcome</h2>
              <p className="auth-sub">Enter your registered mobile number to view your points</p>

              <div className="field-group">
                <label>Mobile number</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <MobileIcon />
                  </span>
                  <span className="input-prefix">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
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
                  {errorMsg}
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
                    <span className="btn-spinner" /> Sending OTP…
                  </>
                ) : (
                  <>
                    <ArrowRightIcon /> Send OTP
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
                    <p className="mobile-sub">Enter the OTP sent to this number</p>
                  </div>
                </div>
              </div>

              <h2 className="auth-title">Verify OTP</h2>
              <p className="auth-sub">We've sent a 6-digit code to your mobile number</p>

              {devOtp && (
                <div className="dev-otp-hint">
                  <ShieldCheckIcon /> Dev mode — your OTP is <strong>&nbsp;{devOtp}</strong>
                </div>
              )}

              <form onSubmit={handleVerifyOtp}>
                <div className="field-group">
                  <label>OTP</label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <OtpKeypadIcon />
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
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
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? (
                    <>
                      <span className="btn-spinner" /> Verifying…
                    </>
                  ) : (
                    <>
                      <LoginArrowIcon /> Verify & Continue
                    </>
                  )}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendOtp}
                  disabled={isResending}
                >
                  {isResending ? 'Resending…' : 'Resend OTP'}
                </button>
              </p>
            </>
          )}

          <p className="auth-footer">
            <ShieldCheckIcon /> Secured by Cheggout
          </p>
        </div>
      </div>
    </div>
  );
}
