## GetEnv

Simple lib to get datas about a client's hardware capabilities

## How To : 

Simply add [env.js](./env.js) and [ua-parser](./ua-parser.min.js) to your project.
To call it simply call GetEnv function

```js
    // callback way
    GetEnv(data => {})

    // await way
    let data = await GetEnv()

    // async way
    GetEnv().then(data => {})
```

## TODO : 

- Add documentation comment to GetEnv function and it's returned datas
- Refactorization
- Add more data (asked from Clement)
- Try to get rid of ui-parser ?