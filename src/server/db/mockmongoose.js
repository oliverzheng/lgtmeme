// @flow
// @format

import mongoose from 'mongoose';

import {Mockgoose} from 'mockgoose'; // eslint-disable-line import/no-extraneous-dependencies

mongoose.Promise = global.Promise;
export default new Mockgoose(mongoose);
