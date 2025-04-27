const NFTAddress = "0xe5e3F56D06cC003B2d2f6eCdb89A2e9aDbB38056";
const LiquidityPoolAddress = "0x4FA264E6491b7ed420540f24021d89EedB340a76";
const StakingAddress = "0x6B67007e1C158caDAa4553A5B349051E3C6aEce9";
const StakingOSSAddress = "0x28774F2d350BAA80B098b8da0905dEACA9905b8a";
const UsdtTokenAddress = "0x581711F99DaFf0db829B77b9c20b85C697d79b5E";
const MultiSenderAddress = "0x3202A3533fd45567a55Ce0ffC3A89e95b3c9A06E";
const FaucetAddress = "0x6E13F11851231fa2A43Bbbe1037f5bf20cFFfe66";

let provider;
let signer;
let userAddress;
let NFTContract;
let LiquidityPoolContract;
let StakingContract;
let StakingOSSContract;
let UsdtTokenContract;
let MultiSenderContract;
let FaucetContract;

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
  "function transferFrom(address sender, address recipient, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)"
];

const MultiSenderABI = [
  "function multiSendETH(address[] recipients, uint256[] amounts) payable"
];

const FaucetABI = [
  "function claim() external",
  "function getNextClaimTime(address user) external view returns (uint256)",
  "function getFaucetBalance() external view returns (uint256)"
];

const DEFAULT_GAS_LIMIT = 1000000;
let recentTransactions = [];

function showMessage(message, isError = true, txHash = null) {
  const messagePopup = document.getElementById("message");
  const messageTitle = document.getElementById("message-title");
  const messageText = document.getElementById("message-text");
  const messageIcon = document.getElementById("message-icon");

  messageText.innerHTML = message;
  if (isError) {
    messageTitle.textContent = "Alert";
    messageIcon.className = "w-6 h-6 text-red-500";
    messageIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 3c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>`;
  } else {
    messageTitle.textContent = "Success";
    messageIcon.className = "w-6 h-6 text-green-500";
    messageIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
    if (txHash) {
      messageText.innerHTML += `<br><a href="https://sepolia.tea.xyz/tx/${txHash}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">View on Explorer</a>`;
    }
  }
  messagePopup.classList.remove("hidden");
}

document.getElementById("close-message").addEventListener("click", () => {
  document.getElementById("message").classList.add("hidden");
});

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
  const TEA_SEPOLIA_CHAIN_ID = "0x27ea";
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
  FaucetContract = new ethers.Contract(FaucetAddress, FaucetABI, signer);
}

async function updateUIAfterConnect() {
  document.getElementById("connect-wallet-section").classList.add("hidden");
  document.getElementById("wallet-info").classList.remove("hidden");
  document.getElementById("tabs-section").classList.remove("hidden");

  await updateWalletInfo();
  await refreshNFTState();
  await refreshLiquidityPoolInfo();
  await refreshStakingOSSInfo();
  await updateFaucetStatus();
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
    showMessage(`Failed to connect wallet: ${error.message}`);
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
  showMessage("Address Copied Successfully", false);
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
    showMessage(`Failed to refresh NFT state: ${error.message}`);
  }
}

document.getElementById("refresh-nft-state").addEventListener("click", refreshNFTState);

document.getElementById("mint-btn").addEventListener("click", async () => {
  try {
    showPendingTransaction("Mint NFT");
    const mintTx = await NFTContract.mintNFT(userAddress, { gasLimit: DEFAULT_GAS_LIMIT });
    await mintTx.wait();
    showMessage("NFT Minted Successfully", false, mintTx.hash);
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
    showMessage(errorMessage);
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
      const approveTx = await UsdtTokenContract.approve(LiquidityPoolAddress, usdtAmount, { gasLimit: DEFAULT_GAS_LIMIT });
      await approveTx.wait();
      showMessage("USDT Approved Successfully", false, approveTx.hash);
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
    showMessage("Liquidity Added Successfully", false, tx.hash);
    logAction("Add Liquidity", {
      teaAmount: teaAmount.toString(),
      usdtAmount: usdtAmount.toString(),
      txHash: tx.hash,
    });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error adding liquidity:", error);
    showMessage(`Failed to add liquidity: ${error.message}`);
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
    showMessage("Liquidity Removed Successfully", false, tx.hash);
    logAction("Remove Liquidity", { liquidity: liquidity.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error removing liquidity:", error);
    showMessage(`Failed to remove liquidity: ${error.message}`);
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
      showMessage("LP Token Approved Successfully", false, approveTx.hash);
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
    showMessage("LP Tokens Staked Successfully", false, tx.hash);
    logAction("Stake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error staking LP tokens:", error);
    showMessage(`Failed to stake LP tokens: ${error.message}`);
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
    showMessage("LP Tokens Unstaked Successfully", false, tx.hash);
    logAction("Unstake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error unstaking LP tokens:", error);
    showMessage(`Failed to unstake LP tokens: ${error.message}`);
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
    showMessage(`Failed to refresh liquidity pool info: ${error.message}`);
  }
}

// Update preview for multi-sender
const addressesInput = document.getElementById('addresses');
if (addressesInput) {
  addressesInput.addEventListener('input', () => {
    const value = addressesInput.value;
    const amountsInput = document.getElementById('amounts');
    const preview = document.getElementById('multi-send-preview');
    if (amountsInput && preview) {
      const addresses = value.split('\n').map(addr => addr.trim()).filter(addr => addr !== '');
      const amountsValue = amountsInput.value.trim();
      let amounts = amountsValue.split(',').map(a => a.trim());
      
      if (amounts.length === 1 && addresses.length > 1) {
        amounts = Array(addresses.length).fill(amounts[0]);
      }
      
      if (addresses.length > 0) {
        preview.textContent = `Sending to ${addresses.length} addresses: ${amounts.join(', ')} TEA each.`;
      } else {
        preview.textContent = '';
      }
    }
  });
}

// Fungsi untuk fix checksum alamat
function fixAddressChecksum(address) {
  try {
    const lowerCaseAddress = address.toLowerCase();
    return ethers.utils.getAddress(lowerCaseAddress);
  } catch (error) {
    throw new Error(`Invalid address: ${address}. Please ensure it's a valid Ethereum address.`);
  }
}

