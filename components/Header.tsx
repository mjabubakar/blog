import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetcher from '../actions';
import { cookie } from '../pages/dashboard';
export default function Header () {
	const router = useRouter();
	const pathname = router.pathname;
	const [state, setState] = useState(false);
	const classname = pathname === '/' ? 'home' : pathname.split('/').join('');
	useEffect(() => {
		verify();
	}, []);

	const verify = async () => {
		const token = cookie.get('userToken');
		fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		try {
			await fetcher.get('/verify');
			setState(true);
		} catch (e) {
			setState(false);
		}
	};

	const onLogout = () => {
		document.cookie = 'userToken=;';
		delete fetcher.defaults.headers.Authorization;
		window.location.pathname = '/';
	};

	return (
		<div>
			<style jsx global>{`
				.name {
					color: #663399;
					font-size: 1.3em;
					width: 70px;
					font-weight: bold;
				}

				.headerx {
					display: flex;
					flex-direction: row;
				}

				.auth div,
				.dashboard {
					width: 60px;
					cursor: pointer;
					text-decoration: underline;
					color: #663399;
				}
				.auth a,
				.dashboard a {
					color: #663399;
				}
				.auth-container,
				.auth {
					display: flex;
					flex-direction: row;
				}

				.menu {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					width: 300px;
					margin-bottom: 30px;
				}

				.${classname} a {
					color: white;
					background: 'black';
				}

				.${classname} {
					background: #cdbcde;
				}

				a {
					text-decoration: none;
					color: black;
				}

				.menu div {
					width: 50px;
					cursor: pointer;
					text-align: center;
					padding: 10px;
				}

				.menu div:hover {
					background: #cdbcde;
					color: white;
				}

				.menu div:hover > a {
					color: white;
				}
			`}</style>
			<div className="headerx">
				<div className="name">Blog</div>
				<div className="auth-container">
					{!state ? (
						<div className="auth">
							<div>
								<Link href="/login">Login</Link>
							</div>

							<div>
								<Link href="/register">Register</Link>
							</div>
						</div>
					) : (
						<div className="auth">
							<div onClick={onLogout}>Logout</div>
						</div>
					)}
					{state && (
						<div className="dashboard">
							<Link href="/dashboard">Dashboard</Link>
						</div>
					)}
				</div>
			</div>
			<hr />
			<div className="menu">
				<div className="home">
					<Link href="/">Home</Link>
				</div>
				<div className="about">
					<Link href="/about">About</Link>
				</div>
				<div className="contact">
					<Link href="/contact">Contact</Link>
				</div>
				<div className="header-post">
					<Link href="/posts/2">Posts</Link>
				</div>
			</div>
			<hr />
		</div>
	);
}
