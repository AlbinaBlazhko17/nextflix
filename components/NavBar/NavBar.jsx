import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

import styles from './NavBar.module.scss';

function NavBar({ username }) {
	const [showDropdown, setShowDropdown] = useState(false);
	const router = useRouter();

	function handleOnClickHome(e) {
		e.preventDefault();
		router.push('/');
	}

	function handleOnClickMyList(e) {
		e.preventDefault();
		router.push('/my-list');
	}

	function handleToogleDropdown(e) {
		e.preventDefault();
		setShowDropdown(!showDropdown);
	}

	return (
		<div className={styles.navbar}>
			<div className={styles.navbar__wrapper}>
				<div className={styles.navbar__logo}>
					<a href="/" className={styles.navbar__logoLink}>
						Nextflix
					</a>
				</div>
				<ul className={styles.navbar__list}>
					<li className={styles['navbar__list-item']} onClick={handleOnClickHome}>
						Home
					</li>
					<li className={styles['navbar__list-item']} onClick={handleOnClickMyList}>
						My List
					</li>
				</ul>
				<nav className={styles.navbar__nav}>
					<div>
						<button className={styles.navbar__userBtn} onClick={handleToogleDropdown}>
							<p className={styles.navbar__username}>{username}</p>
						</button>
						{showDropdown && (
							<div className={styles.navbar__dropdown}>
								<div>
									<Link href="/login">
										<a className={styles.navbar__sign}>Sign out</a>
									</Link>
									<div className={styles.navbar__line}></div>
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		</div>
	);
}

export default NavBar;
