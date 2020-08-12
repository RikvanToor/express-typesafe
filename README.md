# express-typesafe

This repository contains some personal experiments with type-level programming in Typescript, mostly making use of [ts-toolbelt](https://github.com/millsp/ts-toolbelt).
The end goal, which may or may not be ever reached, is to build an abstraction layer over [Express](https://expressjs.com/) to build fully type-safe REST APIs, largely inspired by Haskell's [Servant](https://github.com/haskell-servant/).

Ideally, we would write something like this:

```typescript
interface User {
  id: number
  name: string
}

const getUser: Endpoint<["api", "users", Capture<"id">, Handler<GET, [Response<200, User>, Response<404, string>]>>
// This type evaluates to (string) => [200, User] | [404, string]
  = (id: string) => {
    if (+id === 1) {
      return [200, { id: 1, name: 'Test user' }];
    } else {
      return [404, 'User not found'];
    }
  }
```

and have this generate the following code for Express:

```typescript
app.get('/users/:id', (req, res) => {
  const [code, res] = getUser(req.params.id);
  res.status(code).json(res);
});
```
