const NFTAddress = "0xe5e3F56D06cC003B2d2f6eCdb89A2e9aDbB38056"; // Alamat kontrak NFT
const LiquidityPoolAddress = "0x4FA264E6491b7ed420540f24021d89EedB340a76"; // Alamat kontrak Liquidity Pool (LP token)
const StakingAddress = "0x6B67007e1C158caDAa4553A5B349051E3C6aEce9"; // Alamat kontrak Staking (Liquidity Pool)
const StakingOSSAddress = "0x28774F2d350BAA80B098b8da0905dEACA9905b8a"; // Alamat kontrak StakingOSS yang bener
const UsdtTokenAddress = "0x581711F99DaFf0db829B77b9c20b85C697d79b5E"; // Alamat kontrak USDT
const MultiSenderAddress = "0x6B67007e1C158caDAa4553A5B349051E3C6aEce9"; // Alamat kontrak MultiSender

let provider;
let signer;
let userAddress;
let NFTContract;
let LiquidityPoolContract;
let StakingContract;
let StakingOSSContract;
let UsdtTokenContract;
let MultiSenderContract;

const NFTABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function mintNFT(address recipient) returns (uint256)"
];

const LiquidityPoolABI = [
  "function getReserves() view returns (uint256, uint256)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function addLiquidity(uint256 usdtAmount) payable returns (uint256)",
  "function removeLiquidity(uint256 liquidity) returns (uint256, uint256)"
];

const StakingABI = [
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function stakedBalance(address user) view returns (uint256)",
  "function getPendingRewards(address user) view returns (uint256)"
];

const StakingOSSABI = [
  "function stake() payable",
  "function unstake(uint256 amount)",
  "function getStake(address user) view returns (uint256)",
  "function withdraw()"
];

const UsdtTokenABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)"
];

const MultiSenderABI = [
  "function multiSend(address token, address[] recipients, uint256[] amounts)",
  "function multiSendETH(address[] recipients, uint256[] amounts) payable"
];

const DEFAULT_GAS_LIMIT = 500000;
let recentTransactions = [];

