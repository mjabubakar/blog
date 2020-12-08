import fetcher from '..';

export const GET_POST = async (url: string) => {
	const post = await fetcher.get('/post/' + url);
	return post;
};

export const GET_POSTS = async (num: string) => {
	const posts = await fetcher.get('/posts/?page=' + num);
	return posts;
};

export const MY_POSTS = async (token: string) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;

	const posts = await fetcher.get('/myposts');

	return posts;
};

export const DELETE_POST = async (token: string, url: string) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;

	const posts = await fetcher.delete('/delete/' + url);

	return posts;
};

export const EDIT_POST = async (token: string, url: string, data: any) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;

	const res = await fetcher.put('/edit/' + url, data);
	return res;
};

export const ADD_POST = async (token: string, data: any) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;

	const res = await fetcher.post('/createpost/', data);
	return res;
};
