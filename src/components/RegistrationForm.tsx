'use client';

import { useState, useEffect } from 'react';

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'creator' | 'affiliate' | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredData, setRegisteredData] = useState<{ handle: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const savedHandle = localStorage.getItem('arovaq_handle');
    const savedEmail = localStorage.getItem('arovaq_email');
    const savedRole = localStorage.getItem('arovaq_role');
    if (savedHandle) {
      setRegisteredData({ handle: savedHandle, email: savedEmail || '', role: savedRole || 'affiliate' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError('Please select how you want to join ArovaQ (Creator or Affiliate).');
      return;
    }
    if (!termsAccepted) {
      setError(`You must agree to the ${role === 'creator' ? 'Creator' : 'Affiliate'} Terms & Conditions before joining.`);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, handle, email, role, termsAccepted }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      localStorage.setItem('arovaq_handle', handle);
      localStorage.setItem('arovaq_email', email);
      localStorage.setItem('arovaq_role', role);
      
      setRegisteredData({ handle, email, role });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (registeredData) {
    const userLink = `https://arovaq.store/${registeredData.handle}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(userLink)}`;

    return (
      <div className="bg-slate-900/90 border border-emerald-500/40 p-6 rounded-xl text-center space-y-4">
        <h3 className="text-lg font-bold text-emerald-400">Welcome to ArovaQ! 🎉</h3>
        <p className="text-xs text-slate-300">
          Session active for <strong className="text-white">{registeredData.handle}</strong> 
          <span className="block mt-1 text-emerald-400 font-semibold uppercase text-[10px] tracking-wider">
            🔥 Genesis {registeredData.role === 'creator' ? 'Creator' : 'Affiliate'} Pioneer
          </span>
        </p>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
          <p className="text-xs text-slate-400">Your Unique {registeredData.role === 'creator' ? 'Store' : 'Referral'} Link:</p>
          <div className="bg-slate-900 p-2 rounded text-emerald-400 text-xs font-mono break-all border border-emerald-500/20">
            {userLink}
          </div>

          <div className="flex justify-center pt-2">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img src={qrCodeUrl} alt="Store QR Code" width={150} height={150} className="mx-auto" />
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('arovaq_handle');
              setRegisteredData(null);
            }}
            className="text-[10px] text-red-400 hover:underline pt-2 block mx-auto"
          >
            Switch Account / Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
      <h3 className="text-lg font-semibold text-emerald-400">Join ArovaQ Store</h3>
      
      {error && <div className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-900">{error}</div>}

      {/* Role Selection Toggle */}
      <div className="space-y-2 pb-2">
        <label className="block text-xs text-slate-400 mb-1">Choose Your Path</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('affiliate')}
            className={`p-3 rounded-lg border text-sm text-left transition-all ${
              role === 'affiliate' 
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400' 
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="font-bold">Affiliate 🤝</div>
            <div className="text-[10px] mt-1 opacity-80">Promote & earn revenue splits.</div>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`p-3 rounded-lg border text-sm text-left transition-all ${
              role === 'creator' 
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400' 
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="font-bold">Creator 🎨</div>
            <div className="text-[10px] mt-1 opacity-80">List products & grow your store.</div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Full Name</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Lawrence Kimani"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Handle / Username</label>
        <input
          type="text"
          required
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@handle"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
        />
      </div>

      {role && (
        <div className="flex items-start space-x-2 pt-2 border-t border-slate-800">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none">
            I agree to the <span className="text-emerald-400 underline">{role === 'creator' ? 'Creator' : 'Affiliate'} Terms & Conditions</span> and platform commission splits.
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !role}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Setting up your vault...' : 'Complete Registration'}
      </button>
    </form>
  );
}