# UDM

**This repo is not production-ready yet. I am still developing the core features.**

The UDM is a core part of 5G architecture, as it stores subscriber data (profiles, keys, subscription). It is essentially a database-backed REST API.

`udm-typescript` is a typescript implementation of 3GPP's 5G UDM specification. The most recent specification can be found [here](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342).


### pre-reqs

1. Set up MongoDB

in ``.env``:
```
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=nrf
PORT=8080
```

### Start UDM
1. `npm install`
2. `npm run dev`

#### Run tests
1. `npm test`

My testing framework of choice is Mocha.
