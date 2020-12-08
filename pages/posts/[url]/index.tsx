import { GetServerSideProps } from 'next';
import { GET_POSTS } from '../../../actions/Post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConvertToHTML, { returnDate } from '../../../components/convertToHtml';
import Header from '../../../components/Header';
import Head from 'next/head';

type Post = {
	title: string;
	body: string;
	created_at: string;
	url: string;
	fullname: string;
};

interface Props {
	posts: Post[];
	len: number;
}

const Posts = (props: Props) => {
	const router = useRouter();
	//@ts-ignore
	const route = parseInt(router.query.url);
	const [len, _] = useState(props.len);
	const posts = props.posts.map(({ title, body, created_at, url, fullname }, id) => {
		const link = `/post/${url}`;
		return (
			<div className="post" key={id}>
				<div className="title">{title}</div>
				<div className="by">
					By {fullname} on {returnDate(created_at)}
				</div>
				<ConvertToHTML body={body} />
				<div className="read-more">
					<Link href={link}>Read More</Link>
				</div>
			</div>
		);
	});
	const createSelectItems = () => {
		let items = [];
		for (let i = 1; i <= props.len; i++) {
			items.push(
				<option key={i} value={i}>
					{i}
				</option>
			);
		}
		return items;
	};

	const options = createSelectItems();

	return (
		<div className="container">
			<Head>
				<title>Posts</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<style jsx global>
				{`
					.header {
						margin-left: 15%;
					}

					.header-post a {
						color: white;
					}

					.header-post {
						background: #cdbcde;
					}

					.container {
						padding-bottom: 30px;
					}

					.post a,
					.pagination a {
						color: #663399;
						font-weight: bold;
					}

					.posts.container {
						display: flex;
						flex-direction: column;
						margin-left: 15%;
						margin-right: 20%;
					}

					.post {
						width: 100%;
						margin-left: 0;
						padding-left: 0;
						text-align: left;
						padding-bottom: 30px;
					}

					.post .by {
						font-size: 0.8em;
					}

					.post .title {
						font-size: 2em;
					}

					.post .read-more {
						font-size: 1.2em;
						text-decoration: underline;
						line-height: 1.6;
					}

					.pagination {
						text-align: right;
						padding-right: 100px;
						padding-left: 15%;
					}

					.pagination .container {
						display: grid;
						grid-template-columns: 50% 50%;
						justify-content: space-between;
					}

					.newer-posts {
						text-align: left;
					}

					.newer-posts,
					.older-posts {
						font-size: 1.5em;
						text-decoration: underline;
						margin-bottom: 5px;
					}

					.content {
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 4;
						-webkit-box-orient: vertical;
					}
				`}
			</style>
			<div className="posts">
				<Header />
				<div className="container posts">{posts}</div>
			</div>
			<div className="pagination">
				<div className="container">
					<div>
						{route - 1 !== 0 && (
							<div className="newer-posts">
								<Link href={`/posts/${route - 1}`}>Newer posts</Link>
							</div>
						)}
					</div>

					<div>
						{route + 1 <= len ? (
							<div className="older-posts">
								<Link href={`/posts/${route + 1}`}> Older posts</Link>
							</div>
						) : (
							<br />
						)}
						<div style={{ marginTop: 0, paddingTop: 0 }}>
							Showing page
							<select
								value={route}
								onChange={(e) => {
									if (e.target.value === '1') return router.push('/');
									router.push(`/posts/${e.target.value}`);
								}}
							>
								{options}
							</select>
							of {props.len}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const url = ctx.params.url.toString();
	if (url === '1') return notFound();
	try {
		const { data } = await GET_POSTS(url);
		return {
			props: {
				posts: data.posts,
				len: data.len,
			},
		};
	} catch (e) {
		return notFound();
	}
};

const notFound = () => {
	return {
		redirect: {
			destination: '/notfound',
			permanent: false,
		},
	};
};

export default Posts;
