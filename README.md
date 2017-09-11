# aws-lambda-graphql

Serverless Pattern:
https://cloudacademy.com/blog/how-to-write-graphql-apps-using-aws-lambda/

Auth Pattern:
https://docs.scaphold.io/tutorials/authentication-in-graphql/

Sequalize Steps:
1. createdb graphql-lambda (creates database)
2. sequelize model:create --name Book --attributes "title:string" (create model)
3. sequelize db:migrate (add book table to db)
4. sequelize migration:create --name "add-content" (create empty named migration file, must code up/down logic)
5. sequelize db:migrate (apply migration created in last step)
6. ---- (no command, must add any changes to the model manually after a migration)

Important PostgreSQL Commands:
- psql postgres -U root (connect to database as user)
- \l (list databases)
- \c graphql-lambda (connect to graphql-lambda database)
- \dt (list tables in connected database)
- SELECT * FROM "Books"; (simple query, sequalize will capitalize table name by default and without quotes postgreSQL will try books instead)

Current Deploy Process:
1. docker build . -t aws-linux (build from dockerfile, installs aws specific dependencies)
2. docker run -i -t aws-linux (launch container, starting server to leave container open)
3. ---- (open new terminal)
4. docker ps (print containers, copy container id of aws-linux container)
5. rm -rf node_modules/ (remove local node_modules directory)
6. docker cp ${container_id}:/app/node_modules ./node_modules (copy aws linux node_modules from container to local directory)
