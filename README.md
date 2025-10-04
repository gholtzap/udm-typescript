# udm-typescript

This is a typescript implementation of 3GPP's UDM specification. The most recent specification can be found [here](https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3342).

**This repo is not production-ready yet. I am still developing the core features.**

Here is the current status:

| Status | Service | Implementation |
|--------|---------|----------------|
| 🟡 | nudm-ee | local storage implementation |
| 🟡 | nudm-mt | local storage implementation |
| 🟡 | nudm-niddau | local storage implementation |
| 🟡 | nudm-pp | local storage implementation |
| 🔴 | nudm-rsds | scaffolding |
| 🔴 | nudm-sdm | scaffolding |
| 🔴 | nudm-ssau | scaffolding |
| 🔴 | nudm-ueau | scaffolding |
| 🔴 | nudm-uecm | scaffolding |
| 🔴 | nudm-ueid | scaffolding |


### How to start this project
1. `npm install`
2. `npm run dev`

#### Run tests
1. `npm test`

My testing framework of choice is Mocha.