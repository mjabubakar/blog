import Head from 'next/head';
import Header from '../../components/Header';

export default function Contact() {
	return (
		<div>
			<Head>
				<title>Contact</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Header />
			<div>Contact Page</div>
		</div>
	);
}
