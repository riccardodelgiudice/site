import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import './styles.css'

const postModules = import.meta.glob('./content/posts/*.md', { eager: true, query: '?raw', import: 'default' })

function parsePost(raw, file) {
  const [, frontmatter = '', body = ''] = raw.match(/^---\s*([\s\S]*?)---\s*([\s\S]*)$/) || []
  const meta = Object.fromEntries(frontmatter.split('\n').map((line) => line.match(/^([^:]+):\s*(.*)$/)).filter(Boolean).map((match) => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, '')]))
  return { ...meta, slug: meta.slug || file.split('/').pop().replace('.md', ''), body: body.trim(), tags: meta.tags ? meta.tags.split(',').map((tag) => tag.trim()) : [] }
}

const posts = Object.entries(postModules).map(([file, raw]) => parsePost(raw, file)).sort((a, b) => new Date(b.date) - new Date(a.date))
const visibleTopics = ['university', 'learning']
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`
const routerBase = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

const social = [
  ['Email', 'hello.riccardodelgiudice@gmail.com', 'mailto:hello.riccardodelgiudice@gmail.com'],
  ['GitHub', 'github.com/riccardodelgiudice', 'https://github.com/riccardodelgiudice'],
  ['LinkedIn', 'linkedin.com/in/riccardo-del-giudice-029b28332', 'https://linkedin.com/in/riccardo-del-giudice-029b28332'],
]

function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [['Home', '/'], ['Blog', '/blog'], ['Projects', '/projects']]
  return <>
    <div className="utility"><span>RDG:// PORTFOLIO.BLOG</span><span>VENICE, IT <i /> EST. 2025</span></div>
    <header className="masthead"><img className="masthead__art" src={assetUrl('assets/banner-web-objects.png')} alt="A collection of illustrated objects from the early personal-computing era" /></header>
    <nav className="topnav" aria-label="Primary navigation">
      <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="primary-links">{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />} Menu</button>
      <div id="primary-links" className={menuOpen ? 'topnav__links is-open' : 'topnav__links'}>
        {links.map(([label, to]) => <NavLink key={label} to={to} end={to === '/'} onClick={() => setMenuOpen(false)}>[ <span>{label}</span> ]</NavLink>)}
        <a href="mailto:hello.riccardodelgiudice@gmail.com">[ <span>Email</span> ]</a>
      </div>
    </nav>
  </>
}

function Section({ title, action, children, className = '' }) {
  return <section className={`section ${className}`}><header className="section__header"><h2>{title}</h2>{action}</header>{children}</section>
}

function Welcome() {
  return <Section title="Welcome" className="welcome"><h1>Riccardo Del Giudice</h1><p className="lead">Information Technology student at Ca’ Foscari University of Venice.</p><p>I’m building a solid foundation in computer science and computer architecture while exploring where low-level systems and software meet.</p></Section>
}

function PostRow({ post, isNew = false }) {
  return <article className="post-row"><div className="post-row__meta"><time>{post.date}</time><span>{post.readingTime || 'BLOG'}</span></div><div className="post-row__copy"><h3><Link to={`/blog/${post.slug}`}>{post.title}</Link>{isNew && <em>NEW</em>}</h3><p>{post.excerpt}</p><div className="tag-row">{post.tags.filter((tag) => visibleTopics.includes(tag)).map((tag) => <span key={tag}>#{tag}</span>)}</div></div></article>
}

function Education() {
  return <Section title="Education"><div className="education-list"><article><time>2025 – Present</time><h3>Ca’ Foscari University of Venice</h3><p>Bachelor’s degree in Information Technology<br />First year</p></article><article><time>2020 – 2025</time><h3>Istituto Tecnico Enrico Fermi</h3><p>Five years of Information Technology studies.</p></article></div></Section>
}

function Contact() {
  return <Section title="Contact"><ul className="text-links">{social.map(([label, value, href]) => <li key={label}><span>[</span> <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={value}>{label}</a> <span>]</span></li>)}</ul></Section>
}

function Topics() {
  const counts = Object.fromEntries(visibleTopics.map((topic) => [topic, posts.filter((post) => post.tags.includes(topic)).length]))
  return <Section title="Topics"><ul className="indexed-links">{visibleTopics.map((topic) => <li key={topic}><Link to={`/blog?topic=${topic}`}>{topic}</Link><span>({counts[topic]})</span></li>)}</ul></Section>
}

function Archive() {
  const groups = posts.reduce((acc, post) => { const year = new Date(post.date).getFullYear(); acc[year] = (acc[year] || 0) + 1; return acc }, {})
  return <Section title="Archive"><ul className="indexed-links">{Object.entries(groups).reverse().map(([year, count]) => <li key={year}><Link to="/blog">{year}</Link><span>({count})</span></li>)}</ul></Section>
}

function ProjectRow() {
  return <article className="project-row"><Link className="project-preview" to="/projects/portfolio-website" aria-label="Open the Portfolio Website project"><img src={assetUrl('assets/portfolio-home-preview.png')} alt="Homepage of Riccardo Del Giudice's portfolio website" loading="lazy" /><span aria-hidden="true">&gt; portfolio-site v1.0 · live_</span></Link><div className="project-copy"><div className="project-meta"><span>Project 01</span><b>LIVE</b></div><h3><Link to="/projects/portfolio-website">Portfolio Website</Link></h3><p>An AI-assisted personal website refined and published to present my background, skills and selected work across desktop and mobile.</p><p className="focus"><strong>Focus:</strong> Responsive design · Accessibility</p><div className="project-actions"><Link className="inline-link" to="/projects/portfolio-website">View case study <ArrowUpRight size={14} aria-hidden="true" /></Link><a className="inline-link" href="https://github.com/riccardodelgiudice" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a></div></div></article>
}

function Home() {
  return <main className="home-layout"><div className="main-column"><Welcome /><Section title="Latest writing" action={<Link className="section-action" to="/blog">All posts →</Link>}><div className="post-list">{posts.slice(0, 4).map((post, index) => <PostRow key={post.slug} post={post} isNew={index === 0} />)}</div></Section><Section title="Selected project" action={<Link className="section-action" to="/projects">All projects →</Link>}><ProjectRow /></Section></div><aside className="sidebar"><Education /><Contact /><Topics /><Archive /></aside></main>
}

function PageIntro({ eyebrow, title, children }) {
  return <header className="page-intro"><span>{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</header>
}

function BlogIndex() {
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const requestedTopic = searchParams.get('topic') || ''
  const activeTopic = visibleTopics.includes(requestedTopic) ? requestedTopic : ''
  const normalizedQuery = query.toLowerCase()
  const filtered = posts.filter((post) => (!activeTopic || post.tags.includes(activeTopic)) && `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase().includes(normalizedQuery))
  return <main className="inner-page"><PageIntro eyebrow="BLOG" title="Notes from the learning process.">Computer science, architecture, university, and the things I build along the way.</PageIntro><label className="search-box"><Search size={17} aria-hidden="true" /><span className="sr-only">Search posts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive…" /><kbd>{filtered.length}</kbd></label>{activeTopic ? <div className="active-filter"><span>Topic: <strong>#{activeTopic}</strong></span><Link to="/blog">Clear filter ×</Link></div> : null}<section className="blog-index" aria-label="Blog posts">{filtered.length ? filtered.map((post, index) => <PostRow key={post.slug} post={post} isNew={index === 0 && !query} />) : <p className="empty">No posts match the current filters.</p>}</section></main>
}

