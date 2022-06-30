
# About database connectivity

- At first create database in mongoDB and get connection string. Modify it with your password and database name.
- Go to 'db' folder inside it there is connect.js file, follow that code and use connection string their. I have passed that string by puting boilerplate code inside custom function connectDB but one can also use that string directly in that code.
- Define the attributes of table, for that inside 'models' folder there are schemas of 3 different tables. 
- Now simply import whatever table(schema) you want to manipulate and by creating first record in that table, automatically a collection(table in mongoDB) will be created under your database name.

# About passport.js file

- As we have used slack login in this web app in order to use third party(here slack api) authorization service passport.js leverages with the code to implement the same.

# About certificate folder

- To implement slack login it is required that the app's url must be https and not http. So to convert http://localhost to https://localhost SSL(secure socket layer) is required and the keys inside that folder is used to convert http to https.

