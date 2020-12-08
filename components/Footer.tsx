import Link from 'next/link';

export default function Footer() {
	return (
		<div className="socials">
			<style jsx global>{`
				.socials a {
					color: blue;
				}
			`}</style>
			<hr />
			<Link href="https://github.com/mjabubakar/blog">Github</Link>
		</div>
	);
}
