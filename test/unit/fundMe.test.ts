import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert, expect } from "chai";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { developmentChains } from "../../helper-hardhat-config";
import { BigNumber } from "ethers";

//! IMPORTANT: .add() and .mul() are for BigNumber as we cant use + and *

describe("FundMe", async () => {
	let fundMe: FundMe;
	let deployer: string;
	let mockV3Aggregator: MockV3Aggregator;
	const sendVal = ethers.utils.parseEther("1"); //1 ETH

	beforeEach(async () => {
		// deploy fundMe contract with hardhat-deploy

		deployer = (await getNamedAccounts()).deployer;
		// const accounts = await ethers.getSigners();
		// deployer = accounts[0];
		await deployments.fixture(["all"]);
		fundMe = await ethers.getContract("FundMe");
		mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
	});

	describe("Constructor", async () => {
		it("sets the aggregator addresses correctly", async () => {
			const response = await fundMe.getPriceFeed();
			assert.equal(response, mockV3Aggregator.address);
		});
	});

	describe("Fund", async () => {
		it("Fails if not enough ETH is sent", async () => {
			await expect(fundMe.fund()).to.be.reverted;
		});
		it("Updates the amount funded array", async () => {
			await fundMe.fund({ value: sendVal });
			const response = await fundMe.getAddressToAmountFunded(deployer);
			assert.equal(response.toString(), sendVal.toString());
		});
		it("Adds funders to funders array", async () => {
			await fundMe.fund({ value: sendVal });
			const funder = await fundMe.getFunders(0);
			assert.equal(funder, deployer);
		});
	});

	describe("Withdraw", async () => {
		beforeEach(async () => {
			await fundMe.fund({ value: sendVal });
		});
		it("Withdraw ETH from a single founder", async () => {
			// Arrange
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);
			// Act
			const txResponse = await fundMe.withdraw();
			const txReciept = await txResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = txReciept;
			const gasCost = gasUsed.mul(effectiveGasPrice);
			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
			// Assert
			assert.equal(endingFundMeBalance.toString(), "0");
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);
		});
		it("Allows us to withdraw with multiple funders", async () => {
			// Arrange
			const accounts = await ethers.getSigners();
			for (let i = 1; i < 6; i++) {
				const fundMeConnectedContract = await fundMe.connect(accounts[i]);
				await fundMeConnectedContract.fund({ value: sendVal });
			}
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);
			// Act
			const txResponse = await fundMe.withdraw();
			const txReciept = await txResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = txReciept;
			const gasCost = gasUsed.mul(effectiveGasPrice);
			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
			// Assert
			assert.equal(endingFundMeBalance.toString(), "0");
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);
			// Make sure funders array is reset properly
			await expect(fundMe.getFunders(0)).to.be.reverted;
			for (let i = 1; i < 6; i++) {
				assert.equal(
					await (
						await fundMe.getAddressToAmountFunded(accounts[i].address)
					).toNumber(),
					0
				);
			}
		});
		it("Only allows the owner to withdraw", async () => {
			const accounts: any = await ethers.getSigners();
			const attacker = accounts[1];
			const attackerConnectedContract = await fundMe.connect(attacker);
			await expect(attackerConnectedContract.withdraw()).to.be.reverted;
		});
		it("Testing cheaper withdraw", async () => {
			// Arrange
			const accounts = await ethers.getSigners();
			for (let i = 1; i < 6; i++) {
				const fundMeConnectedContract = await fundMe.connect(accounts[i]);
				await fundMeConnectedContract.fund({ value: sendVal });
			}
			const startingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const startingDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);
			// Act
			const txResponse = await fundMe.cheaperWithdraw();
			const txReciept = await txResponse.wait(1);
			const { gasUsed, effectiveGasPrice } = txReciept;
			const gasCost = gasUsed.mul(effectiveGasPrice);
			const endingFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
			// Assert
			assert.equal(endingFundMeBalance.toString(), "0");
			assert.equal(
				startingFundMeBalance.add(startingDeployerBalance).toString(),
				endingDeployerBalance.add(gasCost).toString()
			);
			// Make sure funders array is reset properly
			await expect(fundMe.getFunders(0)).to.be.reverted;
			for (let i = 1; i < 6; i++) {
				assert.equal(
					await (
						await fundMe.getAddressToAmountFunded(accounts[i].address)
					).toNumber(),
					0
				);
			}
		});
	});
});
