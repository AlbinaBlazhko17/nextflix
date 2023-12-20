import styles from './NavBar.module.scss';

function NavBar({ username }) {
	return (
		<div className={styles.navbar}>
			<div className={styles.navbar__wrapper}>
				<div className={styles.navbar__logo}>
					<a href="/" className={styles.navbar__logoLink}>
						Nextflix
					</a>
				</div>
				<ul className={styles.navbar__list}>
					<li className={styles['navbar__list-item']}>Home</li>
					<li className={styles['navbar__list-item']}>My List</li>
				</ul>
				<nav className={styles.navbar__nav}>
					<div>
						<button className={styles.navbar__userBtn}>
							<p className={styles.navbar__username}>{username}</p>
						</button>
						<div className={styles.navbar__dropdown}>
							<div>
								<a href="#" className={styles.navbar__sign}>
									Sign out
								</a>
								<div className={styles.navbar__line}></div>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default NavBar;
