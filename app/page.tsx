'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

// LED digit patterns (5 columns x 7 rows)
const DIGIT_PATTERNS: Record<string, number[][]> = {
  '0': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [1,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  '2': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  '3': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  '4': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  '6': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  '8': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
  ],
  '9': [
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
  ],
  ':': [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
  ],
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function LEDDigit({ pattern, lit, unlit }: { pattern: number[][]; lit: string; unlit: string }) {
  return (
    <div className="grid gap-[2px] md:gap-[3px]">
      {pattern.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[2px] md:gap-[3px]">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="w-[6px] h-[6px] md:w-[10px] md:h-[10px] lg:w-[12px] lg:h-[12px] rounded-sm transition-colors duration-150"
              style={{ backgroundColor: cell ? lit : unlit }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function LEDDisplay({ value, lit, unlit }: { value: string; lit: string; unlit: string }) {
  return (
    <div className="flex gap-3 md:gap-5 lg:gap-6">
      {value.split('').map((char, index) => (
        <LEDDigit
          key={index}
          pattern={DIGIT_PATTERNS[char] || DIGIT_PATTERNS['0']}
          lit={lit}
          unlit={unlit}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message || 'Thank you for joining! See you on Dec 15.');
        setIsSubmitted(true);
        setEmail('');
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft => {
      const targetDate = new Date('2025-12-25T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted || !timeLeft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
      </div>
    );
  }

  // Format time as DD:HH:MM:SS
  const timeString = `${String(timeLeft.days).padStart(2, '0')}:${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className="relative flex h-screen flex-col items-center bg-black overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 from-black via-transparent to-purple-900/10 pointer-events-none" />

      {/* Social Links - Top Right */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <a
          href="https://x.com/tryprovenn
          "
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Follow us on X"
        >
          <XIcon />
        </a>

        {/* telegram link */}
        {/* <a
          href="https://t.me/tryproven"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Join us on Telegram"
        >
          <TelegramIcon />
        </a> */}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8 pb-0 px-6 w-full max-w-5xl">

        {/* LED Countdown Display */}
        <div className="animate-fade-in-up-delay-3 bg-black/40 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl  backdrop-blur-sm">
          <LEDDisplay
            value={timeString}
            lit="#ffffff"
            unlit="#333333"
          />
          {/* Labels */}
          <div className="flex justify-between mt-4 px-1">
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider" style={{ fontFamily: 'system-ui, sans-serif' }}>Days</span>
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider" style={{ fontFamily: 'system-ui, sans-serif' }}>Hours</span>
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider" style={{ fontFamily: 'system-ui, sans-serif' }}>Min</span>
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider" style={{ fontFamily: 'system-ui, sans-serif' }}>Sec</span>
          </div>
        </div>

        {/* Early Access Message */}
        <div className="animate-fade-in-up-delay-3 text-center mb-5">
          <p className="text-white/70 text-sm md:text-base" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Early access on <span className="text-white font-semibold">Dec 15</span> for waitlist
          </p>
        </div>

        {/* Waitlist Form - LED Style */}
        <div className="animate-fade-in-up-delay-3 w-full max-w-xl">
          {!isSubmitted ? (
            <div className=" rounded-2xl p-2 md:p-3">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3.5 rounded-xl bg-[#1a1a1a] text-white placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#333] transition-all duration-300 text-sm"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5757] via-[#FF6056] to-[#FF7E50] text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    'Get Early Access'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#111] rounded-2xl p-6 text-center">
              <p className="text-white font-medium flex items-center justify-center gap-2 text-sm whitespace-pre-line" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {responseMessage || 'Thank you for joining! See you on Dec 15.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* iPhone Mockup with App Screenshot */}
      <div className="animate-float-up relative w-full flex justify-center items-end flex-1 -mt-4">
        <div className="relative w-full max-w-[520px] md:max-w-[520px] lg:max-w-[650px] h-full flex items-end">
          {/* Phone Shadow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-[#923534]/5 to-[#923534]/20 blur-3xl rounded-full" />
          
          {/* Mockup Image */}
          <div className="relative w-full h-full flex items-end justify-center">
            <Image
              src="/mockup-2.png"
              width={1100}
              height={1000}
              alt="Proven App Interface"
              className="w-full h-auto max-h-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
