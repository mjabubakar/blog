import { convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';

interface Props {
	body: string;
}

export default function ConvertToHTML({ body }: Props) {
	const str = convertFromRaw(JSON.parse(body));
	const Body = convertToHTML(str);

	return <div className="content" dangerouslySetInnerHTML={{ __html: Body }} />;
}

const check = (n: number) => {
	if ((n > 3 && n < 21) || n > 23) {
		return 'th';
	}
	if (n > 20) {
		return mini(parseInt(n.toString()[1]));
	}
	return mini(n);
};

const mini = (n: number) => {
	if (n === 1) return 'st';
	if (n === 2) return 'nd';
	if (n === 3) return 'rd';
};

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export function returnDate(d) {
	const date = new Date(d);
	const day = date.getDate();
	const modifiedDay = day + check(day);
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `${month} ${modifiedDay}, ${year}`;
}
