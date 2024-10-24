const { ethers } = require("ethers");

// BSC Testnet configuration
const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545/');
const privateKey = 'f6dc1b42b4077baeaf78983e108c342604aa3658bf77c0b1840e710de6fd574e';  // Replace with your wallet's private key
const wallet = new ethers.Wallet(privateKey, provider);

// Contract addresses
const PANCAKESWAP_V2_ROUTER_ADDRESS = '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3'; // PancakeSwap Testnet Router
const BEE_TOKEN_ADDRESS = '0x68a994Ca1861DF23d968d466bF6a7165CFaD8d48'; // Replace with your BeeToken testnet contract address
const WBNB_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'; // Testnet WBNB token address

// ERC-20 ABI for approval
const abiERC20 = [
    "function approve(address spender, uint256 amount) public returns (bool)"
];

// PancakeSwap V2 Router ABI for adding liquidity
const abiRouter = [
    "function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
];

(async () => {
    // Step 1: Approve the PancakeSwap Router to spend your BeeToken
    // const beeTokenContract = new ethers.Contract(BEE_TOKEN_ADDRESS, abiERC20, wallet);

    // const amountToApprove = ethers.utils.parseUnits("100.0", 18);  // Amount of BeeToken you want to approve
    // console.log("Approving BeeToken...");

    // // Fetch the current gas price
    // const gasPrice = await provider.getGasPrice();
    // console.log("Gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

    // // Submit the approval transaction with specified gas settings
    // const approvalTx = await beeTokenContract.approve(
    //     PANCAKESWAP_V2_ROUTER_ADDRESS, 
    //     amountToApprove, 
    //     { gasLimit: 500000, gasPrice: gasPrice.mul(2) }  // Increase gas limit and price
    // );
    // console.log("Approval transaction submitted, hash:", approvalTx.hash);

    // // Wait for the transaction confirmation
    // const receipt = await approvalTx.wait();
    // console.log("Transaction confirmed in block:", receipt.blockNumber);








     // Check balance before making the transaction
     const balance = await provider.getBalance(wallet.address);
     console.log("Wallet balance (t-BNB):", ethers.utils.formatUnits(balance, 18));
 
     // Ensure your balance is enough for the transaction
     const requiredBalance = ethers.utils.parseUnits("0.1", 18); // Amount to be added
     const gasEstimate = ethers.utils.parseUnits("0.05", 18); // Estimate gas cost
     const totalRequired = requiredBalance.add(gasEstimate);
 
     if (balance.lt(totalRequired)) {
         console.log("Insufficient funds for the transaction. Please fund your wallet or reduce the amount.");
         return; // Exit the script if funds are insufficient
     }

     

    // Step 2: Add liquidity to the BeeToken/BNB pool on PancakeSwap
    const routerContract = new ethers.Contract(PANCAKESWAP_V2_ROUTER_ADDRESS, abiRouter, wallet);

    const tokenAmount = ethers.utils.parseUnits("10.0", 18);  // Amount of BeeToken to add
    const minTokenAmount = ethers.utils.parseUnits("9.5", 18);  // Minimum BeeToken to accept (slippage)
    const minBNBAmount = ethers.utils.parseUnits("0.05", 18);  // Minimum BNB to accept (slippage)
    const recipient = wallet.address;  // Your wallet address to receive liquidity tokens
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 20 minutes from the current time

    console.log("Adding liquidity to BeeToken/BNB pool...");

   
    try {
        const tx = await routerContract.addLiquidityETH(
            BEE_TOKEN_ADDRESS,   // BeeToken address
            tokenAmount,         // Amount of BeeToken to add
            minTokenAmount,      // Minimum BeeToken to accept (slippage protection)
            minBNBAmount,        // Minimum BNB to accept (slippage protection)
            recipient,           // Recipient address (your wallet)
            deadline,            // Deadline for the transaction (20 minutes)
            {
                value: ethers.utils.parseUnits("0.1", 18),  // Amount of BNB to add (must be sent as value)
                gasLimit: 300000 // Increase gas limit if needed
            }
        );

        const liquidityReceipt = await tx.wait();
        console.log({ liquidityReceipt });
        console.log("Liquidity added successfully! Transaction hash:", tx.hash);


    } catch (error) {
        console.error("Error occurred during transaction:", error.message || error);
    }

})();
