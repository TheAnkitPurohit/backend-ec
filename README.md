# Project Name

Project Name

### Prerequisites

- Install yarn as global dependency.
- Node 18 and above only.
- No NPM, Only Yarn.
- Don't Disable ESLint & Prettier.
- Try to follow the rules as much as you can.
- For pagination follow Aggregation Only.

### Installing

1. yarn
2. fill all the .env and config details
3. uncomment .env lines from .gitignore file
4. `yarn start` to run the project ( `yarn start:dev` for development )

### Environment Variables

| VARIABLE NAME | DEFAULT VALUE | DESCRIPTION                                           |
|---------------|---------------|-------------------------------------------------------|
| -             | -             | Too Many, so skipping it, please check in .env files. |

### Config & ENV

1. Add Mailtrap or Gmail Details in .env
2. Add S3 Details in .env
3. Add firebase details in .env and fill firebase.json

### Features

1. Fully function-based
2. Global error controller that catches every error
3. No need of try-catch in async-await, it will automatically be handled by the error controller
4. Special function to throw the error in between execution
5. Token encryption with logs in DB
6. Stateless backend
7. Pug as the view engine
8. Strict formatting and linting
9. Access multiple databases with a single function
10. Fields rules ( production only )
11. Added Mailtrap and google mailer ( follow the README.md for the setup )
12. Network status code functionality
13. built-in roles management and FCM Integration
14. Fully Typed code with help of Typescript
15. Built in localization
16. Built in maintenance mode
17. Built in winston logger support

### MODES OF ENVS

1. ERROR_MODE: If it's in development then it will give you the stack trace of error else it will not.
2. EMAIL_MODE: Specify which environment you want to choose Mailtrap SMTP / Google SMTP.
3. RULES_MODE: If it's ON then It will only allow to pass specified fields in response ( please check rules.controller.ts )
4. SECURE_MODE: If it's ON then you need to pass the private & public certificates in the certificates folder only.

### Gmail Steps

> Watch Video: https://www.youtube.com/watch?v=-rcRf7yswfM&ab_channel=yoursTRULY

If you are getting this error

> The developer hasn’t given you access to this app

then add that email id into the tested user.

### Project Routes

FRONT_URL: http://localhost:8000/api/front

CMS_URL: http://localhost:8000/api/cms

### Update

Nisharg Shah

16/08/2023
