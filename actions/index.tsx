import Axios from 'axios';

let urls = {
	test: `URL`,
};
const fetcher = Axios.create({
	baseURL: urls['test'],
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export default fetcher;
