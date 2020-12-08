import { GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import { useState } from 'react';
import { REGISTER } from '../../actions/Authentication';
import { notAuth } from '../../components/checkAuth';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Register = () => {
	const router = useRouter();
	const [fullname, setFullname] = useState<string>('Muhammad Jamil Abubakar');
	const [email, setEmail] = useState<string>('myemail@email.com');
	const [password, setPassword] = useState<string>('zeejamil');
	const [profilepic, setProfilepic] = useState<File>();
	const [username, setUsername] = useState<string>('mjabubakar');
	const [bio, setBio] = useState<string>('Hello guys');
	const [error, setError] = useState('');

	const onRegister = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('profilepic', profilepic);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('fullname', fullname);
		formData.append('username', username);
		formData.append('bio', bio);
		const register = await REGISTER(formData);
		if (register) return setError(register.response.data.message);
		return router.push('/login');
	};
	return (
		<div>
			<Head>
				<title>Register</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<div>{error}</div>
			<input
				placeholder="Fullname"
				name="fullname"
				value={fullname}
				onChange={(e) => setFullname(e.target.value)}
			/>
			<input placeholder="Email" name="user[name]" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
			<input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
			<input
				type="file"
				id="input"
				accept="image/*"
				onChange={({ target: { files } }) => {
					const file = files[0];
					setProfilepic(file);
				}}
			/>
			<button type="submit" onClick={onRegister}>
				Register
			</button>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = cookies(ctx).userToken;
	return notAuth(token);
};

export default Register;
