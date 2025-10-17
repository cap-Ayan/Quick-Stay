import express from "express";

import {getUserData,storeRecentSearch} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";


const userRouter = express.Router();

userRouter.get('/',protect,getUserData)
userRouter.post('/store-recentSearch',protect,storeRecentSearch)      

export default userRouter