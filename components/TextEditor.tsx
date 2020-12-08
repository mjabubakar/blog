import React, { useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { ADD_POST, EDIT_POST } from '../actions/Post';
import { cookie } from '../pages/dashboard/index';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';

// function uploadImageCallBack(file) {
// 	return new Promise((resolve, reject) => {
// 		const xhr = new XMLHttpRequest();
// 		xhr.open('POST', 'URL');
// 		const data = new FormData();
// 		data.append('image', file);
// 		xhr.send(data);
// 		xhr.addEventListener('load', () => {
// 			const response = xhr.responseText;
// 			resolve({ data: { link: response } });
// 		});
// 		xhr.addEventListener('error', () => {
// 			const response = xhr.responseText;
// 			reject(response);
// 		});
// 	});
// }

interface Iprops {
	postTitle: string;
	body: any;
	url: string;
	mode: string;
	image: string;
}
function EditorContainer({ postTitle, body, mode, url, image }: Iprops) {
	const router = useRouter();
	const [error, setError] = useState<string>('');
	const [editorMode, setMode] = useState<string>('');
	const [editorState, setEditorState] = useState<any>(
		editorMode === 'edit' ? EditorState.createWithContent(body) : EditorState.createEmpty()
	);
	const [featuredimage, setFeaturedimage] = useState<File>();
	const [title, setTitle] = useState<string>(postTitle);
	const [imageSrc, setImageSrc] = useState<string>();
	const [preview, setPreview] = useState<string>();

	const onEditorStateChange: Function = (editorState) => {
		setEditorState(editorState);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		let contentState = editorState.getCurrentContent();
		let body = JSON.stringify(convertToRaw(contentState));
		const formData = new FormData();
		formData.append('body', body);
		if (title !== postTitle) {
			formData.append('title', title);
		}
		formData.append('featuredimage', featuredimage);
		const token = cookie.get('userToken');
		try {
			editorMode === 'edit' ? await EDIT_POST(token, url, formData) : await ADD_POST(token, formData);
			router.push('/dashboard');
		} catch (e) {
			setError(e.response.data.message);
		}
	};

	useEffect(() => {
		setMode(mode);
	}, [mode]);

	useEffect(() => {
		setImageSrc(image);
	}, []);

	useEffect(() => {
		if (!featuredimage) {
			setPreview(undefined);
			return;
		}

		setImageSrc('');
		const objectUrl = URL.createObjectURL(featuredimage);
		setPreview(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [featuredimage]);

	const onChange = (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			setFeaturedimage(undefined);
			return;
		}
		setFeaturedimage(e.target.files[0]);
	};

	return (
		<>
			<Header />
			<h2>{editorMode === 'edit' ? 'Edit Post' : 'New Post'}</h2>
			<div className="link">
				<Link href="/dashboard">Back</Link>
			</div>
			<div className="container">
				<style jsx global>
					{`
						h2 {
							margin-left: 20px;
							text-decoration: underline;
						}

						.link a {
							color: #663399;
							text-decoration: underline;
							margin-left: 20px;
							font-size: 1.2em;
						}

						.error {
							color: red;
							text-align: center;
							font-size: 1.1em;
							font-weight: bold;
							margin-bottom: 10px;
						}

						.container {
							display: flex;
							flex-direction: row;
							align-items: center;
						}

						.container .rdw-editor-toolbar,
						.container .rdw-editor-main {
							border: 1px solid;
						}

						.container .rdw-editor-main .DraftEditor-root {
							height: 450px;
						}

						.container .rdw-editor-wrapper {
							width: 100%;
						}

						.container .rdw-editor-toolbar {
							margin: 10px 0;
						}

						.title {
							width: 100%;
						}

						.title input {
							width: 100%;
							height: 35px;
							padding: 0;
							border: 1px solid;
							text-align: center;
						}
						.title input:focus {
							outline: none;
						}
						button {
							width: 100%;
							padding: 10px 0;
							margin: 20px 0;
							cursor: pointer;
						}

						.fileupload {
							border: 1px solid;
							margin: 10px 0;
							width: 100%;
							text-align: center;
							cursor: pointer;
						}

						.fileupload input {
							display: none;
						}

						.fileupload label {
							width: 100%;
							display: inline-block;
							height: 100%;
							padding: 10px 0;
							cursor: pointer;
						}

						.featuredimage {
							width: 20%;
						}

						.featuredimage img {
							width: 100%;
							height: 30%;
						}

						.data {
							width: 75%;
							margin-left: 20px;
							margin-right: 20px;
						}
					`}
				</style>

				<div className="data">
					<div className="error">{error}</div>
					<div className="title">
						<input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>

					<Editor
						editorState={editorState}
						onEditorStateChange={onEditorStateChange}
						toolbar={{
							inline: { inDropdown: true },
							list: { inDropdown: true },
							textAlign: { inDropdown: true },
							link: { inDropdown: true },
							// inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
							// image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
						}}
					/>
					<button onClick={onSubmit}>{editorMode === 'edit' ? 'Edit Post' : 'Create Post'}</button>
				</div>

				<div className="featuredimage">
					<div>Featured Image</div>
					<div className="fileupload">
						<label htmlFor="input">Select Image</label>
						<input type="file" id="input" accept="image/*" onChange={onChange} />
					</div>
					{imageSrc && <img src={imageSrc} alt={title} />}
					{featuredimage && <img src={preview} alt="featured image" />}
				</div>
			</div>
			<Footer />
		</>
	);
}

export default EditorContainer;
