import { GetStaticProps } from 'next';
import { GET_POSTS } from '../actions/Post';
import ConvertToHTML from '../components/convertToHtml';
import { Post } from './post/[url]';
import Header from '../components/Header';
import Link from 'next/link';
import Footer from '../components/Footer';
import Head from 'next/head';

export interface Props {
	posts: Post[];
}
const Home = (props: Props) => {
	const posts = props.posts.map((post, id) => {
		const url = `/post/${post.url}`;
		return (
			<div className="post" key={id}>
				<img src={post.featuredimage} alt={post.title} />
				<h3>{post.title}</h3>
				<ConvertToHTML body={post.body} />
				<div className="read-more">
					<Link href={url}>Read more....</Link>
				</div>
			</div>
		);
	});

	return (
		<div className="container">
			<Head>
				<title>Blog</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<style global jsx>{`
				h3 {
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}
				.container {
					padding-left: 30px;
					padding-right: 30px;
					padding-bottom: 50px;
				}
				.header {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					width: 300px;
					margin: 0;
					margin-bottom: 50px;
				}

				.header div {
					width: 50px;
					cursor: pointer;
				}

				.posts {
					display: grid;
					grid-template-columns: 30% 30% 30%;
					justify-content: space-between;
					grid-row-gap: 50px;
					overflow-x: hidden;
				}

				.content {
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 7;
					-webkit-box-orient: vertical;
				}
				img {
					width: 100%;
					height: 350px;
				}

				.socials {
					height: 50px;
				}
				.read-more a,
				.moreposts a {
					color: #663399;
					font-size: 1.3em;
				}

				.moreposts {
					text-align: right;
				}

				@media (max-width: 700px) {
					.container {
						padding-left: 0;
						padding-right: 0;
					}
					.posts {
						grid-template-columns: 80%;
						justify-content: space-evenly;
					}

					img {
						height: 150px;
					}

					.header {
						justify-content: center;
						text-align: center;
					}
				}

				@media (min-width: 700px) and (max-width: 1200px) {
					.container {
						padding-left: 0;
						padding-right: 0;
					}
					.posts {
						grid-template-columns: 45% 45%;
						justify-content: space-evenly;
					}
				}
			`}</style>
			<Header />
			<div className="posts">{posts}</div>
			<div className="moreposts">
				<Link href="/posts/2">More Posts</Link>
			</div>
			<Footer />
		</div>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const res = await GET_POSTS('1');
	return {
		props: {
			posts: res.data.posts,
		},
	};
};

export default Home;
