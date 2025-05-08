export const formatDate = (date: Date): {time: string; datePart: string} => {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return {
    time: `${hours}:${minutes}`,
    datePart: `${day}/${month}/${year}`,
  };
};
