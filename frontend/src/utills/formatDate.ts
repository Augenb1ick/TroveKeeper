export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return `${date.getDate().toString().padStart(2, '0')}.${(
        date.getMonth() + 1
    )
        .toString()
        .padStart(2, '0')}.${date.getFullYear()} at ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
