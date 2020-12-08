import fetcher from '../actions';

export const notAuth = async (token: string) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	try {
		await fetcher.get('/verify');

		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		};
	} catch (e) {
		return {
			props: {},
		};
	}
};

export const isAuth = async (token: string) => {
	fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	try {
		await fetcher.get('/verify');

		return {
			props: {},
		};
	} catch (e) {
		return redirectToLogin();
	}
};

export const redirectToLogin = () => {
	return {
		redirect: {
			destination: '/login',
			permanent: true,
		},
	};
};
