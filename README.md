# A Crowd funding Smart Contract

This project demonstrates a basic fund me contract, which has been developed through hardhat.

# Getting started:

```shell
yarn install
```

# Hardhat commands 
```shell
yarn hardhat help
yarn hardhat test
REPORT_GAS=true npx hardhat test
yarn hardhat node
yarn hardhat deploy
```
Without a Frontend, the contract can be interacted with programatically, After deploying the contract;

Funding can be made by running:
```shell
yarn hardhat run scripts/fund.ts
```

Withdrawals can be made by running:
```shell
yarn hardhat run scripts/withdraw.ts
```

Gas expenditures are printed after every test with hardhat-gas-reporter, to be able to write gas effecient contracts.
