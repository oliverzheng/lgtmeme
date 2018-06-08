// @flow
// @format
import '@babel/polyfill';
import {graphqlLambda} from 'apollo-server-lambda';
import mongoose from 'mongoose';
import {connect} from '../db';
import {createSchema} from '../graphql';
import S3Storage from '../storage/S3Storage';
import S3StorageConfig from '../storage/S3StorageConfig';

const s3Storage = new S3Storage(
  S3StorageConfig.BUCKET_NAME,
  S3StorageConfig.REGION,
  S3StorageConfig.ACCESS_KEY_ID,
  S3StorageConfig.SECRET_ACCESS_KEY,
);

connect();
const schema = createSchema(mongoose.connection, s3Storage);
const handler = graphqlLambda({schema});
export {handler};
