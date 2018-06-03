// @flow
// @format

import mongoose from 'mongoose';

import {Mockgoose} from 'mockgoose';

mongoose.Promise = global.Promise;
export default new Mockgoose(mongoose);
