export const getEqualIntervals = (minValue, maxValue, numClasses = 5) => {
    const bins = [];
    const binSize = (maxValue - minValue) / numClasses;
  
    for (let i = 0; i < numClasses; i++) {
      const startValue = minValue + i * binSize;
      const endValue = i < numClasses - 1 ? startValue + binSize : maxValue;
  
      bins.push({
        startValue: Math.round(startValue),
        endValue: Math.round(endValue),
      });
    }
  
    return bins;
  };