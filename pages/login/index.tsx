import { useState } from 'react';
import { LOGIN } from '../../actions/Authentication';
import { GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import { notAuth } from '../../components/checkAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Login = () => {
	const [email, setEmail] = useState<string>('imuhdjml@gmail.com');
	const router = useRouter();
	const [password, setPassword] = useState<string>('zeejamil');
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const onLogin = async () => {
		setLoading(true);
		const login = await LOGIN({ email, password });
		setLoading(false);
		if (login) return setError(login.response && login.response.data.message);
		return router.push('/dashboard');
	};

	return (
		<div>
			<Head>
				<title>Login</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			{loading && 'loading'}
			<div>{error}</div>
			<input
				placeholder="Email"
				value={email}
				type="email"
				required={true}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				placeholder="Password"
				type="password"
				required={true}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={onLogin}>Login</button>
			<button onClick={() => router.push('/register')}>Register</button>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = cookies(ctx).userToken;
	return notAuth(token);
};
export default Login;
