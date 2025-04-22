try {
  console.log("App.js loaded, checking ethers:", typeof window.ethers, window.ethers);

  if (typeof ethers === "undefined") {
    console.error("Ethers.js failed to load. Please check the script source or internet connection.");
    document.getElementById("error").textContent = "Ethers.js failed to load. Please refresh the page or check your internet connection.";
    document.getElementById("error").classList.remove("hidden");
    throw new Error("Ethers.js not loaded");
  }

  const NFTMinterAddress = "0xe5e3F56D06cC003B2d2f6eCdb89A2e9aDbB38056";
  const TEA_SEPOLIA_CHAIN_ID = "0x27ea";
  const TEA_SEPOLIA_EXPLORER = "https://sepolia.tea.xyz/tx/";
  const TEA_SEPOLIA_ADDRESS_EXPLORER = "https://sepolia.tea.xyz/address/";
  const StakingOSSAddress = "0x28774F2d350BAA80B098b8da0905dEACA9905b8a";

  const NFTMinterABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "mintNFT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const MyTokenABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const StakingOSSABI = [
    "function stake() external payable",
    "function unstake(uint256 amount) external",
    "function getStake(address user) external view returns (uint256)",
    "function withdraw() external"
  ];

  const MyTokenBytecode = "...";

  const connectWalletBtn = document.getElementById("connect-wallet");
  const errorElement = document.getElementById("error");
  const mainSection = document.getElementById("main-section");
  const connectWalletSection = document.getElementById("connect-wallet-section");
  const tabsSection = document.getElementById("tabs-section");
  const accountElement = document.getElementById("account");
  const balanceElement = document.getElementById("balance");
  const copyAddressBtn = document.getElementById("copy-address");
  const checkExplorerBtn = document.getElementById("check-explorer");
  const recentTxBtn = document.getElementById("recent-tx");
  const disconnectWalletBtn = document.getElementById("disconnect-wallet");
  const walletInfo = document.getElementById("wallet-info");
  const mintNftBtn = document.getElementById("mint-nft");
  const deployTokenBtn = document.getElementById("deploy-token");
  const tokenNameInput = document.getElementById("token-name");
  const tokenSymbolInput = document.getElementById("token-symbol");
  const walletChoiceModal = document.getElementById("wallet-choice-modal");
  const connectMetamaskBtn = document.getElementById("connect-metamask");
  const connectOkxBtn = document.getElementById("connect-okx");
  const walletChoiceCloseBtn = document.getElementById("wallet-choice-close");
  const alertModal = document.getElementById("alert-modal");
  const alertTitle = document.getElementById("alert-title");
  const alertMessage = document.getElementById("alert-message");
  const alertCloseBtn = document.getElementById("alert-close");
  const loadingModal = document.getElementById("loading-modal");
  const recentTxModal = document.getElementById("recent-tx-modal");
  const recentTxList = document.getElementById("recent-tx-list");
  const recentTxCloseBtn = document.getElementById("recent-tx-close");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const multiSenderTokenInput = document.getElementById("multi-sender-token");
  const multiSenderAddressesInput = document.getElementById("multi-sender-addresses");
  const multiSenderAmountInput = document.getElementById("multi-sender-amount");
  const multiSenderBtn = document.getElementById("multi-sender-btn");
  const checkerTeaAddressInput = document.getElementById("checker-tea-address");
  const checkerTeaBtn = document.getElementById("checker-tea-btn");
  const checkerTeaResult = document.getElementById("checker-tea-result");
  const checkerTableBody = document.getElementById("checker-table-body");
  const stakingAmountInput = document.getElementById("staking-amount");
  const stakeBtn = document.getElementById("stake-btn");
  const unstakeBtn = document.getElementById("unstake-btn");
  const stakedBalanceElement = document.getElementById("staked-balance");

  let selectedProvider = null;
  let selectedAddress = null;

  function showWalletChoice() {
    walletChoiceModal.classList.remove("hidden");
  }

  function hideWalletChoice() {
    walletChoiceModal.classList.add("hidden");
  }

  function showLoading() {
    loadingModal.classList.remove("hidden");
  }

  function hideLoading() {
    loadingModal.classList.add("hidden");
  }

  function showAlert(title, message, isError = false) {
    alertTitle.textContent = title;
    alertMessage.innerHTML = message;
    alertTitle.classList.remove("text-red-500", "text-green-500");
    alertTitle.classList.add(isError ? "text-red-500" : "text-green-500");
    alertModal.classList.remove("hidden");
  }

  function hideAlert() {
    alertModal.classList.add("hidden");
  }

  function showRecentTxModal() {
    recentTxModal.classList.remove("hidden");
  }

  function hideRecentTxModal() {
    recentTxModal.classList.add("hidden");
    recentTxList.innerHTML = "";
  }

  function truncateTxHash(hash) {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  alertCloseBtn.addEventListener("click", hideAlert);
  walletChoiceCloseBtn.addEventListener("click", hideWalletChoice);
  recentTxCloseBtn.addEventListener("click", hideRecentTxModal);

  connectWalletBtn.addEventListener("click", () => {
    console.log("Connect Wallet button clicked");
    showWalletChoice();
  });

  connectMetamaskBtn.addEventListener("click", async () => {
    console.log("Connecting with MetaMask...");
    hideWalletChoice();
    if (!window.ethereum) {
      console.error("MetaMask not detected");
      errorElement.textContent = "MetaMask not detected. Please install MetaMask.";
      errorElement.classList.remove("hidden");
      return;
    }
    selectedProvider = window.ethereum;
    await connectWallet();
  });

  connectOkxBtn.addEventListener("click", async () => {
    console.log("Connecting with OKX Wallet...");
    hideWalletChoice();
    if (!window.okxwallet && !window.ethereum) {
      console.error("OKX Wallet not detected");
      errorElement.textContent = "OKX Wallet not detected. Please install OKX Wallet.";
      errorElement.classList.remove("hidden");
      return;
    }
    selectedProvider = window.okxwallet || window.ethereum;
    await connectWallet();
  });

  async function updateWalletInfo() {
    if (!selectedAddress || !selectedProvider) {
      console.log("No selected address or provider, skipping updateWalletInfo");
      return;
    }

    console.log("Updating wallet info for address:", selectedAddress);
    accountElement.textContent = `Connected: ${selectedAddress.slice(0, 6)}...${selectedAddress.slice(-4)}`;
    walletInfo.classList.remove("hidden");

    try {
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const balance = await provider.getBalance(selectedAddress);
      console.log("Balance fetched:", ethers.utils.formatEther(balance), "TEA");
      balanceElement.textContent = `Balance: ${ethers.utils.formatEther(balance)} TEA`;
    } catch (error) {
      console.error("Error fetching balance:", error);
      balanceElement.textContent = "Balance: Error fetching balance";
    }
  }

  function disconnectWallet() {
    console.log("Disconnecting wallet...");
    selectedProvider = null;
    selectedAddress = null;
    walletInfo.classList.add("hidden");
    tabsSection.classList.add("hidden");
    connectWalletSection.classList.remove("hidden");
    accountElement.textContent = "";
    balanceElement.textContent = "";
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
    console.log("Wallet disconnected");
  }

  async function connectWallet() {
    if (!selectedProvider) {
      console.error("No wallet provider selected");
      errorElement.textContent = "No wallet provider selected.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      console.log("Requesting accounts from provider...");
      const accounts = await selectedProvider.request({ method: "eth_requestAccounts" });
      console.log("Accounts received:", accounts);

      if (accounts.length === 0) {
        console.error("No accounts found");
        errorElement.textContent = "No accounts found. Please connect your wallet.";
        errorElement.classList.remove("hidden");
        return;
      }

      selectedAddress = accounts[0];
      connectWalletSection.classList.add("hidden");
      tabsSection.classList.remove("hidden");

      const chainId = await selectedProvider.request({ method: "eth_chainId" });
      console.log("Current chain ID:", chainId);

      if (chainId !== TEA_SEPOLIA_CHAIN_ID) {
        console.log("Switching to Tea Sepolia chain...");
        try {
          await selectedProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: TEA_SEPOLIA_CHAIN_ID }],
          });
          console.log("Switched to Tea Sepolia");
        } catch (switchError) {
          if (switchError.code === 4902) {
            console.log("Adding Tea Sepolia chain...");
            await selectedProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: TEA_SEPOLIA_CHAIN_ID,
                  chainName: "Tea Sepolia",
                  rpcUrls: ["https://tea-sepolia.g.alchemy.com/v2/X6UAIRaCqvRedwmWtWHXtKNxG3kQmwh1"],
                  nativeCurrency: {
                    name: "TEA",
                    symbol: "TEA",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://explorer.teasepolia.com"],
                },
              ],
            });
            console.log("Added and switched to Tea Sepolia");
          } else {
            throw switchError;
          }
        }
      }

      console.log("Calling updateWalletInfo...");
      await updateWalletInfo();
      console.log("Calling updateStakedBalance...");
      await updateStakedBalance();
    } catch (error) {
      console.error("Error in connectWallet:", error);
      errorElement.textContent = error.message || "Failed to connect wallet.";
      errorElement.classList.remove("hidden");
    }
  }

  copyAddressBtn.addEventListener("click", async () => {
    if (!selectedAddress) {
      console.log("No address to copy");
      return;
    }
    try {
      console.log("Copying address:", selectedAddress);
      await navigator.clipboard.writeText(selectedAddress);
      showAlert("Success", "Address copied to clipboard!");
    } catch (error) {
      console.error("Error copying address:", error);
      showAlert("Error", "Failed to copy address.", true);
    }
  });

  checkExplorerBtn.addEventListener("click", () => {
    if (!selectedAddress) {
      console.log("No address to check on explorer");
      return;
    }
    const explorerUrl = `${TEA_SEPOLIA_ADDRESS_EXPLORER}${selectedAddress}`;
    console.log("Opening explorer for address:", selectedAddress);
    window.open(explorerUrl, "_blank");
  });

  async function fetchRecentTransactions() {
    if (!selectedAddress || !selectedProvider) {
      console.log("No selected address or provider, skipping fetchRecentTransactions");
      return [];
    }

    // Dummy data karena Tea Sepolia ga punya API publik
    // Idealnya pake provider.getLogs atau API explorer
    const dummyTransactions = [
      { hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" },
      { hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" },
      { hash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456" },
      { hash: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123" },
      { hash: "0x0abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789" },
    ];

    return dummyTransactions.slice(0, 5);
  }

  recentTxBtn.addEventListener("click", async () => {
    console.log("Recent Transaction button clicked");
    try {
      showLoading();
      const transactions = await fetchRecentTransactions();
      if (transactions.length === 0) {
        recentTxList.innerHTML = "<p class='text-gray-700 text-center'>No recent transactions found.</p>";
      } else {
        let txHtml = "<ul class='space-y-2'>";
        transactions.forEach(tx => {
          const truncatedHash = truncateTxHash(tx.hash);
          txHtml += `
            <li class="border-b border-gray-200 pb-2">
              <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" class="text-blue-500 hover:underline">
                Tx: ${truncatedHash}
              </a>
            </li>
          `;
        });
        txHtml += "</ul>";
        recentTxList.innerHTML = txHtml;
      }
      hideLoading();
      showRecentTxModal();
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      hideLoading();
      showAlert("Error", "Failed to fetch recent transactions.", true);
    }
  });

  disconnectWalletBtn.addEventListener("click", () => {
    disconnectWallet();
  });

  async function mintNFT() {
    console.log("Mint NFT button clicked");

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(NFTMinterAddress, NFTMinterABI, signer);
      const tx = await nftContract.mintNFT(await signer.getAddress());
      const receipt = await tx.wait();
      hideLoading();
      const truncatedHash = truncateTxHash(tx.hash);
      showAlert("Success", `NFT minted successfully! Token ID: ${receipt.events[0].args.tokenId}<br>Tx Hash: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" class="text-blue-500 underline">${truncatedHash}</a>`);
    } catch (error) {
      console.error("Error in mintNFT:", error);
      hideLoading();
      errorElement.textContent = error.reason || error.message || "Failed to mint NFT.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  async function deployToken() {
    console.log("Deploy Token button clicked");

    const tokenName = tokenNameInput.value.trim();
    const tokenSymbol = tokenSymbolInput.value.trim();

    if (!tokenName || !tokenSymbol) {
      errorElement.textContent = "Please enter token name and symbol.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const signer = provider.getSigner();
      const factory = new ethers.ContractFactory(MyTokenABI, MyTokenBytecode, signer);
      const tokenContract = await factory.deploy(tokenName, tokenSymbol);
      await tokenContract.deployed();
      hideLoading();
      const truncatedHash = truncateTxHash(tokenContract.deployTransaction.hash);
      showAlert("Success", `Token deployed successfully at: ${tokenContract.address}<br>Tx Hash: <a href="${TEA_SEPOLIA_EXPLORER}${tokenContract.deployTransaction.hash}" target="_blank" class="text-blue-500 underline">${truncatedHash}</a>`);
    } catch (error) {
      console.error("Error in deployToken:", error);
      hideLoading();
      errorElement.textContent = error.reason || error.message || "Failed to deploy token.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.add("hidden"));

      button.classList.add("active");
      const tabId = button.id.replace("tab-", "content-");
      document.getElementById(tabId).classList.remove("hidden");

      if (tabId === "content-staking-oss") {
        updateStakedBalance();
      }
    });
  });

  async function multiSender() {
    console.log("Multi Sender button clicked");

    const tokenAddress = multiSenderTokenInput.value.trim();
    const addresses = multiSenderAddressesInput.value.trim().split("\n").map(addr => addr.trim()).filter(addr => addr);
    const amount = multiSenderAmountInput.value.trim();

    if (!tokenAddress || addresses.length === 0 || !amount) {
      errorElement.textContent = "Please enter token address, recipient addresses, and amount.";
      errorElement.classList.remove("hidden");
      return;
    }

    if (!ethers.utils.isAddress(tokenAddress)) {
      errorElement.textContent = "Invalid token address.";
      errorElement.classList.remove("hidden");
      return;
    }

    for (const addr of addresses) {
      if (!ethers.utils.isAddress(addr)) {
        errorElement.textContent = `Invalid recipient address: ${addr}`;
        errorElement.classList.remove("hidden");
        return;
      }
    }

    const amountWei = ethers.utils.parseEther(amount);
    if (amountWei.lte(0)) {
      errorElement.textContent = "Amount must be greater than 0.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, MyTokenABI, signer);

      const balance = await tokenContract.balanceOf(await signer.getAddress());
      const totalAmount = amountWei.mul(addresses.length);
      if (balance.lt(totalAmount)) {
        throw new Error("Insufficient token balance.");
      }

      let lastTx;
      for (const addr of addresses) {
        const tx = await tokenContract.transfer(addr, amountWei);
        lastTx = tx;
        await tx.wait();
      }

      hideLoading();
      const truncatedHash = truncateTxHash(lastTx.hash);
      showAlert("Success", `Tokens sent to ${addresses.length} addresses!<br>Last Tx Hash: <a href="${TEA_SEPOLIA_EXPLORER}${lastTx.hash}" target="_blank" class="text-blue-500 underline">${truncatedHash}</a>`);
    } catch (error) {
      console.error("Error in multiSender:", error);
      hideLoading();
      errorElement.textContent = error.reason || error.message || "Failed to send tokens.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  async function checkerTea() {
    console.log("Checker TEA button clicked");

    const address = checkerTeaAddressInput.value.trim();

    if (!address) {
      errorElement.textContent = "Please enter a wallet address.";
      errorElement.classList.remove("undefined");
      return;
    }

    if (!ethers.utils.isAddress(address)) {
      errorElement.textContent = "Invalid wallet address.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });

      const nonce = await provider.getTransactionCount(address);
      const hasSentTx = nonce > 0;

      const stakingContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, provider);
      const userStake = await stakingContract.getStake(address);
      const hasStaked = userStake.gt(0);

      const hasDeployed = nonce > 0;

      const actions = [
        { name: "Deploy NFT", status: hasDeployed },
        { name: "Deploy Token", status: hasDeployed },
        { name: "Stake", status: hasStaked }
      ];

      let tableRows = "";
      actions.forEach(action => {
        const statusIcon = action.status ? "✔" : "✖";
        const statusColor = action.status ? "text-green-500" : "text-red-500";
        tableRows += `
          <tr>
            <td class="border border-gray-300">${action.name}</td>
            <td class="border border-gray-300 ${statusColor}">${statusIcon}</td>
          </tr>
        `;
      });

      checkerTableBody.innerHTML = tableRows;
      checkerTeaResult.classList.remove("hidden");

      hideLoading();
    } catch (error) {
      console.error("Error in checkerTea:", error);
      hideLoading();
      errorElement.textContent = error.message || "Failed to check transaction history.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  async function updateStakedBalance() {
    if (!selectedAddress || !selectedProvider) {
      console.log("No selected address or provider, skipping updateStakedBalance");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const stakingContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, provider);
      const userStake = await stakingContract.getStake(selectedAddress);
      stakedBalanceElement.textContent = `Staked Balance: ${ethers.utils.formatEther(userStake)} TEA`;
    } catch (error) {
      console.error("Error fetching staked balance:", error);
      stakedBalanceElement.textContent = "Staked Balance: Error fetching balance";
    }
  }

  async function stakeTokens() {
    console.log("Stake TEA button clicked");

    const amount = stakingAmountInput.value.trim();

    if (!amount) {
      errorElement.textContent = "Please enter amount to stake.";
      errorElement.classList.remove("hidden");
      return;
    }

    const amountWei = ethers.utils.parseEther(amount);
    if (amountWei.lte(0)) {
      errorElement.textContent = "Amount must be greater than 0.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, signer);

      const tx = await stakingContract.stake({ value: amountWei });
      await tx.wait();

      hideLoading();
      const truncatedHash = truncateTxHash(tx.hash);
      showAlert("Success", `TEA staked successfully!<br>Tx Hash: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" class="text-blue-500 underline">${truncatedHash}</a>`);

      await updateWalletInfo();
      await updateStakedBalance();
    } catch (error) {
      console.error("Error in stakeTokens:", error);
      hideLoading();
      errorElement.textContent = error.reason || error.message || "Failed to stake TEA.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  async function unstakeTokens() {
    console.log("Unstake TEA button clicked");

    const amount = stakingAmountInput.value.trim();

    if (!amount) {
      errorElement.textContent = "Please enter amount to unstake.";
      errorElement.classList.remove("hidden");
      return;
    }

    const amountWei = ethers.utils.parseEther(amount);
    if (amountWei.lte(0)) {
      errorElement.textContent = "Amount must be greater than 0.";
      errorElement.classList.remove("hidden");
      return;
    }

    try {
      showLoading();
      const provider = new ethers.providers.Web3Provider(selectedProvider, {
        chainId: parseInt(TEA_SEPOLIA_CHAIN_ID, 16),
        name: "Tea Sepolia",
        ensAddress: null,
      });
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, signer);

      const tx = await stakingContract.unstake(amountWei);
      await tx.wait();

      hideLoading();
      const truncatedHash = truncateTxHash(tx.hash);
      showAlert("Success", `TEA unstaked successfully!<br>Tx Hash: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" class="text-blue-500 underline">${truncatedHash}</a>`);

      await updateWalletInfo();
      await updateStakedBalance();
    } catch (error) {
      console.error("Error in unstakeTokens:", error);
      hideLoading();
      errorElement.textContent = error.reason || error.message || "Failed to unstake TEA.";
      errorElement.classList.remove("hidden");
      showAlert("Error", errorElement.textContent, true);
    }
  }

  mintNftBtn.addEventListener("click", mintNFT);
  deployTokenBtn.addEventListener("click", deployToken);
  multiSenderBtn.addEventListener("click", multiSender);
  checkerTeaBtn.addEventListener("click", checkerTea);
  stakeBtn.addEventListener("click", stakeTokens);
  unstakeBtn.addEventListener("click", unstakeTokens);

} catch (error) {
  console.error("Error loading app.js:", error);
  document.getElementById("error").textContent = "Failed to load application. Please refresh the page.";
  document.getElementById("error").classList.remove("hidden");
}
