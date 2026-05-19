import './globals.css';
import Link from 'next/link';
export const metadata = { title: 'Traden', description: 'AI admin assistant for mobile trades' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="shell" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16}}><Link href="/" style={{fontWeight:900,fontSize:24}}>TRA<span style={{color:'var(--accent)'}}>DEN</span></Link><nav className="nav"><Link href="/dashboard">Dashboard</Link><Link href="/test-lab">Test Lab</Link><Link href="/leads">Leads</Link><Link href="/actions">Actions</Link><Link href="/settings/integrations">Settings</Link></nav></header>{children}</body></html>}
