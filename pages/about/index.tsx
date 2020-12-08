import Head from 'next/head';
import Header from '../../components/Header';

export default function About() {
	return (
		<div>
			<Head>
				<title>About</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Header />
			<div>About Page</div>
		</div>
	);
}
