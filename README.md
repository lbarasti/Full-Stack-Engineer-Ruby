# Live demo
https://fathomless-garden-24329.herokuapp.com/

# Running locally
```
bundle install
npm run build
bundle exec puma -C config/puma.rb --port 5555
```
The application is served at localhost:5555

# Development
```
bundle exec rackup --port 5555 # runs the ruby server
npm start # webpack dev-server will proxy all requests to localhost 5555
```
Any change to the js files under `./src` will be hot-reloaded at `localhost:8080` - mind that the port is 8080.

Changes to the server side of the application require a server restart.

# Test
A minimal set of tests is defined under `./test`. You can run them via 
```
bundle exec ruby test/*
```
A local instance of Redis must be running in order for the tests to pass.

# Deploying to Heroku
```
git checkout deploy
git merge master
npm run build
git add dist/bundle.js
git commit -m "Update client application"
git push heroku deploy:master
```
