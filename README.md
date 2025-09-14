# URL Shortener API Project

## 🧱 Tech Stack Use

- `Node.js` for backend development
- `pnpm` as the package manager
- `express` to create REST API's
- `Typescript` as the scripting language
- `Zod` for input validation
- `jsonwebtoken` to create unique token for the user
- `nanoid` to create short unique string for the URL
- `docker` to execute the database locally
- `drizzle` as the ORM
- `postgres` as the SQL database
- `Postman` for testing API routes

---
## Steps to execute the project

```bash
git clone https://github.com/shravanchinchkar/URL_Shortner.git
```

```bash
 pnpm install
```

```bash
docker compose up -d
```

`(Migrate the schema to the database)`

```bash
 pnpm db:push
```

`(Launch a postgres Database UI)`

```bash
pnpm db:studio
```

`(Execute in new terminal. Runs the local server i.e. starts the project locally)`

```bash
pnpm dev
```
---



## Auth Routes

| Method | Endpoint       | Description             | Auth Required |
| ------ | -------------- | ----------------------- | ------------- |
| POST   | `/user/signup` | Register a new user     | ❌            |
| POST   | `/user/login`  | Login and receive token | ❌            |

## URL Routes

| Method | Endpoint          | Description                                           | Auth Required |
| ------ | ----------------- | ----------------------------------------------------- | ------------- |
| POST   | `/url/shorten`    | Create a short URL from a long one                    | ✅            |
| GET    | `/url/:shortCode` | Redirect to the original URL                          | ❌            |
| GET    | `/url/codes`      | Get all URLs created by the logged-in user            | ✅            |
| DELETE | `/url/:id`        | Delete a short URL (if it belongs to user)            | ✅            |
| PATCH  | `/url/:id`        | Update the shortCode of the specific url using its Id | ✅            |
