import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-6">Praise Impact</h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
          The all-in-one digital platform for modern ministries. Manage your sermons, 
          broadcast live streams, and engage with your congregation instantly.
        </p>
        <div className="flex gap-6 justify-center">
          <Link 
            href="/login" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
