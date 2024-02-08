BUILD_NAME="test-stg"
docker build -t $BUILD_NAME -f ../../Dockerfile-stg ../../
npx kill-port 1122
docker run -it --rm -p 1122:8080 $BUILD_NAME