function showAlert(message, isError = true) {
  const alert = document.getElementById("alert");
  const alertMessage = document.getElementById("alert-message");
  const alertIcon = document.getElementById("alert-icon");
  alertMessage.innerHTML = message;
  alertIcon.className = isError
    ? "w-6 h-6 text-red-500"
    : "w-6 h-6 text-green-500";
  alertIcon.innerHTML = isError
    ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 3c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>`
    : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
  alert.classList.remove("hidden");
}

document.getElementById("close-alert").addEventListener("click", () => {
  document.getElementById("alert").classList.add("hidden");
});

// Fungsi buat pop-up pending transaksi
function showPendingTransaction(title) {
  const pendingPopup = document.getElementById("pending-transaction");
  const pendingTitle = document.getElementById("pending-title");
  pendingTitle.textContent = title;
  pendingPopup.classList.remove("hidden");
}

function hidePendingTransaction() {
  const pendingPopup = document.getElementById("pending-transaction");
  pendingPopup.classList.add("hidden");
}

document.getElementById("close-pending").addEventListener("click", () => {
  hidePendingTransaction();
});

function logAction(action, details) {
  recentTransactions.unshift({
    action,
    txHash: details.txHash,
    from: userAddress,
    ...details
  });
  recentTransactions = recentTransactions.slice(0, 50);
  updateRecentTxModal();
}

function updateRecentTxModal() {
  const recentTxList = document.getElementById("recent-tx-list");
  recentTxList.innerHTML = "";
  if (recentTransactions.length === 0) {
    recentTxList.innerHTML = "<p>No recent transactions.</p>";
  } else {
    recentTransactions.slice(0, 10).forEach(tx => {
      const div = document.createElement("div");
      div.className = "border-b border-gray-200 py-2";
      div.innerHTML = `
        <p class="text-gray-700">${tx.action}</p>
        <p class="text-gray-600 text-sm">Tx Hash: <a href="https://sepolia.tea.xyz/tx/${tx.txHash}" target="_blank" rel="noopener noreferrer" class="view-explorer">${tx.txHash.slice(0, 10)}...</a></p>
      `;
      recentTxList.appendChild(div);
    });
  }
}

document.getElementById("recent-tx-btn").addEventListener("click", () => {
  updateRecentTxModal();
  document.getElementById("recent-tx-modal").classList.remove("hidden");
});

document.getElementById("close-recent-tx").addEventListener("click", () => {
  document.getElementById("recent-tx-modal").classList.add("hidden");
});

async function switchToTeaSepoliaNetwork() {
  const TEA_SEPOLIA_CHAIN_ID = "0x27ea"; // Chain ID 10218 dalam hex
  const network = await provider.getNetwork();
  if (network.chainId !== 10218) {
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: TEA_SEPOLIA_CHAIN_ID }]);
    } catch (switchError) {
      if (switchError.code === 4902 || switchError.code === -32603) {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: TEA_SEPOLIA_CHAIN_ID,
            chainName: "Tea Sepolia",
            rpcUrls: ["https://tea-sepolia.g.alchemy.com/public"],
            nativeCurrency: {
              name: "TEA",
              symbol: "TEA",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia.tea.xyz"],
          },
        ]);
      } else {
        throw switchError;
      }
    }
  }
}

async function initializeContracts() {
  const network = { chainId: 10218, name: "Tea Sepolia" };
  provider = new ethers.providers.Web3Provider(window.ethereum, network);

  NFTContract = new ethers.Contract(NFTAddress, NFTABI, signer);
  LiquidityPoolContract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI, signer);
  StakingContract = new ethers.Contract(StakingAddress, StakingABI, signer);
  StakingOSSContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, signer);
  UsdtTokenContract = new ethers.Contract(UsdtTokenAddress, UsdtTokenABI, signer);
  MultiSenderContract = new ethers.Contract(MultiSenderAddress, MultiSenderABI, signer);
}

async function updateUIAfterConnect() {
  document.getElementById("connect-wallet-section").classList.add("hidden");
  document.getElementById("wallet-info").classList.remove("hidden");
  document.getElementById("tabs-section").classList.remove("hidden");

  await updateWalletInfo();
  await refreshNFTState();
  await refreshLiquidityPoolInfo();
  await refreshStakingOSSInfo();
}

async function connectWallet(walletType) {
  try {
    if (walletType === "metamask") {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } else if (walletType === "okx") {
      if (typeof window.okxwallet === "undefined") {
        throw new Error("OKX Wallet not detected. Please install or enable OKX Wallet.");
      }
      provider = new ethers.providers.Web3Provider(window.okxwallet);
      await provider.send("eth_requestAccounts", []);
    } else {
      throw new Error("Unsupported wallet type.");
    }

    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    await switchToTeaSepoliaNetwork();
    await initializeContracts();
    await updateUIAfterConnect();
  } catch (error) {
    console.error("Error connecting wallet:", error);
    showAlert(`Failed to connect wallet: ${error.message}`);
  }
}

document.getElementById("connect-wallet").addEventListener("click", () => {
  document.getElementById("wallet-choice-modal").classList.remove("hidden");
});

document.getElementById("connect-metamask").addEventListener("click", () => {
  document.getElementById("wallet-choice-modal").classList.add("hidden");
  connectWallet("metamask");
});

document.getElementById("connect-okx").addEventListener("click", () => {
  document.getElementById("wallet-choice-modal").classList.add("hidden");
  connectWallet("okx");
});

document.getElementById("wallet-choice-close").addEventListener("click", () => {
  document.getElementById("wallet-choice-modal").classList.add("hidden");
});

async function updateWalletInfo() {
  if (!userAddress) return;
  document.getElementById("wallet-address").textContent = `Address: ${userAddress}`;
  const balance = await provider.getBalance(userAddress);
  const usdtBalance = await UsdtTokenContract.balanceOf(userAddress);
  document.getElementById("usdt-balance").textContent = `USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 18)} USDT`;
  document.getElementById("tea-balance").textContent = `TEA Balance: ${ethers.utils.formatEther(balance)} TEA`;
  document.getElementById("network").textContent = `Network: Tea Sepolia`;
}

document.getElementById("copy-address").addEventListener("click", () => {
  navigator.clipboard.writeText(userAddress);
  showAlert("Address Copied Successful", false);
});

document.getElementById("check-explorer").addEventListener("click", () => {
  window.open(`https://sepolia.tea.xyz/address/${userAddress}`, "_blank");
});

