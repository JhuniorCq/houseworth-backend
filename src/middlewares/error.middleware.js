const handleError = (error, req, res, next) => {
  res.status(error.status ?? 500).json({
    success: false,
    message: error.message ?? "Error en el servidor",
    error: {
      details: error.details ?? [],
    },
  });
};

export default handleError;
