# CHAP Frontend Monorepo

The CHAP Frontend Monorepo is designed to serve two applications: a DHIS2 app named Prediction App and a Standalone Visualizer App named chap-eval designed to be used by those who are running CHAP without DHIS2. The monorepo includes common React components that are shared between the two applications.


## About

- This monorepo use React v18.3.1
- Start by running "yarn install" at root level
- Go to *packages/chap-lib* and run "yarn build" or "yarn watch" (to watch changes)
- Go to *packages/[APP_FOLDER_NAME]* and run "yarn start"