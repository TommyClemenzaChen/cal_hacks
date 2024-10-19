import './HomePage.css';

export default function HomePage() {
	return (
		<div className='page-container'>
			<header>
				<nav className='navbar'>
					<ul className='nav-links'>
						<li>
							<a href='#'>Voice</a>
						</li>
						<li>
							<a href='#'>Upload</a>
						</li>
					</ul>
					<div className='navbar-right'>
						<a href='/signin' className='sign-in-btn'>
							Sign in &gt;
						</a>
					</div>
				</nav>
			</header>
			<main className='hero-section'>
				<div className='hero-content'>
					<h1 className='hero-title'>
						Let go of any worries you have about how you&apos;re feeling. We
						will assess your situation and its severity
					</h1>
				</div>
				<div className='scroll-indicator'>
					<div className='scroll-arrow'></div>
				</div>
			</main>
		</div>
	);
}
