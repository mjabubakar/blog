import Head from 'next/head';
import { GetServerSideProps } from 'next';
import cookies from 'next-cookies';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { isAuth } from '../../../components/checkAuth';
import Loading from '../../../components/loading';

const EditorContainer = dynamic(() => import('../../../components/TextEditor'), {
	loading: () => <Loading />,
	ssr: false,
});

const CreatePost = () => {
	return (
		<div>
			<Head>
				<title>Create Post</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<EditorContainer url="" postTitle="" body="" mode="create" image="" />;
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = cookies(ctx).userToken;
	return isAuth(token);
};

export default CreatePost;
