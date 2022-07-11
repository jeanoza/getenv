## GetEnv

Simple lib to get datas about a client's hardware capabilities

## How To : 

Simply add [env.js](./env.js) and [ua-parser](./ua-parser.min.js) to your project.
To call it simply call GetEnv function

```js
    // callback way
    GetEnv(data => {
        //use data
    })

    // await way
    let data = await GetEnv()

    // async way
    GetEnv().then(data => {
        //use data
    })
```


### return data object type definition

```js

{
    es_version: string
    monitor: {
        capacity: {
            width: number,
            height: number
        },
        current: {
            width: number,
            height: number
        }
    },
    connection: {
        network: string,
        round_trip_time: number
    },
    gpu: {
        gl_renderer: string
        gl_vendor: string,
        renderer: string
        vendor: string
    },
    memory: {
        limit_heap_byte: number,
        total_heap_percent: number,
        used_heap_percent: number
    },
    camera: false,
    language: string,
    _3dEnabled: true,
    _arEnabled: false,
    ua: string,
    browser: {
        name: string
        version: string,
        major: string
    },
    engine: {
        name: string,
        version: string
    },
    os: {
        name: string,
        version: string,
    },
    device: {},
    cpu: {
        architecture: string
    }
}
``` 