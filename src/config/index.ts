import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env")
});


export default {
    port : process.env.PORT || 5000,
    databaseUrl : process.env.DATABASE_URL,
    app_url : process.env.APP_URL,
    bycrypt_salt_rounds : process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret : process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET,
    jwt_access_expiry : process.env.JWT_ACCESS_EXPIRY,
    jwt_refresh_expiry : process.env.JWT_REFRESH_EXPIRY
}
