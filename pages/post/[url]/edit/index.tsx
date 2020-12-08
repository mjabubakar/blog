import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { GetServerSideProps } from 'next';
import { EDIT_POST, GET_POST } from '../../../../actions/Post';
import { useEffect, useState } from 'react';
import { convertFromRaw } from 'draft-js';
import cookies from 'next-cookies';
import { Post } from '..';
import Loading from '../../../../components/loading';
import Head from 'next/head';

const EditorContainer = dynamic(() => import('../../../../components/TextEditor'), {
	loading: () => <Loading />,
	ssr: false,
});

interface Props {
	post: Post;
}

const Edit = (props: Props) => {
	const { title, body, url, featuredimage } = props.post;
	const [str, setStr] = useState();
	useEffect(() => {
		const str = convertFromRaw(JSON.parse(body));
		setStr(str);
	}, []);

	return (
		<div>
			<Head>
				<title>Edit Post</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<EditorContainer url={url} postTitle={title} body={str} mode="edit" image={featuredimage} />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = cookies(ctx).userToken;
	const url = ctx.params.url.toString();
	try {
		const post = await GET_POST(url);
		await EDIT_POST(token, url, null);
		return {
			props: {
				post: post.data,
			},
		};
	} catch (e) {
		return {
			redirect: {
				destination: '/notfound',
				permanent: false,
			},
		};
	}
};

export default Edit;
