# courses-app

Full-stack application which was developed during passing Node JS course by Vladilen Minin

### Stack
1. Node JS
2. Express
3. Mongoose
4. Handlebars

### Link to course:
https://www.udemy.com/course/nodejs-full-guide/learn/lecture/18396814#overview

### Demo:
https://d-shmaliuk-node-js-course.herokuapp.com/

### Development
1. Clone project.
2. Run command `npm ci` ( use Node JS 14 or higher )
3. Create `keys.dev.js` file in `keys` folder.
4. Paste configuration like this:
  ```
  module.exports = {
    SENDGRID_KEY: 'access token of sengrid',
    MONGODB_URI: 'access token of mongodb',
    SESSION_SECRET: 'some random key to hash session',
    BASE_EMAIL: 'sender email( should register by sendgird )',
    BASE_URL: `http://127.0.0.1:${process.env.PORT}`,
  }
  ```
  5. Run command `npm run dev`
