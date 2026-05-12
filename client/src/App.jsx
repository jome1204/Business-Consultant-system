import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  FileText,
  Landmark,
  Languages,
  LineChart,
  Loader2,
  LogOut,
  MessageSquareText,
  PiggyBank,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  WalletCards
} from 'lucide-react';
import { api, clearSession, getStoredUser, setSession } from './api.js';

const tabs = [
  { id: 'overview', label: 'Overview', icon: ChartNoAxesCombined },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'savings', label: 'Savings', icon: Target },
  { id: 'investments', label: 'Investments', icon: LineChart },
  { id: 'business', label: 'Business', icon: BriefcaseBusiness, roles: ['SME_CUSTOMER', 'ADMIN'] },
  { id: 'consultations', label: 'Consultations', icon: CalendarClock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, roles: ['ADMIN'] }
];

export function App() {
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  const visibleTabs = tabs.filter((tab) => !tab.roles || tab.roles.includes(user.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">D</span>
          <div>
            <strong>Dashen AI</strong>
            <small>Business Consultant</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          className="logout-button"
          onClick={() => {
            clearSession();
            setUser(null);
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-powered advisory platform</p>
            <h1>{pageTitle(activeTab, user)}</h1>
          </div>
          <div className="profile-chip">
            <UserRound size={18} />
            <span>{user.fullName}</span>
          </div>
        </header>

        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'assistant' && <Assistant />}
        {activeTab === 'savings' && <Savings />}
        {activeTab === 'investments' && <Investments />}
        {activeTab === 'business' && <BusinessInsights />}
        {activeTab === 'consultations' && <Consultations />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'settings' && <SettingsPanel user={user} onUserChange={setUser} />}
        {activeTab === 'admin' && <Admin />}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('yohannes@dashen.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const session = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setSession(session);
      onLogin(session.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-copy">
        <span className="brand-mark large">D</span>
        <p className="eyebrow">Dashen Bank intelligent advisory</p>
        <h1>Financial guidance, business insight, and advisor access in one platform.</h1>
        <div className="trust-row">
          <span><ShieldCheck size={16} /> Secure advisory</span>
          <span><Sparkles size={16} /> AI insights</span>
          <span><BriefcaseBusiness size={16} /> SME ready</span>
        </div>
      </section>

      <form className="login-panel" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={loading}>
          {loading ? <><Loader2 size={16} className="spin" /> Signing in</> : 'Login'}
        </button>
        <p className="demo-users">Try yohannes@dashen.ai, sme@dashen.ai, advisor@dashen.ai, or admin@dashen.ai with password123.</p>
      </form>
    </main>
  );
}

function Overview({ user }) {
  const { data, loading, reload } = useApiData('/dashboard/overview');

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="content-grid">
      <section className="metric-strip">
        <Metric label="Total Balance" value={`${formatMoney(data.balance)} ETB`} icon={PiggyBank} />
        <Metric label="Financial Score" value={`${data.financialScore}/100`} icon={CheckCircle2} />
        <Metric label="Savings Rate" value={`${data.savingsRate}%`} icon={ChartNoAxesCombined} />
        <Metric label="Unread Alerts" value={data.unreadNotifications} icon={Bell} />
      </section>

      <section className="panel wide">
        <div className="section-title">
          <h2>AI Recommendations</h2>
          <button className="ghost-button" onClick={async () => {
            await api('/recommendations/generate', { method: 'POST' });
            reload();
          }}>
            <Sparkles size={16} /> Generate
          </button>
        </div>
        <div className="recommendation-list">
          {data.recommendations.map((item) => (
            <article key={item.id} className="recommendation">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <div className="tag-row">
                <span>{item.type}</span>
                <span>{item.confidenceScore}% confidence</span>
                <span>{item.priority}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Accounts</h2>
          <span>{user.kycStatus}</span>
        </div>
        <div className="stack-list">
          {data.accounts.map((account) => (
            <article className="compact-item" key={account.id}>
              <strong>{account.name}</strong>
              <span>{account.type}</span>
              <b>{formatMoney(account.balance)} {account.currency}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Spending Breakdown</h2>
        </div>
        {data.spendingByCategory.map((item) => (
          <ProgressRow key={item.category} label={item.category} value={item.amount} max={Math.max(data.spending, 1)} />
        ))}
      </section>

      <section className="panel wide">
        <div className="section-title">
          <h2>Goals and Portfolio</h2>
          <span>{user.riskAppetite || 'Balanced'} profile</span>
        </div>
        <div className="dual-grid">
          {data.savingsGoals.slice(0, 2).map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
          {data.investments.slice(0, 2).map((investment) => (
            <article className="compact-item accent" key={investment.id}>
              <strong>{investment.productName}</strong>
              <span>{investment.category} - {investment.riskLevel} risk</span>
              <b>{formatMoney(investment.amount)} ETB at {investment.returnRate}%</b>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Assistant() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;
    const current = message;
    setMessage('');
    setLoading(true);

    try {
      const response = await api('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: current })
      });
      setChat((items) => [...items, { message: current, reply: response.reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel assistant-panel">
      <div className="section-title">
        <h2>AI Financial Assistant</h2>
        <span>Multilingual-ready advisory workflow</span>
      </div>
      <div className="chat-window">
        {chat.length === 0 && (
          <div className="assistant-empty">
            <p className="empty-chat">Write your own question below.</p>
            <div className="suggestion-row">
              {[
                'How can I save more money?',
                'How should I separate my money?',
                'What investment risk is right for me?'
              ].map((suggestion) => (
                <button type="button" className="ghost-button" key={suggestion} onClick={() => setMessage(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {chat.map((item, index) => (
          <div className="chat-pair" key={`${item.message}-${index}`}>
            <p className="bubble user"><MessageSquareText size={16} /> {item.message}</p>
            <p className="bubble ai"><Bot size={16} /> {item.reply}</p>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          placeholder="Type your financial or business question..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="primary-button" disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Send
        </button>
      </form>
    </section>
  );
}

function Savings() {
  const { data, loading, reload } = useApiData('/financial/savings-goals', { savingsGoals: [] });
  const [name, setName] = useState('Education fund');
  const [targetAmount, setTargetAmount] = useState('150000');

  async function createGoal(event) {
    event.preventDefault();
    await api('/financial/savings-goals', {
      method: 'POST',
      body: JSON.stringify({ name, targetAmount: Number(targetAmount), monthlyContribution: 5000 })
    });
    setName('');
    setTargetAmount('');
    reload();
  }

  if (loading) return <p className="loading">Loading savings goals...</p>;

  return (
    <div className="content-grid">
      <section className="panel wide">
        <div className="section-title">
          <h2>Savings Goals</h2>
          <span>Goal tracking and AI contribution planning</span>
        </div>
        <form className="inline-form" onSubmit={createGoal}>
          <input aria-label="Goal name" value={name} onChange={(event) => setName(event.target.value)} />
          <input aria-label="Target amount" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} />
          <button className="primary-button">Create Goal</button>
        </form>
      </section>
      {data.savingsGoals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}

function Investments() {
  const { data, loading } = useApiData('/financial/investments', { investments: [], summary: {} });

  if (loading) return <p className="loading">Loading investments...</p>;

  return (
    <div className="content-grid">
      <section className="metric-strip">
        <Metric label="Invested" value={`${formatMoney(data.summary.totalInvested || 0)} ETB`} icon={WalletCards} />
        <Metric label="Weighted Return" value={`${data.summary.weightedReturn || 0}%`} icon={LineChart} />
        <Metric label="Products" value={data.summary.products || 0} icon={Landmark} />
        <Metric label="Risk Review" value="Active" icon={ShieldCheck} />
      </section>
      <section className="panel wide">
        <div className="section-title">
          <h2>Portfolio</h2>
          <span>Advisor-reviewed investment options</span>
        </div>
        <div className="dual-grid">
          {data.investments.map((investment) => (
            <article className="compact-item accent" key={investment.id}>
              <strong>{investment.productName}</strong>
              <span>{investment.category} - {investment.riskLevel} risk</span>
              <b>{formatMoney(investment.amount)} ETB at {investment.returnRate}% expected return</b>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BusinessInsights() {
  const { data, loading } = useApiData('/business/overview');

  if (loading) return <p className="loading">Loading business insights...</p>;

  return (
    <div className="content-grid">
      <section className="metric-strip">
        <Metric label="Revenue" value={`${formatMoney(data.revenue)} ETB`} icon={BriefcaseBusiness} />
        <Metric label="Expenses" value={`${formatMoney(data.expenses)} ETB`} icon={WalletCards} />
        <Metric label="Net Cash Flow" value={`${formatMoney(data.netCashFlow)} ETB`} icon={LineChart} />
        <Metric label="Cash Flow Risk" value={data.cashFlowRisk} icon={ShieldCheck} />
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Cash Flow Trend</h2>
        </div>
        {data.trend.map((item) => (
          <ProgressRow key={item.month} label={item.month} value={item.revenue - item.expenses} max={160000} />
        ))}
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>AI Business Guidance</h2>
        </div>
        <div className="stack-list">
          {data.recommendations.map((item) => (
            <article className="compact-item" key={item}>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Consultations() {
  const { data, loading, reload } = useApiData('/consultations', { consultations: [] });
  const [topic, setTopic] = useState('Financial planning');

  async function requestConsultation(event) {
    event.preventDefault();
    await api('/consultations', {
      method: 'POST',
      body: JSON.stringify({ topic, channel: 'VIDEO' })
    });
    setTopic('');
    reload();
  }

  if (loading) return <p className="loading">Loading consultations...</p>;

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Human Consultation</h2>
        <span>Advisor handoff and scheduling</span>
      </div>
      <form className="inline-form" onSubmit={requestConsultation}>
        <input value={topic} onChange={(event) => setTopic(event.target.value)} />
        <button className="primary-button">Request</button>
      </form>
      <div className="stack-list">
        {data.consultations.map((item) => (
          <article className="compact-item" key={item.id}>
            <strong>{item.topic}</strong>
            <span>{item.channel} - {item.status} - {new Date(item.scheduledAt).toLocaleString()}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Notifications() {
  const { data, loading, reload } = useApiData('/notifications', { notifications: [] });

  if (loading) return <p className="loading">Loading notifications...</p>;

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Notifications</h2>
        <button className="ghost-button" onClick={async () => {
          await api('/notifications/read-all', { method: 'PATCH' });
          reload();
        }}>
          <CheckCircle2 size={16} /> Mark all read
        </button>
      </div>
      <div className="stack-list">
        {data.notifications.map((item) => (
          <article className={`compact-item ${item.read ? '' : 'unread'}`} key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.message}</span>
            <b>{item.type}</b>
          </article>
        ))}
      </div>
    </section>
  );
}

function Reports() {
  const { data, loading } = useApiData('/reports/monthly');

  if (loading) return <p className="loading">Loading reports...</p>;

  return (
    <div className="content-grid">
      <section className="metric-strip">
        <Metric label="Income" value={`${formatMoney(data.income)} ETB`} icon={PiggyBank} />
        <Metric label="Expenses" value={`${formatMoney(data.expenses)} ETB`} icon={WalletCards} />
        <Metric label="Net" value={`${formatMoney(data.net)} ETB`} icon={LineChart} />
        <Metric label="AI Actions" value={data.recommendationCount} icon={Sparkles} />
      </section>
      <section className="panel wide">
        <div className="section-title">
          <h2>{data.period} Financial Report</h2>
          <span>Generated summary</span>
        </div>
        <p>{data.summary}</p>
      </section>
    </div>
  );
}

function SettingsPanel({ user, onUserChange }) {
  const [form, setForm] = useState({
    fullName: user.fullName,
    language: user.language,
    riskAppetite: user.riskAppetite || 'Balanced'
  });
  const [saved, setSaved] = useState(false);

  async function save(event) {
    event.preventDefault();
    const response = await api('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(form)
    });
    localStorage.setItem('dashen_user', JSON.stringify(response.user));
    onUserChange(response.user);
    setSaved(true);
  }

  return (
    <section className="panel settings-panel">
      <div className="section-title">
        <h2>Profile and Preferences</h2>
        <span><Languages size={16} /> Multilingual settings</span>
      </div>
      <form className="settings-form" onSubmit={save}>
        <label>
          Full name
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label>
          Language
          <select value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}>
            <option>English</option>
            <option>Amharic</option>
            <option>Afaan Oromo</option>
            <option>Tigrinya</option>
          </select>
        </label>
        <label>
          Risk appetite
          <select value={form.riskAppetite} onChange={(event) => setForm({ ...form, riskAppetite: event.target.value })}>
            <option>Conservative</option>
            <option>Balanced</option>
            <option>Growth</option>
          </select>
        </label>
        <button className="primary-button">Save preferences</button>
        {saved && <p className="success">Preferences saved.</p>}
      </form>
    </section>
  );
}

function Admin() {
  const { data: analytics, loading: analyticsLoading } = useApiData('/admin/analytics');
  const { data: usersData, loading: usersLoading } = useApiData('/admin/users', { users: [] });
  const { data: logsData } = useApiData('/admin/audit-logs', { auditLogs: [] });

  if (analyticsLoading || usersLoading) return <p className="loading">Loading admin analytics...</p>;

  return (
    <div className="content-grid">
      <section className="metric-strip">
        <Metric label="Users" value={analytics.totalUsers} icon={UserRound} />
        <Metric label="Customers" value={analytics.activeCustomers} icon={PiggyBank} />
        <Metric label="Open Consultations" value={analytics.openConsultations} icon={CalendarClock} />
        <Metric label="AI Accuracy" value={`${analytics.aiAccuracy}%`} icon={Sparkles} />
      </section>
      <section className="panel wide">
        <div className="section-title">
          <h2>User Management</h2>
          <span>{analytics.systemHealth}</span>
        </div>
        <div className="user-table">
          {usersData.users.map((item) => (
            <div key={item.id}>
              <strong>{item.fullName}</strong>
              <span>{item.email}</span>
              <b>{item.role}</b>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Services</h2>
        </div>
        <div className="stack-list">
          {analytics.services.map((service) => (
            <article className="compact-item" key={service.name}>
              <strong>{service.name}</strong>
              <span>{service.status}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="section-title">
          <h2>Audit Logs</h2>
        </div>
        <div className="stack-list">
          {logsData.auditLogs.map((log) => (
            <article className="compact-item" key={log.id}>
              <strong>{log.action}</strong>
              <span>{log.actor} - {log.severity}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <article className="metric">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function GoalCard({ goal }) {
  const progress = Math.min(100, Math.round((goal.currentAmount / Math.max(goal.targetAmount, 1)) * 100));

  return (
    <article className="panel goal-card">
      <div className="section-title">
        <h2>{goal.name}</h2>
        <span>{progress}%</span>
      </div>
      <ProgressRow label="Saved" value={goal.currentAmount} max={goal.targetAmount} />
      <p>{formatMoney(goal.currentAmount)} ETB saved of {formatMoney(goal.targetAmount)} ETB target.</p>
      <span className="muted">Monthly contribution: {formatMoney(goal.monthlyContribution)} ETB</span>
    </article>
  );
}

function ProgressRow({ label, value, max }) {
  const width = Math.max(8, Math.min(100, (value / Math.max(max, 1)) * 100));

  return (
    <div className="bar-row">
      <span>{label}</span>
      <div>
        <i style={{ width: `${width}%` }} />
      </div>
      <b>{formatMoney(value)}</b>
    </div>
  );
}

function useApiData(path, fallback = null) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ data: fallback, loading: true, error: '' });

  useEffect(() => {
    let mounted = true;
    setState((current) => ({ ...current, loading: true, error: '' }));
    api(path)
      .then((data) => {
        if (mounted) setState({ data, loading: false, error: '' });
      })
      .catch((error) => {
        if (mounted) setState({ data: fallback, loading: false, error: error.message });
      });

    return () => {
      mounted = false;
    };
  }, [path, tick]);

  return useMemo(
    () => ({
      ...state,
      reload: () => setTick((value) => value + 1)
    }),
    [state]
  );
}

function pageTitle(activeTab, user) {
  const titles = {
    overview: `Welcome, ${user.fullName}`,
    assistant: 'AI Assistant',
    savings: 'Savings Goals',
    investments: 'Investments',
    business: 'Business Insights',
    consultations: 'Consultations',
    notifications: 'Notifications',
    reports: 'Reports',
    settings: 'Settings',
    admin: 'Admin Console'
  };

  return titles[activeTab] || 'Dashen AI';
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value || 0);
}
