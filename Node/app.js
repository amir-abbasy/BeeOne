var bnb = "0x133c4776c5bd093ae48bd585fcf21f86e08a02d4" //BNB
var pk = "f6dc1b42b4077baeaf78983e108c342604aa3658bf77c0b1840e710de6fd574e" //p-key

const { ethers } = require("ethers");  // Use 'require' for ethers v5

// BSC Testnet configuration
const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
const privateKey = pk;  // Replace with your wallet's private key
const wallet = new ethers.Wallet(privateKey, provider);

// Contract addresses
const PANCAKESWAP_V2_ROUTER_ADDRESS = '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3'; // PancakeSwap Testnet Router
const BEE_TOKEN_ADDRESS = '0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48'; // Replace with your BeeToken testnet contract address
// const WBNB_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'; // Testnet WBNB token address

// ERC-20 ABI for approval
const abiERC20 = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    // balanceOf method
    "function balanceOf(address owner) view returns (uint256)",
    // decimals method
    "function decimals() view returns (uint8)"
];

// PancakeSwap V2 Router ABI for adding liquidity
const abiRouter = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
];

(async () => {
    try {


        // Step 1: Approve the PancakeSwap Router to spend your BeeToken
        const beeTokenContract = new ethers.Contract(BEE_TOKEN_ADDRESS, abiERC20, wallet);


        // Function to get the balance of the contract
        // async function getContractBalance(address) {
        //     try {
        //         // Get the balance in Wei
        //         const balance = await provider.getBalance(address);

        //         // Convert the balance from Wei to Ether
        //         const balanceInEth = ethers.utils.formatEther(balance);

        //         console.log(`Balance of contract ${address}: ${balanceInEth} ETH`);


        //         const myToken = await beeTokenContract.balanceOf(address);

        //         // Get the number of decimals used by the token (most ERC-20 tokens use 18, but it can vary)
        //         const decimals = await beeTokenContract.decimals();

        //         // Convert the balance to a human-readable format
        //         const formattedBalance = ethers.utils.formatUnits(myToken, decimals);

        //         console.log(`Balance of address ${address}: ${formattedBalance} tokens`);

        //     } catch (error) {
        //         console.error(`Error getting contract balance: ${error}`);
        //     }
        // }

        // // Call the function
        // await getContractBalance("0x133c4776c5bd093AE48bd585fcF21f86e08a02D4");

        const gasPrice = await provider.getGasPrice();  // Get current gas price



        const amountToApprove = ethers.utils.parseUnits("100.0", 18);  // Amount of BeeToken you want to approve
        console.log("Approving BeeToken...");

        const approvalTx = await beeTokenContract.approve(PANCAKESWAP_V2_ROUTER_ADDRESS, amountToApprove, { gasLimit: 500000, gasPrice: gasPrice.mul(2) });  // Set a higher gas limit and price
        await approvalTx.wait();
        console.log("Approval transaction hash:", approvalTx.hash);

        // Step 2: Add liquidity to the BeeToken/BNB pool on PancakeSwap
        const routerContract = new ethers.Contract(PANCAKESWAP_V2_ROUTER_ADDRESS, abiRouter, wallet);

        const tokenAmount = ethers.utils.parseUnits("10.0", 18);  // Amount of BeeToken to add
        const minTokenAmount = ethers.utils.parseUnits("9.5", 18);  // Minimum BeeToken to accept (slippage)
        const minBNBAmount = ethers.utils.parseUnits("0.005", 8);  // Minimum BNB to accept (slippage)
        const recipient = wallet.address;  // Your wallet address to receive liquidity tokens
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 20 minutes from the current time

        console.log("Adding liquidity to BeeToken/BNB pool...");

        const tx = await routerContract.addLiquidityETH(
            BEE_TOKEN_ADDRESS,   // BeeToken address
            tokenAmount,         // Amount of BeeToken to add
            minTokenAmount,      // Minimum BeeToken to accept (slippage protection)
            minBNBAmount,        // Minimum BNB to accept (slippage protection)
            recipient,           // Recipient address (your wallet)
            deadline,            // Deadline for the transaction (20 minutes)
            {
                value: ethers.utils.parseUnits("0.05", 8)  // Amount of BNB to add (must be sent as value)
            }
        );

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();
        console.log({ receipt })
        console.log("Liquidity added successfully! Transaction hash:", tx.hash);

    } catch (error) {
        console.log("catch----", error);

    }
})();