// Validate and execute multi-send (khusus TEA)
async function multiSend() {
  const addressesInput = document.getElementById("addresses");
  const amountsInput = document.getElementById("amounts");
  const multiSendBtn = document.getElementById("multi-send-btn");
  const multiSendError = document.getElementById("multi-send-error");

  try {
    multiSendBtn.disabled = true;
    multiSendError.classList.add("hidden");

    let addresses = addressesInput.value.split('\n').map(addr => addr.trim()).filter(addr => addr !== '');
    const amountsValue = amountsInput.value.trim();
    let amounts = amountsValue.split(',').map(a => parseFloat(a.trim()));

    if (amounts.length === 1 && addresses.length > 1) {
      amounts = Array(addresses.length).fill(amounts[0]);
    }

    addresses = addresses.map(addr => fixAddressChecksum(addr));

    if (addresses.length === 0) {
      throw new Error("Please provide at least one recipient address.");
    }

    if (addresses.length !== amounts.length) {
      throw new Error("Number of addresses and amounts must match, or provide a single amount for all.");
    }

    for (const addr of addresses) {
      if (!ethers.utils.isAddress(addr)) {
        throw new Error(`Invalid address: ${addr}`);
      }
    }

    for (const amount of amounts) {
      if (isNaN(amount) || amount <= 0) {
        throw new Error("All amounts must be valid numbers greater than 0.");
      }
    }

    showPendingTransaction("Multi Send TEA");

    const parsedAmounts = amounts.map(amount => ethers.utils.parseEther(amount.toString()));
    const totalAmount = parsedAmounts.reduce((sum, amount) => sum.add(amount), ethers.BigNumber.from(0));

    const ethBalance = await provider.getBalance(userAddress);
    console.log(`User TEA balance: ${ethers.utils.formatEther(ethBalance)} TEA`);
    if (ethBalance.lt(totalAmount)) {
      throw new Error("Insufficient TEA balance.");
    }

    console.log(`Calling multiSendETH with:`);
    console.log(`Recipients: ${addresses}`);
    console.log(`Amounts: ${parsedAmounts.map(a => ethers.utils.formatEther(a)).join(', ')} TEA`);
    console.log(`Total value: ${ethers.utils.formatEther(totalAmount)} TEA`);

    try {
      await MultiSenderContract.estimateGas.multiSendETH(addresses, parsedAmounts, {
        value: totalAmount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
      console.log("multiSendETH gas estimation successful.");
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await MultiSenderContract.multiSendETH(addresses, parsedAmounts, {
      value: totalAmount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("Multi Send TEA Successful", false, tx.hash);
    logAction("Multi Send TEA", { recipients: addresses, amounts: parsedAmounts.map(a => a.toString()), txHash: tx.hash });
    await updateWalletInfo();
  } catch (error) {
    console.error("Error in multi-send:", error);
    multiSendError.textContent = error.message;
    multiSendError.classList.remove("hidden");
    showMessage(`Failed to multi-send TEA: ${error.message}`);
  } finally {
    hidePendingTransaction();
    multiSendBtn.disabled = false;
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

    const amount = ethers.utils.parseEther(amountInput);
    const teaBalance = await provider.getBalance(userAddress);
    if (teaBalance.lt(amount)) {
      throw new Error("Insufficient TEA balance.");
    }

    showPendingTransaction("Stake TEA");

    try {
      await StakingOSSContract.estimateGas.stake({
        value: amount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await StakingOSSContract.stake({
      value: amount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("TEA Staked Successfully", false, tx.hash);
    logAction("Stake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error staking TEA:", error);
    showMessage(`Failed to stake TEA: ${error.message}`);
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
    showMessage("TEA Unstaked Successfully", false, tx.hash);
    logAction("Unstake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error unstaking TEA:", error);
    showMessage(`Failed to unstake TEA: ${error.message}`);
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
    showMessage("TEA Withdrawn Successfully", false, tx.hash);
    logAction("Withdraw TEA", { txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error withdrawing TEA:", error);
    showMessage(`Failed to withdraw TEA: ${error.message}`);
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
    console.error("Error refreshing staking OSS info:", error);
    showMessage(`Failed to refresh staking info: ${error.message}`);
  }
}

document.getElementById("refresh-staking-tea-btn").addEventListener("click", refreshStakingOSSInfo);

async function refreshCheckerTEA() {
  const checkerResult = document.getElementById("checker-result");
  checkerResult.innerHTML = "";

  if (!userAddress) {
    checkerResult.textContent = "Please connect your wallet first.";
    return;
  }

  const activities = [
    { name: "Deploy NFT", action: "Mint NFT" },
    { name: "Deploy Token", action: "Deploy Token" }, // Placeholder, karena belum ada fungsi deploy token
    { name: "Add Liquidity", action: "Add Liquidity" },
    { name: "Remove Liquidity", action: "Remove Liquidity" },
    { name: "Stake LP Token", action: "Stake LP Tokens" },
    { name: "Unstake LP Token", action: "Unstake LP Tokens" },
    { name: "Stake TEA", action: "Stake TEA" },
    { name: "Unstake TEA", action: "Unstake TEA" },
  ];

  let tableHTML = `
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b text-left">Activity</th>
          <th class="py-2 px-4 border-b text-left">Status</th>
        </tr>
      </thead>
      <tbody>
  `;

  activities.forEach(activity => {
    const hasDone = recentTransactions.some(tx => tx.action === activity.action && tx.from.toLowerCase() === userAddress.toLowerCase());
    const status = hasDone ? "✔" : "✘";
    const statusColor = hasDone ? "text-green-500" : "text-red-500";
    tableHTML += `
      <tr>
        <td class="py-2 px-4 border-b">${activity.name}</td>
        <td class="py-2 px-4 border-b ${statusColor}">${status}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  checkerResult.innerHTML = tableHTML;
}

document.getElementById("check-tea-btn").addEventListener("click", refreshCheckerTEA);

// Faucet Functionality
async function updateFaucetStatus() {
  const faucetStatus = document.getElementById("faucet-status");
  const claimButton = document.getElementById("claim-faucet");

  try {
    const nextClaimTime = await FaucetContract.getNextClaimTime(userAddress);
    const currentTime = Math.floor(Date.now() / 1000); // Waktu dalam detik

    if (nextClaimTime.toNumber() > currentTime) {
      const timeLeft = nextClaimTime.toNumber() - currentTime;
      const hoursLeft = Math.floor(timeLeft / 3600);
      const minutesLeft = Math.floor((timeLeft % 3600) / 60);
      faucetStatus.textContent = `You can claim again in ${hoursLeft}h ${minutesLeft}m.`;
      claimButton.disabled = true;
    } else {
      const faucetBalance = await FaucetContract.getFaucetBalance();
      const claimAmount = ethers.utils.parseUnits("1000", 18);
      if (faucetBalance.lt(claimAmount)) {
        faucetStatus.textContent = "Faucet has insufficient USDT.";
        claimButton.disabled = true;
      } else {
        faucetStatus.textContent = "You can claim 1000 USDT now.";
        claimButton.disabled = false;
      }
    }
  } catch (error) {
    console.error("Error updating faucet status:", error);
    faucetStatus.textContent = "Error checking faucet status.";
    claimButton.disabled = true;
  }
}

async function claimFaucet() {
  try {
    const claimButton = document.getElementById("claim-faucet");
    claimButton.disabled = true;

    showPendingTransaction("Claim Faucet");

    try {
      await FaucetContract.estimateGas.claim({
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed: ${gasError.message}`);
    }

    const tx = await FaucetContract.claim({
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();

    showMessage("Successfully claimed 1000 USDT", false, tx.hash);
    logAction("Claim Faucet", { amount: "1000 USDT", txHash: tx.hash });
    await updateWalletInfo();
    await updateFaucetStatus();
  } catch (error) {
    console.error("Error claiming faucet:", error);
    showMessage(`Failed to claim faucet: ${error.message}`);
  } finally {
    hidePendingTransaction();
    document.getElementById("claim-faucet").disabled = false;
    await updateFaucetStatus(); // Pastikan status diperbarui setelah claim
  }
}

document.getElementById("faucet-btn").addEventListener("click", () => {
  if (!userAddress) {
    showMessage("Please connect your wallet first.");
    return;
  }
  document.getElementById("faucet-modal").classList.remove("hidden");
});

document.getElementById("claim-faucet").addEventListener("click", claimFaucet);

document.getElementById("faucet-close").addEventListener("click", () => {
  document.getElementById("faucet-modal").classList.add("hidden");
});
