export interface networkConfigItem {
	name?: string;
	ethUsdPriceFeed?: string;
	blockConfirmations?: number;
}

export interface networkConfigInfo {
	[key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
	5: {
		name: "goerli",
		ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
	},
	137: {
		name: "polygon",
		ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
	},
	// 31337 hardhat network chain ID
};

module.exports = {
	networkConfig,
};
