import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { networkConfig } from "../helper-hardhat-config";

module.exports = async ({
	getNamedAccounts,
	deployments,
}: HardhatRuntimeEnvironment) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId!;

	const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [],
		log: true,
	});
};
