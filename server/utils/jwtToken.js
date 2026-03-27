export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT();

  // Determine cookie name based on role
  let cookieName;
  if (user.role === "Admin") {
    cookieName = "adminToken";
  } else if (user.role === "Doctor") {
    cookieName = "doctorToken";
  } else {
    cookieName = "patientToken";
  }

  // ✅ FIX: Parse COOKIE_EXPIRE as integer with fallback of 7 days.
  // If COOKIE_EXPIRE is missing/undefined, multiplying it gives NaN,
  // which causes Express to throw "option expires is invalid" on every login.
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};