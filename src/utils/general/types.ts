import { Request } from "express";
import { Document, Types } from "mongoose";
import platformConstants from "../../configs/platfromContants";

export interface IRequest extends Request {
  user?: IUser;
  decoded?: IToken;
  role?: string;
  userAuth: IAuth;
}

export interface IToken {
  ref: Types.ObjectId;
  role: string;
}


export interface IUser extends Document {
  userName: string;
  role: (typeof platformConstants.role)[number];
  email: string;
  avatar?: string;
}

export interface IAuth extends Document {
  User: Types.ObjectId;
  password: string;
  lastLoginAt: Date;
  failedLoginAttempts: number;
  sessions: [
    {
      used: number;
      sessionId: string;
      deviceId: string;
      maxLifespan: number;
      maxInactivity: number;
      isLoggedOut: Boolean;
      device: {
        info: String;
        geoip: {
          lat: number | null;
          long: number | null;
        };
      };
    }
  ];
  isVerified: Boolean;

  //methods
  comparePassword(password: string): boolean;

  generateToken(args: {
    data: IToken;
    expiresIn?: number;
    audience?: "web" | "app";
  }): string;

  randomOTP(): string;
}