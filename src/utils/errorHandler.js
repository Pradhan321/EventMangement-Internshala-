const handleError = (res, error) => {
  console.error(error);
  const status = error.message.includes('not found') ? 404 :
                 error.message.includes('already registered') ? 409 :
                 error.message.includes('full') ? 400 :
                 error.message.includes('past events') ? 400 : 500;
  res.status(status).json({ error: error.message });
};

export default { handleError };