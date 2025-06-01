export const supportsWeekInput = (): boolean => {
  const input = document.createElement('input');
  input.type = 'week';
  return input.type === 'week';
};

export const supportsMonthInput = (): boolean => {
  const input = document.createElement('input');
  input.type = 'month';
  return input.type === 'month';
};
