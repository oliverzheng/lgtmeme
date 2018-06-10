#!/bin/bash

cat netlify.toml

echo "BEFOREEEEEEEEEEEE"

sed -i s/MONGODB_HOST_PLACEHOLDER/$BUILD_MONGODB_HOST/g netlify.toml
sed -i s/MONGODB_PORT_PLACEHOLDER/$BUILD_MONGODB_PORT/g netlify.toml
sed -i s/MONGODB_USER_PLACEHOLDER/$BUILD_MONGODB_USER/g netlify.toml
sed -i s/MONGODB_PASS_PLACEHOLDER/$BUILD_MONGODB_PASS/g netlify.toml
sed -i s/MONGODB_DB_PLACEHOLDER/$BUILD_MONGODB_DB/g netlify.toml
sed -i s/S3_BUCKET_NAME_PLACEHOLDER/$BUILD_S3_BUCKET_NAME/g netlify.toml
sed -i s/S3_REGION_PLACEHOLDER/$BUILD_S3_REGION/g netlify.toml
sed -i s/S3_ACCESS_KEY_ID_PLACEHOLDER/$BUILD_S3_ACCESS_KEY_ID/g netlify.toml
sed -i s/S3_SECRET_ACCESS_KEY_PLACEHOLDER/$BUILD_S3_SECRET_ACCESS_KEY/g netlify.toml

echo "AFTERRRRRRRRRR"

cat netlify.toml

echo $BUILD_MONGODB_HOST