function MarkdownBody({ body }) {
  return <div className="article-body">{body.split(/\n\n+/).map((block, index) => { if (block.startsWith('### ')) return <h3 key={index}>{block.slice(4)}</h3>; if (block.startsWith('## ')) return <h2 key={index}>{block.slice(3)}</h2>; if (block.startsWith('- ')) return <ul key={index}>{block.split('\n').map((line) => <li key={line}>{line.replace(/^- /, '')}</li>)}</ul>; return <p key={index}>{block}</p> })}</div>
}

function Article() {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)
  if (!post) return <NotFound />
  return <main className="article-page"><Link className="back-link" to="/blog">← Back to all posts</Link><article><header><div className="article-meta"><time>{post.date}</time><span>{post.readingTime}</span></div><h1>{post.title}</h1><p>{post.excerpt}</p></header><MarkdownBody body={post.body} /><footer><div className="tag-row">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></footer></article></main>
}

function ProjectsPage() {
  return <main className="inner-page"><PageIntro eyebrow="PROJECTS" title="Things I build.">Selected experiments and finished work across software, systems and the web.</PageIntro><Section title="Selected work"><ProjectRow /></Section></main>
}

function ProjectDetailPage() {
  return <main className="project-detail-page"><Link className="back-link" to="/projects">← Back to all projects</Link><header className="project-detail-header"><div><div className="project-meta"><span>Project 01</span><b>LIVE</b></div><h1>Portfolio Website</h1></div><p>A personal portfolio and blog designed to present my studies, projects and writing through a minimal interface inspired by the independent web of the late 1990s.</p></header><figure className="project-hero-image"><img src={assetUrl('assets/portfolio-home-preview.png')} alt="Desktop view of the portfolio homepage" /></figure><div className="project-detail-grid"><section><h2>Overview</h2><p>The website combines a portfolio, an education timeline and a Markdown-powered blog in one responsive experience. The visual language intentionally uses system typography, direct links and restrained borders while keeping navigation and reading comfortable on modern devices.</p><h2>What I focused on</h2><ul><li>A responsive two-column layout that becomes a clear single column on mobile.</li><li>Accessible navigation, visible focus states and semantic page structure.</li><li>Clean URLs and Markdown files that make new articles easy to publish.</li></ul></section><aside><h2>Project details</h2><dl><div><dt>Role</dt><dd>Design and development</dd></div><div><dt>Stack</dt><dd>React · Vite · CSS · Markdown</dd></div><div><dt>Year</dt><dd>2026</dd></div><div><dt>Status</dt><dd>Live and evolving</dd></div></dl><div className="project-actions"><a className="inline-link" href="https://github.com/riccardodelgiudice" target="_blank" rel="noreferrer">View source <ArrowUpRight size={14} aria-hidden="true" /></a><Link className="inline-link" to="/">Visit homepage <ArrowUpRight size={14} aria-hidden="true" /></Link></div></aside></div><section className="responsive-showcase"><div><h2>Designed for smaller screens.</h2><p>The same content hierarchy is preserved on mobile: the complete banner remains visible, navigation becomes collapsible and article metadata stays readable without horizontal scrolling.</p></div><figure><img src={assetUrl('assets/portfolio-mobile-preview.png')} alt="Mobile view of the portfolio homepage" loading="lazy" /></figure></section></main>
}

function NotFound() {
  return <main className="not-found"><p>ERROR 404</p><h1>Page not found.</h1><Link to="/">Return home →</Link></main>
}

function Footer() {
  return <footer className="site-footer"><span>© {new Date().getFullYear()} Riccardo Del Giudice.</span><nav aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/blog">Blog</Link><Link to="/projects">Projects</Link><a href="mailto:hello.riccardodelgiudice@gmail.com">Email</a></nav></footer>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function App() {
  return <BrowserRouter basename={routerBase}><ScrollToTop /><div className="site-shell"><Masthead /><Routes><Route path="/" element={<Home />} /><Route path="/blog" element={<BlogIndex />} /><Route path="/blog/:slug" element={<Article />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/projects/portfolio-website" element={<ProjectDetailPage />} /><Route path="*" element={<NotFound />} /></Routes><Footer /></div></BrowserRouter>
}

const rootElement = document.getElementById('root')
const root = window.__rdgReactRoot || createRoot(rootElement)
window.__rdgReactRoot = root
root.render(<React.StrictMode><App /></React.StrictMode>)
