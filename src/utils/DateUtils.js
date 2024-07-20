import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export const formatRelativeDate = (dateString) => {
    const date = parseISO(dateString);

    if (isToday(date)) {
        return formatDistanceToNow(date, { addSuffix: true });
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'HH:mm')}`;
    } else {
        return format(date, 'dd/MM/yyyy');
    }
};
