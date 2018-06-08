// @flow
// @format
import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import mongoose from 'mongoose';
import {connect} from '../db';
import {createSchema} from '../graphql';

connect();
const schema = createSchema(mongoose.connection);
const handler = graphqlLambda({schema});
export {handler};