document.getElementById("disconnect-wallet").addEventListener("click", () => {
  provider = null;
  signer = null;
  userAddress = null;
  document.getElementById("wallet-info").classList.add("hidden");
  document.getElementById("tabs-section").classList.add("hidden");
  document.getElementById("connect-wallet-section").classList.remove("hidden");
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", async () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(content => content.classList.add("hidden"));
    const tabContent = document.getElementById(tab.dataset.tab);
    tabContent.classList.remove("hidden");

    if (tab.dataset.tab === "mint-nft") {
      await refreshNFTState();
    } else if (tab.dataset.tab === "liquidity-pool") {
      await refreshLiquidityPoolInfo();
    } else if (tab.dataset.tab === "staking-oss") {
      await refreshStakingOSSInfo();
    } else if (tab.dataset.tab === "checker-tea") {
      await refreshCheckerTEA();
    }
  });
});

async function refreshNFTState() {
  try {
    const userNftsList = document.getElementById("user-nfts");
    userNftsList.innerHTML = "";
    if (userAddress) {
      const balance = await NFTContract.balanceOf(userAddress);
      userNftsList.innerHTML = `<li>You own ${balance.toString()} NFTs</li>`;
    }
  } catch (error) {
    console.error("Error refreshing NFT state:", error);
    showAlert(`Failed to refresh NFT state: ${error.message}`);
  }
}

document.getElementById("refresh-nft-state").addEventListener("click", refreshNFTState);

document.getElementById("mint-btn").addEventListener("click", async () => {
  try {
    showPendingTransaction("Mint NFT");
    const mintTx = await NFTContract.mintNFT(userAddress, { gasLimit: DEFAULT_GAS_LIMIT });
    await mintTx.wait();
    showAlert("NFT Minted Successfully", false);
    logAction("Mint NFT", { txHash: mintTx.hash });
    await refreshNFTState();
  } catch (error) {
    console.error("Error minting NFT:", error);
    let errorMessage = "Failed to mint NFT: ";
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      errorMessage += "Transaction may fail or requires manual gas limit. Check if the NFT contract is correctly deployed and the mint function is accessible.";
    } else {
      errorMessage += error.message;
    }
    showAlert(errorMessage);
  } finally {
    hidePendingTransaction();
  }
});

