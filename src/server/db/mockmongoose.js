// @flow
// @format

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import {Mockgoose} from 'mockgoose';
export default new Mockgoose(mongoose);
