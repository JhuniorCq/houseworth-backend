const handleError = (error, req, res, next) => {
  res.status(error.status ?? 500).json({
    success: false,
    message: error.message ?? "Error en el servidor",
    errors: error.details ?? [],
    fieldErrors: error.fieldErrors ?? undefined,
  });
};

export default handleError;
