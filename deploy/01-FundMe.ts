import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployFundMe: DeployFunction = async ({
	getNamedAccounts,
	deployments,
}: HardhatRuntimeEnvironment) => {
	const { deploy, log, get } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId!;

	let ethUsdPriceFeedAddress;

	if (developmentChains.includes(network.name)) {
		const ethUsdAggregator = await get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	} else {
		ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
	}

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [ethUsdPriceFeedAddress], // ! ARGS NEEDED FOR CONTRACT CONSTRUCTOR
		log: true,
		waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
	});

	if (
		!developmentChains.includes(network.name) &&
		process.env.ETHERSCAN_API_KEY
	) {
		await verify(fundMe.address, [ethUsdPriceFeedAddress]);
	}

	log("------------------------------------------------------------");
};

export default deployFundMe;
deployFundMe.tags = ["all", "fundme"];
