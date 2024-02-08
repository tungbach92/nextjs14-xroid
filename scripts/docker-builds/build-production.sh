BUILD_NAME="test-production"
docker build -t $BUILD_NAME -f ../../Dockerfile ../../
npx kill-port 1222
docker run -it --rm -p 1222:8080 $BUILD_NAME
