#!/bin/bash

cat netlify.toml

echo "BEFOREEEEEEEEEEEE"

sed -i s/MONGODB_HOST_PLACEHOLDER/$MONGODB_HOST/g netlify.toml
sed -i s/MONGODB_PORT_PLACEHOLDER/$MONGODB_PORT/g netlify.toml
sed -i s/MONGODB_USER_PLACEHOLDER/$MONGODB_USER/g netlify.toml
sed -i s/MONGODB_PASS_PLACEHOLDER/$MONGODB_PASS/g netlify.toml
sed -i s/MONGODB_DB_PLACEHOLDER/$MONGODB_DB/g netlify.toml
sed -i s/S3_BUCKET_NAME_PLACEHOLDER/$S3_BUCKET_NAME/g netlify.toml
sed -i s/S3_REGION_PLACEHOLDER/$S3_REGION/g netlify.toml
sed -i s/S3_ACCESS_KEY_ID_PLACEHOLDER/$S3_ACCESS_KEY_ID/g netlify.toml
sed -i s/S3_SECRET_ACCESS_KEY_PLACEHOLDER/$S3_SECRET_ACCESS_KEY/g netlify.toml

echo "AFTERRRRRRRRRR"

cat netlify.toml

echo $MONGODB_HOST
