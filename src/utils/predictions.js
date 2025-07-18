export const groupPredictions = (predictions) => {
  const grouped = new Map();

  for (const prediction of predictions) {
    const key = prediction.excelId ?? prediction.id;

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: /*crypto.randomUUID()*/ key,
        excelId: prediction.excelId, // null o número
        predictions: [],
      });
    }

    grouped.get(key).predictions.push(prediction);
  }

  return Array.from(grouped.values());
};
