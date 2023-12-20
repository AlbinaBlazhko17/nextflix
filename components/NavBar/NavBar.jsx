import styles from './NavBar.module.scss';

function NavBar({ username }) {
	return (
		<div>
			<h2>Hello from the navbar</h2>
			<ul>
				<li>Home</li>
				<li>My List</li>
			</ul>
			<nav>
				<div>
					<p>{username}</p>
					<button></button>
					<div>
						<a href="#">Sign out</a>
					</div>
				</div>
			</nav>
		</div>
	);
}

export default NavBar;
