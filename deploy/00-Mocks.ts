import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { networkConfig, developmentChains } from "../helper-hardhat-config";

// ! THESE ARE THE ARGS FOR THE CONSTRUCTOR ARGS OF MOCKV3AGGREGATOR
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

const deployMocks: DeployFunction = async ({
	getNamedAccounts,
	deployments,
}: HardhatRuntimeEnvironment) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	if (developmentChains.includes(network.name)) {
		log("Local network detected, deploying mocks ...");

		await deploy("MockV3Aggregator", {
			contract: "MockV3Aggregator",
			from: deployer,
			log: true,
			args: [DECIMALS, INITIAL_ANSWER],
		});

		log("Mocks deployed");
		log("---------------------------------------------------------------");
	}
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
