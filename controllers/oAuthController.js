exports.googleCallback = (req, res) => {
  const { token } = req.user;
  res.status(200).json({
    status: 'success',
    message: 'user logged in with google',
    token,
  });
};
