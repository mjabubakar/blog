import fetcher from '..';

type loginData = {
	email: string;
	password: string;
};

export const LOGIN = async (data: loginData) => {
	try {
		const res = await fetcher.post('/signin', data);
		const token = res.data;
		document.cookie = "userToken='';";
		document.cookie = `userToken=${token};`;
		return false;
	} catch (e) {
		return e;
	}
};

export const REGISTER = async (data: any) => {
	try {
		await fetcher.post('/signup', data);
		return false;
	} catch (e) {
		return e;
	}
};
