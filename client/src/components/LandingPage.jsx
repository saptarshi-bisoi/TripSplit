import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Refs for animation targets
  const heroRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCTARef = useRef(null);
  const avatar1Ref = useRef(null);
  const avatar2Ref = useRef(null);
  const avatar3Ref = useRef(null);
  const avatar4Ref = useRef(null);
  const partnerRef = useRef(null);
  const featuresTitleRef = useRef(null);
  const featureCardsRef = useRef([]);
  const testimonialRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // ─── Lenis Smooth Scroll ───────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Hook GSAP ticker into Lenis so ScrollTrigger stays in sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ─── Hero Entrance (staggered fade-up on load) ─────────────────────────────
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .fromTo(heroBadgeRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(heroTitleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
      .fromTo(heroSubRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo(heroCTARef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

    // ─── Avatar Float-in (staggered) ─────────────────────────────────────────
    const avatars = [avatar1Ref, avatar2Ref, avatar3Ref, avatar4Ref];
    avatars.forEach((ref, i) => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.4 + i * 0.15,
          ease: 'back.out(1.7)',
        }
      );
    });

    // ─── Subtle parallax on avatars while scrolling ───────────────────────────
    gsap.to(avatar1Ref.current, {
      y: -60,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(avatar2Ref.current, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(avatar3Ref.current, {
      y: -80,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(avatar4Ref.current, {
      y: -50,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    // ─── Partner Bar: slide up on scroll ─────────────────────────────────────
    if (partnerRef.current) {
      gsap.fromTo(
        partnerRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: partnerRef.current, start: 'top 85%' },
        }
      );
    }

    // ─── Features Heading: fade-up ────────────────────────────────────────────
    if (featuresTitleRef.current) {
      gsap.fromTo(
        featuresTitleRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: featuresTitleRef.current, start: 'top 80%' },
        }
      );
    }

    // ─── Feature Cards: alternating slide-in ─────────────────────────────────
    featureCardsRef.current.forEach((el, i) => {
      if (!el) return;
      const fromX = i % 2 === 0 ? -60 : 60;
      gsap.fromTo(
        el,
        { opacity: 0, x: fromX, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        }
      );
    });

    // ─── Testimonial: fade in from bottom ────────────────────────────────────
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: testimonialRef.current, start: 'top 80%' },
        }
      );
    }

    // ─── Stats: pop in with stagger ───────────────────────────────────────────
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Helper to push into featureCardsRef array
  const setFeatureCard = (el, i) => {
    featureCardsRef.current[i] = el;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden relative">

      {/* ── Background Grid: full coverage, no fade ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* ── NAV ── */}
      <nav className="w-full bg-[#FAFAFA]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center border-b border-gray-100">
        <Link to="/" className="text-2xl font-extrabold tracking-tight z-50">
          <i className="fa-solid fa-scale-balanced text-[#00786f] mr-2" />
          <span className="text-slate-900">Trip</span><span className="text-[#00786f]">Split</span>
        </Link>
        <div className="space-x-4 flex items-center z-50">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-slate-900 font-semibold hover:text-[#00786f] transition">Dashboard</Link>
              <button onClick={handleLogout} className="text-slate-500 font-semibold py-2 px-4 hover:text-rose-600 transition">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 font-semibold hover:text-[#00786f] transition hidden sm:inline-block">Log in</Link>
              <Link to="/signup" className="bg-[#00786f] text-white font-bold py-2.5 px-6 rounded-full shadow-md hover:bg-[#005c55] hover:-translate-y-0.5 transition transform text-sm">Start Now</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full relative z-10">

        {/* ══════════════════════════════════════════ HERO */}
        <section
          ref={heroRef}
          className="relative w-full max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center overflow-visible"
        >
          {/* Avatars — pinned to far edges, parallax on scroll */}
          <div ref={avatar1Ref} className="hidden lg:block absolute" style={{ top: '10%', left: '-3rem' }}>
            <div className="relative">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Annie" alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-purple-100" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-location-arrow -rotate-45 text-xs" />
              </div>
            </div>
          </div>

          <div ref={avatar2Ref} className="hidden lg:block absolute" style={{ top: '5%', right: '-3rem' }}>
            <div className="relative">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jack" alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-orange-100" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-location-arrow rotate-180 text-xs text-[#00786f]" />
              </div>
            </div>
          </div>

          <div ref={avatar3Ref} className="hidden lg:block absolute" style={{ bottom: '12%', left: '-2.5rem' }}>
            <div className="relative">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Maria" alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-blue-100" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-location-arrow rotate-45 text-xs text-[#00786f]" />
              </div>
            </div>
          </div>

          <div ref={avatar4Ref} className="hidden lg:block absolute" style={{ bottom: '18%', right: '-2.5rem' }}>
            <div className="relative">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=George" alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-yellow-100" />
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg">
                <i className="fa-solid fa-location-arrow -rotate-135 text-xs" />
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div ref={heroBadgeRef} className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 mb-8">
            <i className="fa-solid fa-bolt text-[#00786f]" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600">Created For Fast Settlements</span>
          </div>

          <h1
            ref={heroTitleRef}
            className="text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-slate-900 mb-8 leading-[1.1] max-w-4xl tracking-tight"
          >
            One tool to{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-slate-900">manage</span>
              <span
                className="absolute left-0 right-0 h-[10px] rounded-full"
                style={{ backgroundColor: '#c8f135', bottom: '-2px', zIndex: 0 }}
              />
            </span>
            {' '}<br />expenses and your group
          </h1>

          <p ref={heroSubRef} className="text-lg md:text-xl text-slate-500 max-w-3xl mb-12 leading-relaxed">
            TripSplit helps friend groups work faster, smarter, and more efficiently, delivering exact settlement calculations to mitigate arguments and ensure financial clarity.
          </p>

          <div ref={heroCTARef} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to={isLoggedIn ? '/dashboard' : '/signup'}
              className="bg-[#00786f] text-white text-lg font-bold py-4 px-10 rounded-xl shadow-[0_8px_30px_rgba(0,120,111,0.3)] hover:bg-[#005c55] hover:-translate-y-1 transition transform duration-300"
            >
              {isLoggedIn ? 'Access Workspace' : 'Start for Free'}
            </Link>
            <Link
              to={isLoggedIn ? '/dashboard' : '/login'}
              className="bg-white text-slate-700 text-lg font-bold py-4 px-10 rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 hover:-translate-y-1 transition transform duration-300"
            >
              Get a Demo
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════ PARTNERS */}
        <section className="w-full border-y border-gray-200 bg-white/50 backdrop-blur-sm py-10 mt-10">
          <div ref={partnerRef} className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm font-bold text-slate-800 uppercase tracking-widest max-w-[200px] mb-6 md:mb-0">
              Perfect for tracking expenses across
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-2xl text-slate-700">
              <span className="flex items-center space-x-2 font-bold"><i className="fa-solid fa-plane-departure text-[#00786f]" /> <span>Vacations</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-solid fa-house-user text-indigo-500" /> <span>Roommates</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-solid fa-pizza-slice text-orange-500" /> <span>Dinners</span></span>
              <span className="flex items-center space-x-2 font-bold"><i className="fa-solid fa-car text-rose-500" /> <span>Roadtrips</span></span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════ FEATURES */}
        <section className="w-full max-w-6xl mx-auto px-6 py-32">
          <div ref={featuresTitleRef} className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-50 text-[#00786f] rounded border border-teal-100 mb-6 uppercase text-xs font-bold tracking-widest">
              <i className="fa-solid fa-border-all" /> <span>Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight max-w-3xl mx-auto">
              Everything you need to stop arguing over money
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Say goodbye to complex spreadsheets and awkward IOUs. Track shared expenses easily so everyone gets paid back.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Card 1 — wide */}
            <div
              ref={(el) => setFeatureCard(el, 0)}
              className="lg:col-span-2 bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row justify-between relative overflow-hidden transition hover:shadow-xl hover:border-teal-200"
            >
              <div className="max-w-xs z-10">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Visual trip breakdowns</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Instantly see where your group's money went. Our simple dashboard breaks down exactly who paid for what, so there's never any confusion.
                </p>
                <button className="bg-[#00786f] text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-[#005c55] transition">Explore all</button>
              </div>
              <div className="mt-10 md:mt-0 flex-1 md:ml-10 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 z-10 h-72 hidden sm:flex flex-col opacity-90 transform translate-x-4 md:translate-x-12 translate-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <span className="font-bold text-slate-700 flex items-center space-x-2"><span>Lake Tahoe</span> <i className="fa-solid fa-chevron-down text-xs" /></span>
                  <div className="flex -space-x-2">
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=A" className="w-8 h-8 rounded-full border-2 border-white bg-red-100" alt="1" />
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=B" className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" alt="2" />
                    <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=C" className="w-8 h-8 rounded-full border-2 border-white bg-green-100" alt="3" />
                  </div>
                </div>
                <div className="flex-1 flex items-end justify-between space-x-2 pt-4">
                  {[3, 6, 4, 10, 5, 8, 3, 4, 7, 2].map((h, i) => (
                    <div key={i} className={`w-full rounded-t-sm ${h === 10 ? 'bg-[#00786f]' : 'bg-gray-200'}`} style={{ height: `${h * 10}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              ref={(el) => setFeatureCard(el, 1)}
              className="bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 flex flex-col relative overflow-hidden transition hover:shadow-xl hover:border-teal-200"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Gentle reminders</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                No more awkward texts asking for money. We send gentle email reminders so everyone pays up on time.
              </p>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col divide-y divide-gray-100">
                <div className="p-4 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-800">Email notification</span>
                  <span className="text-xs font-bold text-[#00786f] cursor-pointer">Save</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-slate-600">New expenses added</span>
                  <div className="w-10 h-5 bg-[#00786f] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-slate-600">Settlement reminders</span>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-sm text-slate-600 opacity-50">Announcements</span>
                  <div className="w-10 h-5 bg-[#00786f] rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                ref={(el) => setFeatureCard(el, 2)}
                className="lg:col-span-1 border border-gray-200 bg-white rounded-3xl p-8 flex flex-col justify-center text-center"
              >
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Keep track together</h3>
                <p className="text-slate-500 leading-relaxed">
                  Upload receipts, add quick notes, and keep all your group's spending history organized in one centralized feed.
                </p>
              </div>

              <div
                ref={(el) => setFeatureCard(el, 3)}
                className="lg:col-span-2 bg-[#f8fafc] border border-gray-200 rounded-3xl p-8 md:p-12 flex relative overflow-hidden transition hover:shadow-xl hover:border-teal-200"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.05)] transform sm:-rotate-2 transition hover:rotate-0 flex-col flex gap-4 z-10">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="font-bold text-slate-900">Recent Activity</span>
                    <span className="text-[#00786f] font-bold text-sm cursor-pointer">+ Log new</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Bill" className="w-10 h-10 rounded-full bg-blue-50" alt="Bill" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-800">Bill Sanders</span>
                          <span className="text-xs text-gray-400">10h</span>
                        </div>
                        <p className="text-xs text-slate-500 bg-gray-50 p-2 rounded-lg inline-block border border-gray-100">Just added ₹1200 for Hotel deposit! 🏨</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Jane" className="w-10 h-10 rounded-full bg-orange-50" alt="Jane" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-slate-800">Jane Cooper</span>
                          <span className="text-xs text-gray-400">1d</span>
                        </div>
                        <p className="text-xs text-slate-500 bg-gray-50 p-2 rounded-lg flex items-center gap-2 border border-gray-100"><i className="fa-solid fa-file-pdf text-rose-500" /> Uploaded flight_receipts.pdf</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-300 opacity-20 rounded-full blur-3xl z-0" />
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════ TESTIMONIAL */}
        <section className="w-full bg-[#00786f] text-white py-32 px-6 rounded-t-[3rem] mt-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

          <div ref={testimonialRef} className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
            <i className="fa-solid fa-quote-left text-5xl text-teal-300 mb-8 opacity-80" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mb-12 max-w-4xl tracking-tight text-white">
              "TripSplit is helping our group radically decrease arguments and turnaround time, while actively increasing the transparency and effectiveness of our shared expenses."
            </h2>

            <div className="flex flex-col items-center mb-24">
              <div className="flex -space-x-3 mb-4">
                <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Darlene" className="w-12 h-12 rounded-full border-2 border-[#00786f] bg-yellow-400 relative z-10" alt="Darlene" />
                <div className="w-12 h-12 rounded-full border-2 border-[#00786f] bg-[#ccfbf1] flex items-center justify-center text-[#00786f] font-bold text-xl relative z-0"><i className="fa-solid fa-check" /></div>
              </div>
              <span className="font-bold text-lg">Darlene Robertson</span>
              <span className="text-teal-200 font-semibold text-sm uppercase tracking-widest mt-1">Head Organizer at Roomies</span>
            </div>

            {/* Stats */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <div ref={(el) => (statsRef.current[0] = el)} className="flex flex-col items-center justify-center transition hover:-translate-y-1">
                <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">2026</span>
                <span className="text-lg text-teal-100 font-semibold">TripSplit Founded</span>
              </div>
              <div ref={(el) => (statsRef.current[1] = el)} className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-10 md:pt-0 transition hover:-translate-y-1">
                <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">50+</span>
                <span className="text-lg text-teal-100 font-semibold">Active Users</span>
              </div>
              <div ref={(el) => (statsRef.current[2] = el)} className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-10 md:pt-0 transition hover:-translate-y-1">
                <span className="text-6xl font-extrabold mb-2 text-[#ccfbf1]">800+</span>
                <span className="text-lg text-teal-100 font-semibold">Expenses Logged</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
