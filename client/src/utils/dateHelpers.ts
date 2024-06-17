export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${formattedDate} at ${formattedTime}`;
};
