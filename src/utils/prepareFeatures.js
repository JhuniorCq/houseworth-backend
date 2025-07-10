const averagePriceByNeighborhood = {
  Blueste: 137500,
  Brdale: 108200,
  Brkside: 124300,
  Clearcr: 212565,
  Collgcr: 197965,
  Crawfor: 210624,
  Edwards: 128219,
  Gilbert: 192854,
  Idotrr: 100123,
  Meadowv: 103200,
  Mitchel: 156270,
  Names: 186185,
  Noridge: 316270,
  Npkvill: 142694,
  Nridght: 222385,
  Nwames: 193219,
  Oldtown: 128219,
  Sawyer: 136793,
  Sawyerw: 186555,
  Somerst: 225379,
  Stonebr: 310499,
  Swisu: 192019,
  Timber: 223833,
  Veenker: 238772,
};

const socioEconomicLevels = {
  Blueste: 2,
  Brdale: 1,
  Brkside: 1,
  Clearcr: 3,
  Collgcr: 3,
  Crawfor: 3,
  Edwards: 1,
  Gilbert: 3,
  Idotrr: 1,
  Meadowv: 1,
  Mitchel: 2,
  Names: 3,
  Noridge: 4,
  Npkvill: 2,
  Nridght: 3,
  Nwames: 3,
  Oldtown: 1,
  Sawyer: 2,
  Sawyerw: 3,
  Somerst: 4,
  Stonebr: 5,
  Swisu: 3,
  Timber: 4,
  Veenker: 4,
};

const allNeighborhoods = Object.keys(averagePriceByNeighborhood);

export const prepareFeatures = ({
  grLivArea,
  garageCars,
  totalBsmtSF,
  yearBuilt,
  overallQual,
  neighborhood,
}) => {
  // Campos calculados
  const grLivAreaQual = grLivArea * overallQual;
  const isModern = yearBuilt >= 2000 ? 1 : 0;
  const isLuxury = grLivArea >= 2000 && overallQual >= 8 ? 1 : 0;
  const avgPrice = averagePriceByNeighborhood[neighborhood] || 150000;
  const socioLevel = socioEconomicLevels[neighborhood] || 2;

  // One-hot encoding del vecindario
  const oneHotNeighborhoods = {};
  allNeighborhoods.forEach((n) => {
    oneHotNeighborhoods[`Nbhd_${n}`] = n === neighborhood ? 1 : 0;
  });

  // Armar el objeto final
  return {
    GrLivArea: grLivArea,
    GarageCars: garageCars,
    TotalBsmtSF: totalBsmtSF,
    YearBuilt: yearBuilt,
    OverallQual: overallQual,
    GrLivArea_Qual: grLivAreaQual,
    Is_Modern: isModern,
    Is_Luxury: isLuxury,
    AvgPriceByNbhd: avgPrice,
    SocioEconomicLevel: socioLevel,
    ...oneHotNeighborhoods,
  };
};
