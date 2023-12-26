import { Request, Response } from "express";
import { IUser } from "../components/v1/user/user.types";
import { ClientSession, Types } from "mongoose";
import { IAuth } from "../components/v1/auth/auth.types";

export interface GeoInfo {
  range: [number, number];
  country: string;
  region: string;
  timezone: string;
  city: string;
  ll: [number, number];
  metro: number;
  area: number;
}

export interface IRequest extends Request {
  user?: IUser;
  decoded?: IToken;
  role?: string;
  userAuth: IAuth;
  permissions: string[];
  fingerprint: {
    deviceHash: string;
    components: {
      userAgent: string;
      language?: string;
      ip: string;
      geo: Partial<GeoInfo>;
    };
  };
}

export interface IToken {
  ref: Types.ObjectId;
  role: string;
  sessionId?: string;
  deviceId?: string;
}

export interface IUserSession {
  used: number;
  sessionId: string;
  deviceHash: string;
  lastEventTime: Date;
  maxLifespan: number;
  maxInactivity: number;
  isLoggedOut?: boolean;
  device: {
    info: string;
    geoip: {
      lat: number | null;
      long: number | null;
    };
  };
}

export interface GeoInfo {
  range: [number, number];
  country: string;
  region: string;
  timezone: string;
  city: string;
  ll: [number, number];
  metro: number;
  area: number;
}

export type handleResponseArgType = {
  res: Response;
  data?: any;
  status?: number;
  err?: any;
  message?: string;
};

export type handleSessionResArgType = {
  res: Response;
  session: ClientSession;
  data?: any;
  status?: number;
  err?: any;
  message?: string;
};
