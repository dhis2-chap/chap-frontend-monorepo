export const supportsWeekInput = (): boolean => {
  const input = document.createElement('input');
  input.type = 'week';
  return input.type === 'week';
};
