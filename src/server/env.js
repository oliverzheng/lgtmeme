// @flow
// @format

import nullthrows from 'nullthrows';
import { config } from 'dotenv';

config();

export const SERVER_PORT: string = nullthrows(process.env.SERVER_PORT);

export const MONGODB_HOST: string = nullthrows(process.env.MONGODB_HOST);
export const MONGODB_PORT: string = nullthrows(process.env.MONGODB_PORT);
export const MONGODB_USER: string = nullthrows(process.env.MONGODB_USER);
export const MONGODB_PASS: string = nullthrows(process.env.MONGODB_PASS);
export const MONGODB_DB: string = nullthrows(process.env.MONGODB_DB);
