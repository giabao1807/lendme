export const formatDate = (dateString: string) => {
  const [datePart, timePart] = dateString.split(' ');
  return `${timePart} ngày ${datePart}`;
};