async function addLiquidity() {
  try {
    const teaAmountInput = document.getElementById("tea-amount").value;
    const usdtAmountInput = document.getElementById("usdt-amount").value;
    const addButton = document.getElementById("add-liquidity");
    addButton.disabled = true;

    const teaAmountFloat = parseFloat(teaAmountInput);
    const usdtAmountFloat = parseFloat(usdtAmountInput);
    if (isNaN(teaAmountFloat) || teaAmountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0.");
    }
    if (isNaN(usdtAmountFloat) || usdtAmountFloat <= 0) {
      throw new Error("Please enter a valid USDT amount greater than 0.");
    }

    const MAX_UINT256 = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    const teaAmount = ethers.utils.parseEther(teaAmountInput);
    const usdtAmount = ethers.utils.parseUnits(usdtAmountInput, 18);
    if (teaAmount.gt(MAX_UINT256)) {
      throw new Error("TEA amount is too large. Please enter a smaller value.");
    }
    if (usdtAmount.gt(MAX_UINT256)) {
      throw new Error("USDT amount is too large. Please enter a smaller value.");
    }

    showPendingTransaction("Add Liquidity");

    const teaBalance = await provider.getBalance(userAddress);
    if (teaBalance.lt(teaAmount)) {
      throw new Error("Insufficient TEA balance.");
    }

    const usdtBalance = await UsdtTokenContract.balanceOf(userAddress);
    if (usdtBalance.lt(usdtAmount)) {
      throw new Error("Insufficient USDT balance.");
    }

    const reserves = await LiquidityPoolContract.getReserves();
    const teaReserveRaw = reserves[0];
    const usdtReserveRaw = reserves[1];

    const teaReserve = parseFloat(ethers.utils.formatEther(teaReserveRaw));
    const usdtReserve = parseFloat(ethers.utils.formatUnits(usdtReserveRaw, 18));

    if (teaReserve === 0 && usdtReserve === 0) {
      // Initial liquidity: no slippage check needed
    } else if (teaReserve === 0) {
      throw new Error("Cannot calculate ratio: TEA reserve is 0.");
    } else {
      const poolRatio = usdtReserve / teaReserve;
      const expectedUsdtAmountFloat = teaAmountFloat * poolRatio;
      const expectedUsdtAmount = ethers.utils.parseUnits(expectedUsdtAmountFloat.toString(), 18);
      const slippageInput = parseFloat(document.getElementById("slippage-tolerance").value) || 15;
      const slippageTolerance = Math.floor(slippageInput * 10);
      const minUsdtAmount = expectedUsdtAmount.mul(1000 - slippageTolerance).div(1000);

      if (usdtAmount.lt(minUsdtAmount)) {
        throw new Error(
          `Insufficient USDT amount. Expected at least ${ethers.utils.formatUnits(minUsdtAmount, 18)} USDT for ${teaAmountInput} TEA based on pool ratio (including slippage).`
        );
      }
    }

    const allowance = await UsdtTokenContract.allowance(userAddress, LiquidityPoolAddress);
    if (allowance.lt(usdtAmount)) {
      const approveTx = await UsdtTokenContract.approve(LiquidityPoolAddress, usdtAmount);
      await approveTx.wait();
      showAlert("USDT Approved Successfully", false);
    }

    try {
      await LiquidityPoolContract.estimateGas.addLiquidity(usdtAmount, {
        value: teaAmount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await LiquidityPoolContract.addLiquidity(usdtAmount, {
      value: teaAmount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("Liquidity Added Successfully", false);
    logAction("Add Liquidity", {
      teaAmount: teaAmount.toString(),
      usdtAmount: usdtAmount.toString(),
      txHash: tx.hash,
    });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error adding liquidity:", error);
    showAlert(`Failed to add liquidity: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("add-liquidity").disabled = false;
  }
}

document.getElementById("add-liquidity").addEventListener("click", addLiquidity);

async function removeLiquidity() {
  try {
    const liquidityInput = document.getElementById("liquidity-amount").value;
    const removeButton = document.getElementById("remove-liquidity");
    removeButton.disabled = true;

    const liquidityFloat = parseFloat(liquidityInput);
    if (isNaN(liquidityFloat) || liquidityFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0.");
    }

    const liquidity = ethers.utils.parseEther(liquidityInput);
    const userLiquidity = await LiquidityPoolContract.balanceOf(userAddress);
    if (userLiquidity.lt(liquidity)) {
      throw new Error("Insufficient LP token balance.");
    }

    showPendingTransaction("Remove Liquidity");

    try {
      await LiquidityPoolContract.estimateGas.removeLiquidity(liquidity, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await LiquidityPoolContract.removeLiquidity(liquidity, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("Liquidity Removed Successfully", false);
    logAction("Remove Liquidity", { liquidity: liquidity.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error removing liquidity:", error);
    showAlert(`Failed to remove liquidity: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("remove-liquidity").disabled = false;
  }
}

document.getElementById("remove-liquidity").addEventListener("click", removeLiquidity);

async function stakeLP() {
  try {
    const amountInput = document.getElementById("stake-lp-amount").value;
    const stakeButton = document.getElementById("stake-lp");
    stakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0.");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
    const userLiquidity = await lpTokenContract.balanceOf(userAddress);
    if (userLiquidity.lt(amount)) {
      throw new Error("Insufficient LP token balance.");
    }

    showPendingTransaction("Stake LP Tokens");

    const allowance = await lpTokenContract.allowance(userAddress, StakingAddress);
    if (allowance.lt(amount)) {
      const approveTx = await lpTokenContract.approve(StakingAddress, amount, { gasLimit: DEFAULT_GAS_LIMIT });
      await approveTx.wait();
      showAlert("LP Token Approved Successfully", false);
    }

    try {
      await StakingContract.estimateGas.stake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await StakingContract.stake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("LP Tokens Staked Successfully", false);
    logAction("Stake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error staking LP tokens:", error);
    showAlert(`Failed to stake LP tokens: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("stake-lp").disabled = false;
  }
}

document.getElementById("stake-lp").addEventListener("click", stakeLP);

async function unstakeLP() {
  try {
    const amountInput = document.getElementById("unstake-lp-amount").value;
    const unstakeButton = document.getElementById("unstake-lp");
    unstakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0.");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const userStaked = await StakingContract.stakedBalance(userAddress);
    if (userStaked.lt(amount)) {
      throw new Error("Insufficient staked LP token balance.");
    }

    showPendingTransaction("Unstake LP Tokens");

    try {
      await StakingContract.estimateGas.unstake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await StakingContract.unstake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("LP Tokens Unstaked Successfully", false);
    logAction("Unstake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error unstaking LP tokens:", error);
    showAlert(`Failed to unstake LP tokens: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("unstake-lp").disabled = false;
  }
}

document.getElementById("unstake-lp").addEventListener("click", unstakeLP);

async function refreshLiquidityPoolInfo() {
  try {
    const reserves = await LiquidityPoolContract.getReserves();
    const totalLiquidity = await LiquidityPoolContract.totalSupply();
    const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
    const userLiquidity = await lpTokenContract.balanceOf(userAddress);
    
    let userStaked, pendingRewards;
    try {
      userStaked = await StakingContract.stakedBalance(userAddress);
    } catch (error) {
      console.error("Error fetching user staked LP:", error);
      userStaked = ethers.BigNumber.from(0);
    }
    
    try {
      pendingRewards = await StakingContract.getPendingRewards(userAddress);
    } catch (error) {
      console.error("Error fetching pending rewards:", error);
      pendingRewards = ethers.BigNumber.from(0);
    }

    document.getElementById("pool-tea-reserve").textContent = `TEA Reserve: ${ethers.utils.formatEther(reserves[0])} TEA`;
    document.getElementById("pool-eth-reserve").textContent = `USDT Reserve: ${ethers.utils.formatUnits(reserves[1], 18)} USDT`;
    document.getElementById("total-liquidity").textContent = `Total Liquidity: ${ethers.utils.formatEther(totalLiquidity)} LP Tokens`;
    document.getElementById("user-liquidity").textContent = `Your Liquidity: ${ethers.utils.formatEther(userLiquidity)} LP Tokens`;
    document.getElementById("user-staked-lp").textContent = `Staked LP Balance: ${ethers.utils.formatEther(userStaked)} LP Tokens`;
    document.getElementById("user-pending-rewards").textContent = `Pending Rewards: ${ethers.utils.formatEther(pendingRewards)} TEA`;
  } catch (error) {
    console.error("Error refreshing liquidity pool info:", error);
    showAlert(`Failed to refresh liquidity pool info: ${error.message}`);
  }
}

async function multiSend() {
  try {
    const tokenAddress = document.getElementById("token-address").value;
    const addressesInput = document.getElementById("addresses").value;
    const amountsInput = document.getElementById("amounts").value;
    const sendButton = document.getElementById("multi-send-btn");
    sendButton.disabled = true;

    const addresses = addressesInput.split("\n").map(addr => addr.trim()).filter(addr => addr);
    const amountsArray = amountsInput.split(",").map(amount => amount.trim()).filter(amount => amount);

    if (addresses.length === 0) {
      throw new Error("At least one recipient address is required.");
    }

    let amounts;
    if (amountsArray.length === 1) {
      amounts = Array(addresses.length).fill(amountsArray[0]);
    } else if (amountsArray.length === addresses.length) {
      amounts = amountsArray;
    } else {
      throw new Error("Number of amounts must match number of addresses or be a single amount.");
    }

    const parsedAmounts = amounts.map(amount => {
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        throw new Error("All amounts must be greater than 0.");
      }
      return ethers.utils.parseEther(amount);
    });

    const isETH = tokenAddress.toLowerCase() === "0x0000000000000000000000000000000000000000";
    const totalAmount = parsedAmounts.reduce((sum, amount) => sum.add(amount), ethers.BigNumber.from(0));

    showPendingTransaction("Multi Send");

    if (isETH) {
      const ethBalance = await provider.getBalance(userAddress);
      if (ethBalance.lt(totalAmount)) {
        throw new Error("Insufficient TEA balance.");
      }

      try {
        await MultiSenderContract.estimateGas.multiSendETH(addresses, parsedAmounts, {
          value: totalAmount,
          gasLimit: DEFAULT_GAS_LIMIT,
        });
      } catch (gasError) {
        console.error("Gas estimation failed:", gasError);
        throw new Error(`Gas estimation failed: ${gasError.message}. The transaction might fail due to insufficient gas or contract issues.`);
      }

      const tx = await MultiSenderContract.multiSendETH(addresses, parsedAmounts, {
        value: totalAmount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      await tx.wait();
      showAlert("TEA Sent Successfully", false);
      logAction("Multi Send TEA", { token: "TEA", addresses, amounts, txHash: tx.hash });
    } else {
      // Validasi alamat token
      if (!ethers.utils.isAddress(tokenAddress)) {
        throw new Error("Invalid token address.");
      }

      // Cek apakah alamat token adalah kontrak yang valid
      const code = await provider.getCode(tokenAddress);
      if (code === "0x") {
        throw new Error("Token address is not a valid contract.");
      }

      const tokenContract = new ethers.Contract(tokenAddress, UsdtTokenABI, signer);

      // Cek apakah kontrak support fungsi balanceOf (basic ERC20 check)
      let balance;
      try {
        balance = await tokenContract.balanceOf(userAddress);
        console.log(`Token balance for ${userAddress}: ${ethers.utils.formatEther(balance)}`);
      } catch (error) {
        console.error("Error checking balanceOf:", error);
        throw new Error("Token contract does not support ERC20 standard (balanceOf failed).");
      }

      if (balance.lt(totalAmount)) {
        throw new Error(`Insufficient token balance. Required: ${ethers.utils.formatEther(totalAmount)}, Available: ${ethers.utils.formatEther(balance)}`);
      }

      // Cek allowance
      let allowance;
      try {
        allowance = await tokenContract.allowance(userAddress, MultiSenderAddress);
        console.log(`Allowance for MultiSender (${MultiSenderAddress}): ${ethers.utils.formatEther(allowance)}`);
      } catch (error) {
        console.error("Error checking allowance:", error);
        throw new Error("Failed to check allowance. Token might not support ERC20 standard.");
      }

      if (allowance.lt(totalAmount)) {
        console.log(`Approving ${ethers.utils.formatEther(totalAmount)} tokens for MultiSender...`);
        const approveTx = await tokenContract.approve(MultiSenderAddress, totalAmount, { gasLimit: DEFAULT_GAS_LIMIT });
        await approveTx.wait();
        console.log("Approval successful, tx hash:", approveTx.hash);

        // Cek ulang allowance setelah approve
        allowance = await tokenContract.allowance(userAddress, MultiSenderAddress);
        console.log(`Updated allowance: ${ethers.utils.formatEther(allowance)}`);
        if (allowance.lt(totalAmount)) {
          throw new Error(`Allowance still insufficient after approval. Required: ${ethers.utils.formatEther(totalAmount)}, Approved: ${ethers.utils.formatEther(allowance)}`);
        }
        showAlert("Token Approved Successfully", false);
      }

      // Cek apakah transferFrom bisa jalan (simulasi kecil)
      try {
        await tokenContract.estimateGas.transferFrom(userAddress, MultiSenderAddress, totalAmount);
        console.log("transferFrom simulation successful.");
      } catch (error) {
        console.error("transferFrom simulation failed:", error);
        throw new Error("Token transferFrom simulation failed. Ensure the token contract supports ERC20 standard and allowance is sufficient.");
      }

      try {
        await MultiSenderContract.estimateGas.multiSend(tokenAddress, addresses, parsedAmounts, {
          gasLimit: DEFAULT_GAS_LIMIT,
        });
        console.log("multiSend gas estimation successful.");
      } catch (gasError) {
        console.error("Gas estimation failed for multiSend:", gasError);
        let errorMessage = "Gas estimation failed: The transaction might fail.";
        if (gasError.reason) {
          errorMessage += ` Reason: ${gasError.reason}`;
        } else if (gasError.message.includes("revert")) {
          errorMessage += " Possible issues: insufficient allowance, token contract issues, or MultiSender contract logic error.";
        }
        throw new Error(errorMessage);
      }

      const tx = await MultiSenderContract.multiSend(tokenAddress, addresses, parsedAmounts, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      await tx.wait();
      showAlert("Tokens Sent Successfully", false);
      logAction("Multi Send Tokens", { token: tokenAddress, addresses, amounts, txHash: tx.hash });
    }

    await updateWalletInfo();
  } catch (error) {
    console.error("Error in multi-send:", error);
    showAlert(`Failed to send tokens: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("multi-send-btn").disabled = false;
  }
}

document.getElementById("multi-send-btn").addEventListener("click", multiSend);

async function stakeTEA() {
  try {
    const amountInput = document.getElementById("stake-tea-amount").value;
    const stakeButton = document.getElementById("stake-tea");
    stakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0.");
    }

    const amount = ethers.utils.parseEther(amountInput.toString());
    const MAX_UINT256 = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    if (amount.gt(MAX_UINT256)) {
      throw new Error("TEA amount is too large. Please enter a smaller value.");
    }

    showPendingTransaction("Stake TEA");

    const teaBalance = await provider.getBalance(userAddress);
    if (teaBalance.lt(amount)) {
      throw new Error("Insufficient TEA balance.");
    }

    try {
      await StakingOSSContract.estimateGas.stake({
        value: amount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      let errorMessage = "Failed to estimate gas. The transaction might revert.";
      if (gasError.reason) {
        errorMessage += ` Reason: ${gasError.reason}`;
      }
      throw new Error(errorMessage);
    }

    const tx = await StakingOSSContract.stake({
      value: amount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("TEA Staked Successfully", false);
    logAction("Stake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error staking TEA:", error);
    showAlert(`Failed to stake TEA: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("stake-tea").disabled = false;
  }
}

document.getElementById("stake-tea").addEventListener("click", stakeTEA);

async function unstakeTEA() {
  try {
    const amountInput = document.getElementById("unstake-tea-amount").value;
    const unstakeButton = document.getElementById("unstake-tea");
    unstakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0.");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const userStaked = await StakingOSSContract.getStake(userAddress);
    if (userStaked.lt(amount)) {
      throw new Error("Insufficient staked TEA balance.");
    }

    showPendingTransaction("Unstake TEA");

    try {
      await StakingOSSContract.estimateGas.unstake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await StakingOSSContract.unstake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("TEA Unstaked Successfully", false);
    logAction("Unstake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error unstaking TEA:", error);
    showAlert(`Failed to unstake TEA: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("unstake-tea").disabled = false;
  }
}

document.getElementById("unstake-tea").addEventListener("click", unstakeTEA);

async function withdrawTEA() {
  try {
    const withdrawButton = document.getElementById("withdraw-tea");
    withdrawButton.disabled = true;

    showPendingTransaction("Withdraw TEA");

    try {
      await StakingOSSContract.estimateGas.withdraw({
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await StakingOSSContract.withdraw({
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showAlert("TEA Withdrawn Successfully", false);
    logAction("Withdraw TEA", { txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error withdrawing TEA:", error);
    showAlert(`Failed to withdraw TEA: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("withdraw-tea").disabled = false;
  }
}

document.getElementById("withdraw-tea").addEventListener("click", withdrawTEA);

async function refreshStakingOSSInfo() {
  try {
    const userStaked = await StakingOSSContract.getStake(userAddress);
    document.getElementById("user-staked-tea").textContent = `Staked TEA Balance: ${ethers.utils.formatEther(userStaked)} TEA`;
  } catch (error) {
    console.error("Error refreshing staking TEA info:", error);
    showAlert(`Failed to refresh staking TEA info: ${error.message}`);
  }
}

document.getElementById("refresh-staking-tea-btn").addEventListener("click", refreshStakingOSSInfo);

async function refreshCheckerTEA() {
  try {
    const checkerAddressInput = document.getElementById("checker-address").value;
    const checkButton = document.getElementById("check-tea-btn");
    checkButton.disabled = true;

    if (!ethers.utils.isAddress(checkerAddressInput)) {
      throw new Error("Please enter a valid Ethereum address.");
    }

    const teaBalance = await provider.getBalance(checkerAddressInput);
    const usdtBalance = await UsdtTokenContract.balanceOf(checkerAddressInput);

    document.getElementById("checker-result").textContent = `TEA Balance: ${ethers.utils.formatEther(teaBalance)} TEA\nUSDT Balance: ${ethers.utils.formatUnits(usdtBalance, 18)} USDT`;
  } catch (error) {
    console.error("Error checking TEA balance:", error);
    showAlert(`Failed to check TEA balance: ${error.message}`);
  } finally {
    document.getElementById("check-tea-btn").disabled = false;
  }
}

document.getElementById("check-tea-btn").addEventListener("click", refreshCheckerTEA);
