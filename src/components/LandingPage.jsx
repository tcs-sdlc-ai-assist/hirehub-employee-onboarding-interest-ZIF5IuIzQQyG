import React from 'react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="8" fill="#2d6cdf" />
        <path d="M18 10a1 1 0 0 1 1 1v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7h-7a1 1 0 1 1 0-2h7v-7a1 1 0 0 1 1-1z" fill="#fff"/>
      </svg>
    ),
    title: 'Innovation',
    desc: 'Work with cutting-edge technology and help shape the future of hiring.'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="8" fill="#f7b801" />
        <path d="M18 10c-4.418 0-8 3.134-8 7 0 2.99 2.613 5.48 6.222 6.687l.778.263V26a1 1 0 1 0 2 0v-2.05l.778-.263C23.387 22.48 26 19.99 26 17c0-3.866-3.582-7-8-7zm0 2c3.314 0 6 2.239 6 5 0 1.786-1.617 3.7-4.5 4.627V22a1 1 0 1 1-2 0v-0.373C13.617 20.7 12 18.786 12 17c0-2.761 2.686-5 6-5z" fill="#fff"/>
      </svg>
    ),
    title: 'Career Growth',
    desc: 'Accelerate your professional journey with mentorship and learning opportunities.'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="8" fill="#e4572e" />
        <path d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-7 11.5c0-2.485 4.03-3.5 7-3.5s7 1.015 7 3.5V26a1 1 0 1 1-2 0v-0.5c0-0.276-1.69-1.5-5-1.5s-5 1.224-5 1.5V26a1 1 0 1 1-2 0v-0.5z" fill="#fff"/>
      </svg>
    ),
    title: 'Great Culture',
    desc: 'Join a diverse, inclusive, and collaborative team that values your voice.'
  },
  {
    icon: (
      <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
        <rect width="36" height="36" rx="8" fill="#22c55e" />
        <path d="M18 10c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8c0-1.657.672-3.157 1.757-4.243A1 1 0 0 1 13.172 15.1 6 6 0 1 0 18 12a1 1 0 1 1 0-2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" fill="#fff"/>
      </svg>
    ),
    title: 'Global Impact',
    desc: 'Be part of a platform that transforms hiring for companies and candidates worldwide.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  function handleApplyClick(e) {
    e.preventDefault();
    navigate('/apply');
  }

  return (
    <main className="landing" style={{ padding: 0, minHeight: '100vh', background: 'var(--color-bg)' }}>
      <section style={{
        width: '100%',
        background: 'var(--color-bg-light)',
        padding: '3rem 1rem 2rem 1rem',
        boxShadow: 'var(--shadow)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h1 className="landing-title" style={{ marginBottom: 12 }}>
            Welcome to HireHub Onboarding Portal
          </h1>
          <p className="landing-subtitle" style={{ marginBottom: 28, maxWidth: 540 }}>
            Seamlessly apply to join our team and unlock new career opportunities. Discover why HireHub is the best place to grow, innovate, and make a difference.
          </p>
          <button
            className="button"
            style={{ fontSize: '1.15rem', padding: '1rem 2.5rem', marginBottom: 0, marginTop: 8 }}
            onClick={handleApplyClick}
          >
            Apply Now
          </button>
        </div>
      </section>
      <section style={{
        width: '100%',
        background: 'var(--color-bg)',
        padding: '2.5rem 1rem 2.5rem 1rem'
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}>
          {FEATURES.map((f, idx) => (
            <div
              key={f.title}
              style={{
                background: 'var(--color-bg-light)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow)',
                padding: '2rem 1.25rem 1.5rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 260
              }}
            >
              <div style={{ marginBottom: 18 }}>{f.icon}</div>
              <div style={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--color-primary)',
                marginBottom: 10,
                textAlign: 'center'
              }}>{f.title}</div>
              <div style={{
                color: 'var(--color-text-light)',
                fontSize: '1.05rem',
                textAlign: 'center',
                lineHeight: 1.5
              }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{
        width: '100%',
        background: 'var(--color-primary)',
        color: '#fff',
        padding: '2.5rem 1rem 2.5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: 700,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: '-0.5px'
          }}>
            Ready to take the next step?
          </h2>
          <p style={{
            fontSize: '1.15rem',
            marginBottom: 24,
            color: 'rgba(255,255,255,0.92)'
          }}>
            Apply now and start your journey with HireHub. We can’t wait to see what you’ll achieve!
          </p>
          <button
            className="button secondary"
            style={{
              background: 'var(--color-bg-light)',
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '1.1rem',
              padding: '0.9rem 2.2rem'
            }}
            onClick={handleApplyClick}
          >
            Apply for Onboarding
          </button>
        </div>
      </section>
    </main>
  );
}