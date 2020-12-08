import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Socket from 'socket.io-client';
import cookies from 'next-cookies';
import Cookie from 'universal-cookie';
import { DELETE_POST, MY_POSTS } from '../../actions/Post';
import { Props } from '..';
import { useEffect, useState } from 'react';
import { Post } from '../post/[url]';
import { redirectToLogin } from '../../components/checkAuth';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const cookie = new Cookie();
export default function Dashboard(props: Props) {
	const [posts, setPosts] = useState<Post[]>(props.posts);
	const router = useRouter();
	useEffect(() => {
		//@ts-ignore
		let socket = Socket('http://localhost:3001/');
		socket.on('postdelete', (data: Post[]) => {
			setPosts(data);
		});
	}, []);

	let renderPosts = posts.map((post, id) => {
		return (
			<div className="post" key={id}>
				<Head>
					<title>Dashboard</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				</Head>
				<div className="title">{post.title}</div>
				<div className="btn edit">
					<button
						onClick={async () => {
							router.push(`/post/${post.url}/edit`);
						}}
					>
						Edit Post
					</button>
				</div>
				<div className="btn delete">
					<button
						onClick={async () => {
							const token = cookie.get('userToken');
							await DELETE_POST(token, post.url);
						}}
					>
						Delete Post
					</button>
				</div>
				<br />
			</div>
		);
	});

	return (
		<div>
			<Head>
				<title>Dashboard</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Header />
			<style jsx global>{`
				.container {
					background: #cdbcde;
					color: white;
					font-weight: bold;
					overflow: auto;
					max-height: 450px;
					border: 1px solid #6216af;
					padding: 10px;
					margin-top: 20px;
				}

				button {
					cursor: normal;
				}

				.post {
					display: flex;
					flex-direction: row;
					padding: 10px 0;
					border-bottom: 1px solid white;
				}

				.post .title {
					flex: 3;
				}

				.post .btn.delete {
					flex: 1;
				}

				.post .btn.edit {
					flex: 1;
				}

				.link {
					background: #cdbcde;
					display: inline;
					padding: 10px;
					border: 1px solid grey;
				}

				.link a {
					color: white;
				}
			`}</style>
			<h2>Dashboard</h2>
			<div className="link">
				<Link href="/post/create">Create new post</Link>
			</div>

			<div className="container">
				<div>
					<div>Title</div>
				</div>
				{renderPosts}
			</div>
			<div className="pagination">
				<div>1</div>
			</div>
			<Footer />
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = cookies(ctx).userToken;
	try {
		const posts = await MY_POSTS(token);
		return {
			props: { auth: true, posts: posts.data },
		};
	} catch (e) {
		if (e.response.data.message === 'Authentication error.') {
			return redirectToLogin();
		}
	}
};
