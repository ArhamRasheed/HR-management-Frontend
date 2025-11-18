import React from 'react';
function StatCard({ title, value, hint }) {
  return (
    <div className="flex-1 min-w-[160px] bg-white/60 dark:bg-white/6 backdrop-blur rounded-2xl p-4 shadow-md border border-white/10">
      <div className="text-sm font-semibold text-gray-700">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-600">{hint}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:8000/api/dashboard', {
          method: 'GET',
          credentials: 'include',
        });
        const json = await res.json();
        setData(normalizeBackend(json));
      } catch (e) {
        console.error('Failed to load dashboard', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function normalizeBackend(raw) {
    return {
      full_name: raw.full_name || 'Unknown',
      department: raw.department?.department_name || null,
      designation: raw.designation?.designation_name || null,
      date_of_joining: raw.date_of_joining || raw.joining_date || null,
      leaves: raw.leaves || [],
      insurances: raw.insurances || [],
      attendances: raw.attendances || [],
      complaints: raw.complaints || [],
    };
  }

  const attendancePresent = data?.attendances?.filter(a => a.status === 'Present').length || 0;
  const attendancePct = data?.attendances?.length
    ? Math.round((attendancePresent / data.attendances.length) * 100)
    : 0;

  function handleLogout() {
    alert('Logged out (placeholder)');
  }

  function handleReload(e) {
    e.preventDefault();
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-800 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-700 text-xl font-semibold">
        Failed to load dashboard
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 text-gray-900">
      <style>{`
        /* Minimal pure CSS for link underline animation and fonts */
        .brand-font { font-family: 'Cursive', 'Palatino', 'Georgia', serif; }
        .nav-link { position: relative; display: inline-block; padding: .25rem .5rem; }
        .nav-link::after { content: ''; position: absolute; left: 10%; right: 10%; bottom: 0; height: 2px; background: rgba(255,255,255,0.0); transform: scaleX(0); transform-origin: left; transition: transform .25s ease, background-color .25s ease; border-radius: 2px; }
        .nav-link:hover::after { transform: scaleX(1); background: rgba(255,255,255,0.75); }
        .nav-link:active { transform: translateY(1px); }
        .card-scroll { max-height: 240px; overflow: auto; }
        /* subtle scrollbar */
        .card-scroll::-webkit-scrollbar { width: 8px; }
        .card-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 8px; }
      `}</style>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="brand-font text-2xl font-extrabold tracking-wider cursor-pointer" onClick={handleReload}>HRMS</div>
          <div className="hidden md:flex items-center gap-3 ml-3">
            <a href="#about" className="nav-link text-md font-medium text-white">About</a>
            <a href="#contact" className="nav-link text-md font-medium text-black">Contact</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full backdrop-blur">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.486 0 4.79.64 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{data.full_name}</span>
          </div>

          <button onClick={handleLogout} className="px-3 py-1 rounded-md bg-white text-green-700 font-semibold hover:bg-white/90 shadow-sm">Logout</button>

          <button className="ml-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 hidden md:inline-flex items-center" title="user menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.486 0 4.79.64 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold brand-font text-green-900">Hello, {data.full_name.split(' ')[0]} 👋</h1>
            <p className="mt-1 text-sm text-green-800/80">Welcome to the HR dashboard. Here's a quick overview of your team and recent items.</p>
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-white border border-green-200 shadow-sm">
              <div className="text-xs text-green-700">Department</div>
              <div className="font-semibold text-green-900">{data.department || '—'}</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-white border border-green-200 shadow-sm">
              <div className="text-xs text-green-700">Designation</div>
              <div className="font-semibold text-green-900">{data.designation || '—'}</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-50 to-white border border-green-200 shadow-sm">
              <div className="text-xs text-green-700">Joined</div>
              <div className="font-semibold text-green-900">{data.date_of_joining || '—'}</div>
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Leaves" value={data.leaves.length} hint="Recent leave requests" />
          <StatCard title="Insurances" value={data.insurances.length} hint="Active insurance plans" />
          <StatCard title="Attendance" value={`${attendancePct}%`} hint={`${attendancePresent}/${data.attendances.length || 1} present`} />
          <StatCard title="Complaints" value={data.complaints.length} hint="Open & resolved" />
        </section>

        {/* TABLES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 rounded-2xl p-4 shadow border border-white/20">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Leaves</h3>
            <div className="card-scroll">
              {data.leaves.length === 0 ? (
                <div className="text-sm text-gray-600">No leave records.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-green-800/90">
                      <th className="py-2">Type</th>
                      <th className="py-2">Period</th>
                      <th className="py-2">Days</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leaves.map(l => (
                      <tr key={l.id} className="border-t border-green-100">
                        <td className="py-2 text-sm">{l.type}</td>
                        <td className="py-2 text-sm">{l.from} → {l.to}</td>
                        <td className="py-2 text-sm">{l.days}</td>
                        <td className="py-2 text-sm">{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white/70 rounded-2xl p-4 shadow border border-white/20">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Insurances</h3>
            <div className="card-scroll">
              {data.insurances.length === 0 ? (
                <div className="text-sm text-gray-600">No insurance records.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-green-800/90">
                      <th className="py-2">Provider</th>
                      <th className="py-2">Plan</th>
                      <th className="py-2">Valid Till</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.insurances.map(i => (
                      <tr key={i.id} className="border-t border-green-100">
                        <td className="py-2 text-sm">{i.provider}</td>
                        <td className="py-2 text-sm">{i.plan}</td>
                        <td className="py-2 text-sm">{i.valid_till}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white/70 rounded-2xl p-4 shadow border border-white/20">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Recent Attendances</h3>
            <div className="card-scroll">
              {data.attendances.length === 0 ? (
                <div className="text-sm text-gray-600">No attendance records.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-green-800/90">
                      <th className="py-2">Date</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">In</th>
                      <th className="py-2">Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.attendances.map((a, idx) => (
                      <tr key={idx} className="border-t border-green-100">
                        <td className="py-2 text-sm">{a.date}</td>
                        <td className="py-2 text-sm">{a.status}</td>
                        <td className="py-2 text-sm">{a.check_in || '—'}</td>
                        <td className="py-2 text-sm">{a.check_out || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white/70 rounded-2xl p-4 shadow border border-white/20">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Complaints</h3>
            <div className="card-scroll">
              {data.complaints.length === 0 ? (
                <div className="text-sm text-gray-600">No complaints.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-green-800/90">
                      <th className="py-2">Title</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Raised</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.complaints.map(c => (
                      <tr key={c.id} className="border-t border-green-100">
                        <td className="py-2 text-sm">{c.title}</td>
                        <td className="py-2 text-sm">{c.status}</td>
                        <td className="py-2 text-sm">{c.raised_on}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-8 text-sm text-green-700/80">Copyrights: HRMS</footer>
      </main>
    </div>
  );
}
