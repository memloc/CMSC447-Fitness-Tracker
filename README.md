# CMSC-447-FitnessTracker

## Dependencies

Install node and ensure that the version is greater or equal to v20.9.0 (LTS). If your version is before version v20.9.0 then you can update node or install `n` via `npm` to manage your node version and run the following commands with administrator privilege.
```sh
npm cache clean -f
npm install -g n
n 20.9.0
```

## Building

1. Clone the repository and install node modules for project root
```sh
git clone git@github.com:memloc/CMSC447-Fitness-Tracker.git
cd CMSC447-Fitness-Tracker
npm install
```

2. Run the following setup script to install client and server dependencies
```
npm run setup
```

3. Copy your `config.env` to the server directory with your atlas db connection string resembling the following format
```
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.<projectId>.mongodb.net/employees?retryWrites=true&w=majority
PORT=5050
```

4. Run the following from the project root directory to start the client and server
```
npm run dev
```
