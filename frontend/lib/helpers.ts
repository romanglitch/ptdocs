export const formatDays = (days: number, onlyDays = false, onlyWeeks = false) => {
	if (days === 0) return '0 дней';

	function declension(number:number, one:string, few:string, many:string) {
		const lastDigit = number % 10;
		const lastTwoDigits = number % 100;

		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
			return many;
		}
		if (lastDigit === 1) {
			return one;
		}
		if (lastDigit >= 2 && lastDigit <= 4) {
			return few;
		}
		return many;
	}

	// Если нужно вывести только дни
	if (onlyDays) {
		return `${days} ${declension(days, 'день', 'дня', 'дней')}`;
	}

	// Если нужно вывести только недели и дни
	if (onlyWeeks) {
		const weeks = Math.floor(days / 7);
		const remainingDays = days % 7;

		const result = [];

		if (weeks > 0) {
			result.push(`${weeks} ${declension(weeks, 'неделя', 'недели', 'недель')}`);
		}

		if (remainingDays > 0) {
			result.push(`${remainingDays} ${declension(remainingDays, 'день', 'дня', 'дней')}`);
		}

		return result.join(' ');
	}

	// Расчет месяцев, недель и дней
	const months = Math.floor(days / 30);
	const weeks = Math.floor((days % 30) / 7);
	const remainingDays = days % 7;

	const result = [];

	if (months > 0) {
		result.push(`${months} ${declension(months, 'месяц', 'месяца', 'месяцев')}`);
	}

	if (weeks > 0) {
		result.push(`${weeks} ${declension(weeks, 'неделя', 'недели', 'недель')}`);
	}

	if (remainingDays > 0) {
		result.push(`${remainingDays} ${declension(remainingDays, 'день', 'дня', 'дней')}`);
	}

	return result.join(' ');
}

export const dayDate = (dateString:string, dayNumber:number) => {
	const date = new Date(dateString);
	date.setDate(date.getDate() + dayNumber);

	const months = [
		'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
		'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
	];

	const day = date.getDate();
	const month = months[date.getMonth()];

	return `${day} ${month}`;
}