# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

[urlhere]

Project Overview:
NC News is a backend API that serves data on articles, users, topics, and comments. It allows users to view articles, filter by topic, submit comments, and vote on articles.
Built with Node.js, Express, and PostgreSQL.

System Requirements:
Node.js v18+
PostgreSQL v14+

Installation and setup:

1. Clone the repository:
   git clone https://github.com/Alsamri/nc_project_news.git

2.Install dependencies:
npm install

3. Configure Environment Variables:
   create the config files in the project root (Ensure these files are listed in .gitignore.)
   .env.development
   PGDATABASE=nc_news

   .env.test
   PGDATABASE=nc_news_test

4. create and run the database:
   1- npm run setup-dbs
   2- npm run seed

5.running tests:
npm test

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
