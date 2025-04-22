import jwt from "jsonwebtoken";
  const Auth  = (req,res,next) =>{
    try {
        const token = req.cookies.token;
        console.log(token, "token in auth");
        if (!token) {
          return res.status(401).json({
            message: "User not authenticated",
            success: false,
          });
        }
        const decode =  jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decode) {
          return res.status(401).json({
            message: "Invalid token",
            success: false,
          });
        }
        req.id = decode.id;
        console.log(decode.id, "id");
        
        next();
      } catch (error) {
        console.log(error);
      }
}
export default Auth;