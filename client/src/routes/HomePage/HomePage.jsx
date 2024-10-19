import './HomePage.css';

export default function HomePage() {
	return (
		<div>
			<header>
				<nav>
					<div></div>
					<ul>
						<li>
							<a href='/voice'>Voice</a>
						</li>
						<li>
							<a href='/upload'>Upload</a>
						</li>
					</ul>
					<div>
						<a href='/signin'>Sign in &gt;</a>
					</div>
				</nav>
			</header>
		</div>
	);
}
