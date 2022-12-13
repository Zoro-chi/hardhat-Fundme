import { ethers, getNamedAccounts } from "hardhat";

const main = async () => {
	const { deployer } = await getNamedAccounts();
	const fundMe = await ethers.getContract("FundMe", deployer);
	console.log("Funding");
	const txResponse = await fundMe.withdraw();
	await txResponse.wait(1);
	console.log("Funds withdrawn");
};

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
