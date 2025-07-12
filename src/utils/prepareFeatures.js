const averagePriceByNeighborhood = {
  Blueste: 137500,
  BrDale: 108200,
  BrkSide: 124300,
  ClearCr: 212565,
  CollgCr: 197965,
  Crawfor: 210624,
  Edwards: 128219,
  Gilbert: 192854,
  IDOTRR: 100123,
  MeadowV: 103200,
  Mitchel: 156270,
  NAmes: 186185,
  NoRidge: 316270,
  NPkVill: 142694,
  NridgHt: 222385,
  NWAmes: 193219,
  OldTown: 128219,
  SWISU: 192019,
  Sawyer: 136793,
  SawyerW: 186555,
  Somerst: 225379,
  StoneBr: 310499,
  Timber: 223833,
  Veenker: 238772,
};

const socioEconomicLevels = {
  Blueste: 2,
  BrDale: 1,
  BrkSide: 1,
  ClearCr: 3,
  CollgCr: 3,
  Crawfor: 3,
  Edwards: 1,
  Gilbert: 3,
  IDOTRR: 1,
  MeadowV: 1,
  Mitchel: 2,
  NAmes: 3,
  NoRidge: 4,
  NPkVill: 2,
  NridgHt: 3,
  NWAmes: 3,
  OldTown: 1,
  SWISU: 3,
  Sawyer: 2,
  SawyerW: 3,
  Somerst: 4,
  StoneBr: 5,
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
