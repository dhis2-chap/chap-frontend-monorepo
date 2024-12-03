import React from "react";

interface SplitPeriodSelectorProps {
  splitPeriods: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SplitPeriodSelector: React.FC<SplitPeriodSelectorProps> = ({
  splitPeriods,
  onChange,
}) => {
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  return (
    <div>
      <h2>View split period</h2>
      <p>
        The split period is the first period where the model predicts. The further the predicted period is away from the split period, the less accurate the prediction.
        CHAP uses many split periods in order to get many predictions to evaluate the model. This gives the model more opportunities to make 'mistakes' which we can pick up on.
        It's therefore important to look at many split periods when evaluating a model. (Note: loading a new split period might take some time)
      </p>
      <label>Select the split period: </label>
      <select value={splitPeriods[-1]} onChange={handlePeriodChange}>
        {splitPeriods.map((splitPeriod) => (
          <option key={splitPeriod} value={splitPeriod}>
            {splitPeriod}
          </option>
        ))}
      </select>
    </div>
  );
};
