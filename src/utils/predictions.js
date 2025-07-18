import { ALLOWED_MIME_TYPES, EXPECTED_COLUMNS_EXCEL } from "./constants.js";

export const itIsAnExcelFile = (fileMimeType) => {
  if (!ALLOWED_MIME_TYPES.includes(fileMimeType)) {
    const error = new Error("El archivo debe ser un Excel (.xlsx o .xls).");
    error.status = 400;
    throw error;
  }
};

export const areTheExactColumns = (actualColumns) => {
  const meetsTheConditions =
    actualColumns.length === EXPECTED_COLUMNS_EXCEL.length &&
    EXPECTED_COLUMNS_EXCEL.every((col) => actualColumns.includes(col));

  if (!meetsTheConditions) {
    const error = new Error(
      `El archivo Excel debe contener exactamente las siguientes columnas: ${EXPECTED_COLUMNS_EXCEL.join(
        ", "
      )}`
    );
    error.status = 400;
    throw error;
  }
};
