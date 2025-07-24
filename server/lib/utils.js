import jwt from 'jsonwebtoken'

// fn to gen token
export const genrateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}