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
  "function getStake(address user) view returns (uint256)"
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

const SimpleTokenABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_symbol", "type": "string" },
      { "internalType": "uint256", "name": "_totalSupply", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const SimpleTokenBytecode = "0x60806040526012600260006101000a81548160ff021916908360ff1602179055503480156200002d57600080fd5b50604051620012703803806200127083398181016040528101906200005391906200027a565b82600090805190602001906200006b92919062000141565b5081600190805190602001906200008492919062000141565b508060038190555080600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405162000130919062000313565b60405180910390a350505062000485565b8280546200014f90620003d7565b90600052602060002090601f016020900481019282620001735760008555620001bf565b82601f106200018e57805160ff1916838001178555620001bf565b82800160010185558215620001bf579182015b82811115620001be578251825591602001919060010190620001a1565b5b509050620001ce9190620001d2565b5090565b5b80821115620001ed576000816000905550600101620001d3565b5090565b600062000208620002028462000364565b62000330565b9050828152602081018484840111156200022157600080fd5b6200022e848285620003a1565b509392505050565b600082601f8301126200024857600080fd5b81516200025a848260208601620001f1565b91505092915050565b60008151905062000274816200046b565b92915050565b6000806000606084860312156200029057600080fd5b600084015167ffffffffffffffff811115620002ab57600080fd5b620002b98682870162000236565b935050602084015167ffffffffffffffff811115620002d757600080fd5b620002e58682870162000236565b9250506040620002f88682870162000263565b9150509250925092565b6200030d8162000397565b82525050565b60006020820190506200032a600083018462000302565b92915050565b6000604051905081810181811067ffffffffffffffff821117156200035a57620003596200043c565b5b8060405250919050565b600067ffffffffffffffff8211156200038257620003816200043c565b5b601f19601f8301169050602081019050919050565b6000819050919050565b60005b83811015620003c1578082015181840152602081019050620003a4565b83811115620003d1576000848401525b50505050565b60006002820490506001821680620003f057607f821691505b602082108114156200040757620004066200040d565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620004768162000397565b81146200048257600080fd5b50565b610ddb80620004956000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461013457806370a082311461015257806395d89b4114610182578063a9059cbb146101a0578063dd62ed3e146101d057610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a0610200565b6040516100ad9190610b10565b60405180910390f35b6100d060048036038101906100cb91906109d3565b61028e565b6040516100dd9190610af5565b60405180910390f35b6100ee610380565b6040516100fb9190610b72565b60405180910390f35b61011e60048036038101906101199190610984565b610386565b60405161012b9190610af5565b60405180910390f35b61013c610678565b6040516101499190610b8d565b60405180910390f35b61016c6004803603810190610167919061091f565b61068b565b6040516101799190610b72565b60405180910390f35b61018a6106a3565b6040516101979190610b10565b60405180910390f35b6101ba60048036038101906101b591906109d3565b610731565b6040516101c79190610af5565b60405180910390f35b6101ea60048036038101906101e59190610948565b6108d0565b6040516101f79190610b72565b60405180910390f35b6000805461020d90610cd6565b80601f016020809104026020016040519081016040528092919081815260200182805461023990610cd6565b80156102865780601f1061025b57610100808354040283529160200191610286565b820191906000526020600020905b81548152906001019060200180831161026957829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161036e9190610b72565b60405180910390a36001905092915050565b60035481565b600081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561040a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040190610b52565b60405180910390fd5b81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156104c9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c090610b32565b60405180910390fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105189190610c1a565b9250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461056e9190610bc4565b9250508190555081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546106019190610c1a565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106659190610b72565b60405180910390a3600190509392505050565b600260009054906101000a900460ff1681565b60046020528060005260406000206000915090505481565b600180546106b090610cd6565b80601f01602080910402602001604051908101604052809291908181526020018280546106dc90610cd6565b80156107295780601f106106fe57610100808354040283529160200191610729565b820191906000526020600020905b81548152906001019060200180831161070c57829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156107b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ac90610b52565b60405180910390fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108049190610c1a565b9250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461085a9190610bc4565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108be9190610b72565b60405180910390a36001905092915050565b6005602052816000526040600020602052806000526040600020600091509150505481565b60008135905061090481610d77565b92915050565b60008135905061091981610d8e565b92915050565b60006020828403121561093157600080fd5b600061093f848285016108f5565b91505092915050565b6000806040838503121561095b57600080fd5b6000610969858286016108f5565b925050602061097a858286016108f5565b9150509250929050565b60008060006060848603121561099957600080fd5b60006109a7868287016108f5565b93505060206109b8868287016108f5565b92505060406109c98682870161090a565b9150509250925092565b600080604083850312156109e657600080fd5b60006109f4858286016108f5565b9250506020610a058582860161090a565b9150509250929050565b610a1881610c60565b82525050565b6000610a2982610ba8565b610a338185610bb3565b9350610a43818560208601610ca3565b610a4c81610d66565b840191505092915050565b6000610a64601683610bb3565b91507f496e73756666696369656e7420616c6c6f77616e6365000000000000000000006000830152602082019050919050565b6000610aa4601483610bb3565b91507f496e73756666696369656e742062616c616e63650000000000000000000000006000830152602082019050919050565b610ae081610c8c565b82525050565b610aef81610c96565b82525050565b6000602082019050610b0a6000830184610a0f565b92915050565b60006020820190508181036000830152610b2a8184610a1e565b905092915050565b60006020820190508181036000830152610b4b81610a57565b9050919050565b60006020820190508181036000830152610b6b81610a97565b9050919050565b6000602082019050610b876000830184610ad7565b92915050565b6000602082019050610ba26000830184610ae6565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610bcf82610c8c565b9150610bda83610c8c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610c0f57610c0e610d08565b5b828201905092915050565b6000610c2582610c8c565b9150610c3083610c8c565b925082821015610c4357610c42610d08565b5b828203905092915050565b6000610c5982610c6c565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015610cc1578082015181840152602081019050610ca6565b83811115610cd0576000848401525b50505050565b60006002820490506001821680610cee57607f821691505b60208210811415610d0257610d01610d37565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b610d8081610c4e565b8114610d8b57600080fd5b50565b610d9781610c8c565b8114610da257600080fd5b5056fea2646970667358221220fe81c11383e323c04d755071add4d571da715f5ab4b37fb0a7f9cc47a58eac2264736f6c63430008000033";

const DEFAULT_GAS_LIMIT = 1000000;
let recentTransactions = [];

function showMessage(message, isError = true, txHash = null) {
  const messagePopup = document.getElementById("message");
  const messageTitle = document.getElementById("message-title");
  const messageText = document.getElementById("message-text");
  const messageIcon = document.getElementById("message-icon");

  messageTitle.textContent = "Alert";
  messageText.innerHTML = message;

  if (isError) {
    messageIcon.className = "w-6 h-6 text-red-500";
    messageTitle.classList.add("text-red-500");
    messageText.classList.add("text-red-500");
    messageIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 3c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>`;
  } else {
    messageTitle.textContent = "Success";
    messageIcon.className = "w-6 h-6 text-green-500";
    messageTitle.classList.remove("text-red-500");
    messageText.classList.remove("text-red-500");
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

async function ensureTeaSepoliaNetwork() {
  const TEA_SEPOLIA_CHAIN_ID = 10218;
  const network = await provider.getNetwork();
  if (network.chainId !== TEA_SEPOLIA_CHAIN_ID) {
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: `0x${TEA_SEPOLIA_CHAIN_ID.toString(16)}` }]);
    } catch (switchError) {
      if (switchError.code === 4902 || switchError.code === -32603) {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: `0x${TEA_SEPOLIA_CHAIN_ID.toString(16)}`,
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
        throw new Error("Please switch to Tea Sepolia network manually to proceed. 😊");
      }
    }
  }
}

async function initializeContracts() {
  const network = { chainId: 10218, name: "Tea Sepolia" };
  provider = new ethers.providers.Web3Provider(window.ethereum, network);

  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) {
      console.log('Network changed from', oldNetwork.chainId, 'to', newNetwork.chainId);
      if (newNetwork.chainId !== 10218) {
        showMessage("Network changed! Please switch back to Tea Sepolia to continue. 😊");
        document.getElementById("disconnect-wallet").click();
      }
    }
  });

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
  startChainStatusCheck();
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
    let errorMessage = "Something went wrong while connecting your wallet. Please try again later. 😔";
    if (error.message.includes("MetaMask not detected")) {
      errorMessage = "MetaMask not detected. Please install MetaMask and try again. 😊";
    } else if (error.message.includes("OKX Wallet not detected")) {
      errorMessage = "OKX Wallet not detected. Please install or enable OKX Wallet and try again. 😊";
    } else if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the wallet connection. Please try again if you'd like to proceed. 😊";
    }
    showMessage(errorMessage);
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

async function checkChainStatus() {
  try {
    const network = await provider.getNetwork();
    const networkElement = document.getElementById("network");
    if (network.chainId === 10218) {
      networkElement.innerHTML = `Network: Tea Sepolia <span class="network-dot"></span>`;
    } else {
      networkElement.innerHTML = `Network: Unknown`;
    }
  } catch (error) {
    console.error("Error checking chain status:", error);
    document.getElementById("network").innerHTML = `Network: Error`;
  }
}

function startChainStatusCheck() {
  checkChainStatus();
  setInterval(checkChainStatus, 10000);
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
    let errorMessage = "Something went wrong while refreshing your NFT state. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the request to refresh your NFT state. Please try again if you'd like to proceed. 😊";
    }
    showMessage(errorMessage);
  }
}

document.getElementById("mint-btn").addEventListener("click", async () => {
  try {
    await ensureTeaSepoliaNetwork();

    showPendingTransaction("Mint NFT");
    const mintTx = await NFTContract.mintNFT(userAddress, { gasLimit: DEFAULT_GAS_LIMIT });
    await mintTx.wait();
    showMessage("NFT Minted Successfully 🎉", false, mintTx.hash);
    logAction("Mint NFT", { txHash: mintTx.hash });
    await refreshNFTState();
  } catch (error) {
    console.error("Error minting NFT:", error);
    let errorMessage = "Something went wrong while minting your NFT. Please try again later. 😔";
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      errorMessage = "Transaction may fail due to gas issues. Please check the NFT contract or try setting a manual gas limit. 😔";
    } else if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the NFT minting transaction. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
  }
});

async function checkAllowance(amount, tokenContract, spender, actionType) {
  const tokenAmount = amount || ethers.BigNumber.from(0);
  const allowance = await tokenContract.allowance(userAddress, spender);
  const needsApproval = allowance.lt(tokenAmount);

  if (actionType === "add-liquidity") {
    document.getElementById("approve-add-liquidity").classList.toggle("hidden", !needsApproval);
    document.getElementById("add-liquidity").classList.toggle("hidden", needsApproval);
  } else if (actionType === "remove-liquidity") {
    document.getElementById("approve-remove-liquidity").classList.toggle("hidden", !needsApproval);
    document.getElementById("remove-liquidity").classList.toggle("hidden", needsApproval);
  } else if (actionType === "stake-lp") {
    document.getElementById("approve-stake-lp").classList.toggle("hidden", !needsApproval);
    document.getElementById("stake-lp").classList.toggle("hidden", needsApproval);
  } else if (actionType === "unstake-lp") {
    document.getElementById("approve-unstake-lp").classList.toggle("hidden", !needsApproval);
    document.getElementById("unstake-lp").classList.toggle("hidden", needsApproval);
  }

  return needsApproval;
}

async function approveToken(amount, tokenContract, spender, actionType) {
  try {
    await ensureTeaSepoliaNetwork();

    showPendingTransaction("Approve Token");
    const approveTx = await tokenContract.approve(spender, amount, { gasLimit: DEFAULT_GAS_LIMIT });
    await approveTx.wait();
    showMessage("Token Approved Successfully 🎉", false, approveTx.hash);
    await checkAllowance(amount, tokenContract, spender, actionType);
  } catch (error) {
    console.error(`Error approving token for ${actionType}:`, error);
    let errorMessage = "Something went wrong while approving the token. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the token approval. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
  }
}

async function addLiquidity() {
  try {
    await ensureTeaSepoliaNetwork();

    const teaAmountInput = document.getElementById("tea-amount").value;
    const usdtAmountInput = document.getElementById("usdt-amount").value;
    const addButton = document.getElementById("add-liquidity");
    addButton.disabled = true;

    const teaAmountFloat = parseFloat(teaAmountInput);
    const usdtAmountFloat = parseFloat(usdtAmountInput);
    if (isNaN(teaAmountFloat) || teaAmountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0. 😊");
    }
    if (isNaN(usdtAmountFloat) || usdtAmountFloat <= 0) {
      throw new Error("Please enter a valid USDT amount greater than 0. 😊");
    }

    const MAX_UINT256 = ethers.BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935");
    const teaAmount = ethers.utils.parseEther(teaAmountInput);
    const usdtAmount = ethers.utils.parseUnits(usdtAmountInput, 18);
    if (teaAmount.gt(MAX_UINT256)) {
      throw new Error("TEA amount is too large. Please enter a smaller value. 😊");
    }
    if (usdtAmount.gt(MAX_UINT256)) {
      throw new Error("USDT amount is too large. Please enter a smaller value. 😊");
    }

    const needsApproval = await checkAllowance(usdtAmount, UsdtTokenContract, LiquidityPoolAddress, "add-liquidity");
    if (needsApproval) {
      return;
    }

    showPendingTransaction("Add Liquidity");

    const teaBalance = await provider.getBalance(userAddress);
    if (teaBalance.lt(teaAmount)) {
      throw new Error("You don't have enough TEA to add liquidity. 😔");
    }

    const usdtBalance = await UsdtTokenContract.balanceOf(userAddress);
    if (usdtBalance.lt(usdtAmount)) {
      throw new Error("You don't have enough USDT to add liquidity. 😔");
    }

    const reserves = await LiquidityPoolContract.getReserves();
    const teaReserveRaw = reserves[0];
    const usdtReserveRaw = reserves[1];

    const teaReserve = parseFloat(ethers.utils.formatEther(teaReserveRaw));
    const usdtReserve = parseFloat(ethers.utils.formatUnits(usdtReserveRaw, 18));

    if (teaReserve === 0 && usdtReserve === 0) {
    } else if (teaReserve === 0) {
      throw new Error("Cannot calculate ratio: TEA reserve is 0. 😔");
    } else {
      const poolRatio = usdtReserve / teaReserve;
      const expectedUsdtAmountFloat = teaAmountFloat * poolRatio;
      const expectedUsdtAmount = ethers.utils.parseUnits(expectedUsdtAmountFloat.toString(), 18);
      const slippageInput = parseFloat(document.getElementById("slippage-tolerance").value) || 15;
      const slippageTolerance = Math.floor(slippageInput * 10);
      const minUsdtAmount = expectedUsdtAmount.mul(1000 - slippageTolerance).div(1000);

      if (usdtAmount.lt(minUsdtAmount)) {
        throw new Error(
          `Insufficient USDT amount. You need at least ${ethers.utils.formatUnits(minUsdtAmount, 18)} USDT for ${teaAmountInput} TEA based on the pool ratio (including slippage). 😔`
        );
      }
    }

    try {
      await LiquidityPoolContract.estimateGas.addLiquidity(usdtAmount, {
        value: teaAmount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await LiquidityPoolContract.addLiquidity(usdtAmount, {
      value: teaAmount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("Liquidity Added Successfully 🎉", false, tx.hash);
    logAction("Add Liquidity", {
      teaAmount: teaAmount.toString(),
      usdtAmount: usdtAmount.toString(),
      txHash: tx.hash,
    });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error adding liquidity:", error);
    let errorMessage = "Something went wrong while adding liquidity. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the liquidity addition. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("add-liquidity").disabled = false;
  }
}

document.getElementById("add-liquidity").addEventListener("click", addLiquidity);
document.getElementById("approve-add-liquidity").addEventListener("click", async () => {
  const usdtAmountInput = document.getElementById("usdt-amount").value;
  const usdtAmount = ethers.utils.parseUnits(usdtAmountInput, 18);
  await approveToken(usdtAmount, UsdtTokenContract, LiquidityPoolAddress, "add-liquidity");
});

document.getElementById("tea-amount").addEventListener("input", async () => {
  const teaAmountInput = document.getElementById("tea-amount").value;
  const usdtAmountInput = document.getElementById("usdt-amount");
  const teaAmountFloat = parseFloat(teaAmountInput);

  if (isNaN(teaAmountFloat) || teaAmountFloat <= 0) {
    usdtAmountInput.value = "";
    return;
  }

  try {
    const reserves = await LiquidityPoolContract.getReserves();
    const teaReserveRaw = reserves[0];
    const usdtReserveRaw = reserves[1];

    const teaReserve = parseFloat(ethers.utils.formatEther(teaReserveRaw));
    const usdtReserve = parseFloat(ethers.utils.formatUnits(usdtReserveRaw, 18));

    if (teaReserve === 0 || usdtReserve === 0) {
      usdtAmountInput.value = "0";
    } else {
      const poolRatio = usdtReserve / teaReserve;
      const expectedUsdtAmountFloat = teaAmountFloat * poolRatio;
      usdtAmountInput.value = expectedUsdtAmountFloat.toFixed(2);
    }

    const usdtAmount = ethers.utils.parseUnits(usdtAmountInput.value || "0", 18);
    await checkAllowance(usdtAmount, UsdtTokenContract, LiquidityPoolAddress, "add-liquidity");
  } catch (error) {
    console.error("Error calculating USDT amount:", error);
    usdtAmountInput.value = "0";
  }
});

async function removeLiquidity() {
  try {
    await ensureTeaSepoliaNetwork();

    const liquidityInput = document.getElementById("liquidity-amount").value;
    const removeButton = document.getElementById("remove-liquidity");
    removeButton.disabled = true;

    const liquidityFloat = parseFloat(liquidityInput);
    if (isNaN(liquidityFloat) || liquidityFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0. 😊");
    }

    const liquidity = ethers.utils.parseEther(liquidityInput);
    const userLiquidity = await LiquidityPoolContract.balanceOf(userAddress);
    if (userLiquidity.lt(liquidity)) {
      throw new Error("You don't have enough LP tokens to remove liquidity. 😔");
    }

    const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
    const needsApproval = await checkAllowance(liquidity, lpTokenContract, LiquidityPoolAddress, "remove-liquidity");
    if (needsApproval) {
      return;
    }

    showPendingTransaction("Remove Liquidity");

    try {
      await LiquidityPoolContract.estimateGas.removeLiquidity(liquidity, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await LiquidityPoolContract.removeLiquidity(liquidity, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("Liquidity Removed Successfully 🎉", false, tx.hash);
    logAction("Remove Liquidity", { liquidity: liquidity.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error removing liquidity:", error);
    let errorMessage = "Something went wrong while removing liquidity. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the liquidity removal. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("remove-liquidity").disabled = false;
  }
}

document.getElementById("remove-liquidity").addEventListener("click", removeLiquidity);
document.getElementById("approve-remove-liquidity").addEventListener("click", async () => {
  const liquidityInput = document.getElementById("liquidity-amount").value;
  const liquidity = ethers.utils.parseEther(liquidityInput);
  const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
  await approveToken(liquidity, lpTokenContract, LiquidityPoolAddress, "remove-liquidity");
});

document.getElementById("liquidity-amount").addEventListener("input", async () => {
  const liquidityInput = document.getElementById("liquidity-amount").value;
  const liquidityFloat = parseFloat(liquidityInput);
  const liquidity = isNaN(liquidityFloat) || liquidityFloat <= 0 ? ethers.BigNumber.from(0) : ethers.utils.parseEther(liquidityInput);
  const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
  await checkAllowance(liquidity, lpTokenContract, LiquidityPoolAddress, "remove-liquidity");
});

async function stakeLP() {
  try {
    await ensureTeaSepoliaNetwork();

    const amountInput = document.getElementById("stake-lp-amount").value;
    const stakeButton = document.getElementById("stake-lp");
    stakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0. 😊");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
    const userLiquidity = await lpTokenContract.balanceOf(userAddress);
    if (userLiquidity.lt(amount)) {
      throw new Error("You don't have enough LP tokens to stake. 😔");
    }

    const needsApproval = await checkAllowance(amount, lpTokenContract, StakingAddress, "stake-lp");
    if (needsApproval) {
      return;
    }

    showPendingTransaction("Stake LP Tokens");

    try {
      await StakingContract.estimateGas.stake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await StakingContract.stake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("LP Tokens Staked Successfully 🎉", false, tx.hash);
    logAction("Stake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error staking LP tokens:", error);
    let errorMessage = "Something went wrong while staking your LP tokens. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the LP token staking. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("stake-lp").disabled = false;
  }
}

document.getElementById("stake-lp").addEventListener("click", stakeLP);
document.getElementById("approve-stake-lp").addEventListener("click", async () => {
  const amountInput = document.getElementById("stake-lp-amount").value;
  const amount = ethers.utils.parseEther(amountInput);
  const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
  await approveToken(amount, lpTokenContract, StakingAddress, "stake-lp");
});

document.getElementById("stake-lp-amount").addEventListener("input", async () => {
  const amountInput = document.getElementById("stake-lp-amount").value;
  const amountFloat = parseFloat(amountInput);
  const amount = isNaN(amountFloat) || amountFloat <= 0 ? ethers.BigNumber.from(0) : ethers.utils.parseEther(amountInput);
  const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
  await checkAllowance(amount, lpTokenContract, StakingAddress, "stake-lp");
});

async function unstakeLP() {
  try {
    await ensureTeaSepoliaNetwork();

    const amountInput = document.getElementById("unstake-lp-amount").value;
    const unstakeButton = document.getElementById("unstake-lp");
    unstakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid LP token amount greater than 0. 😊");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const userStaked = await StakingContract.stakedBalance(userAddress);
    if (userStaked.lt(amount)) {
      throw new Error("You don't have enough staked LP tokens to unstake. 😔");
    }

    showPendingTransaction("Unstake LP Tokens");

    try {
      await StakingContract.estimateGas.unstake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await StakingContract.unstake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("LP Tokens Unstaked Successfully 🎉", false, tx.hash);
    logAction("Unstake LP Tokens", { amount: amount.toString(), txHash: tx.hash });
    await refreshLiquidityPoolInfo();
  } catch (error) {
    console.error("Error unstaking LP tokens:", error);
    let errorMessage = "Something went wrong while unstaking your LP tokens. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the LP token unstaking. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("unstake-lp").disabled = false;
  }
}

document.getElementById("unstake-lp").addEventListener("click", unstakeLP);

document.getElementById("unstake-lp-amount").addEventListener("input", async () => {
});

async function refreshLiquidityPoolInfo() {
  try {
    const reserves = await LiquidityPoolContract.getReserves();
    const totalLiquidity = await LiquidityPoolContract.totalSupply();
    const lpTokenContract = new ethers.Contract(LiquidityPoolAddress, UsdtTokenABI, signer);
    const userLiquidity = await lpTokenContract.balanceOf(userAddress);
    
    let userStaked;
    try {
      userStaked = await StakingContract.stakedBalance(userAddress);
    } catch (error) {
      console.error("Error fetching user staked LP:", error);
      userStaked = ethers.BigNumber.from(0);
    }

    document.getElementById("pool-tea-reserve").textContent = `TEA Reserve in pools: ${ethers.utils.formatEther(reserves[0])} TEA`;
    document.getElementById("pool-eth-reserve").textContent = `USDT Reserve in pools: ${ethers.utils.formatUnits(reserves[1], 18)} USDT`;
    document.getElementById("total-liquidity").textContent = `Total Liquidity in pools all user: ${ethers.utils.formatEther(totalLiquidity)} LP Tokens`;
    document.getElementById("user-liquidity").textContent = `Your Liquidity token: ${ethers.utils.formatEther(userLiquidity)} LP Tokens`;
    document.getElementById("user-staked-lp").textContent = `Staked LP Balance: ${ethers.utils.formatEther(userStaked)} LP Tokens`;

    const usdtAmount = ethers.utils.parseUnits(document.getElementById("usdt-amount").value || "0", 18);
    await checkAllowance(usdtAmount, UsdtTokenContract, LiquidityPoolAddress, "add-liquidity");

    const liquidityAmount = ethers.utils.parseEther(document.getElementById("liquidity-amount").value || "0");
    await checkAllowance(liquidityAmount, lpTokenContract, LiquidityPoolAddress, "remove-liquidity");

    const stakeAmount = ethers.utils.parseEther(document.getElementById("stake-lp-amount").value || "0");
    await checkAllowance(stakeAmount, lpTokenContract, StakingAddress, "stake-lp");
  } catch (error) {
    console.error("Error refreshing liquidity pool info:", error);
    let errorMessage = "Something went wrong while refreshing liquidity pool info. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the request to refresh liquidity pool info. Please try again if you'd like to proceed. 😊";
    }
    showMessage(errorMessage);
  }
}

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

function fixAddressChecksum(address) {
  try {
    const lowerCaseAddress = address.toLowerCase();
    return ethers.utils.getAddress(lowerCaseAddress);
  } catch (error) {
    throw new Error(`Invalid address: ${address}. Please ensure it's a valid Ethereum address. 😊`);
  }
}

async function multiSend() {
  const addressesInput = document.getElementById("addresses");
  const amountsInput = document.getElementById("amounts");
  const multiSendBtn = document.getElementById("multi-send-btn");
  const multiSendError = document.getElementById("multi-send-error");

  try {
    await ensureTeaSepoliaNetwork();

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
      throw new Error("Please provide at least one recipient address. 😊");
    }

    if (addresses.length !== amounts.length) {
      throw new Error("Number of addresses and amounts must match, or provide a single amount for all. 😊");
    }

    for (const addr of addresses) {
      if (!ethers.utils.isAddress(addr)) {
        throw new Error(`Invalid address: ${addr} 😔`);
      }
    }

    for (const amount of amounts) {
      if (isNaN(amount) || amount <= 0) {
        throw new Error("All amounts must be valid numbers greater than 0. 😊");
      }
    }

    showPendingTransaction("Multi Send TEA");

    const parsedAmounts = amounts.map(amount => ethers.utils.parseEther(amount.toString()));
    const totalAmount = parsedAmounts.reduce((sum, amount) => sum.add(amount), ethers.BigNumber.from(0));

    const ethBalance = await provider.getBalance(userAddress);
    if (ethBalance.lt(totalAmount)) {
      throw new Error("You don't have enough TEA to send. 😔");
    }

    try {
      await MultiSenderContract.estimateGas.multiSendETH(addresses, parsedAmounts, {
        value: totalAmount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await MultiSenderContract.multiSendETH(addresses, parsedAmounts, {
      value: totalAmount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("Multi Send TEA Successful 🎉", false, tx.hash);
    logAction("Multi Send TEA", { recipients: addresses, amounts: parsedAmounts.map(a => a.toString()), txHash: tx.hash });
    await updateWalletInfo();
  } catch (error) {
    console.error("Error in multi-send:", error);
    multiSendError.textContent = error.message;
    multiSendError.classList.remove("hidden");
    let errorMessage = "Something went wrong while sending TEA. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the multi-send transaction. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient") || error.message.includes("Invalid address")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    multiSendBtn.disabled = false;
  }
}

document.getElementById("multi-send-btn").addEventListener("click", multiSend);

async function stakeTEA() {
  try {
    await ensureTeaSepoliaNetwork();

    const amountInput = document.getElementById("stake-tea-amount").value;
    const stakeButton = document.getElementById("stake-tea");
    stakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0. 😊");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const teaBalance = await provider.getBalance(userAddress);
    if (teaBalance.lt(amount)) {
      throw new Error("You don't have enough TEA to stake. 😔");
    }

    showPendingTransaction("Stake TEA");

    try {
      await StakingOSSContract.estimateGas.stake({
        value: amount,
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await StakingOSSContract.stake({
      value: amount,
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("TEA Staked Successfully 🎉", false, tx.hash);
    logAction("Stake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error staking TEA:", error);
    let errorMessage = "Something went wrong while staking your TEA. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the TEA staking transaction. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("stake-tea").disabled = false;
  }
}

document.getElementById("stake-tea").addEventListener("click", stakeTEA);

async function unstakeTEA() {
  try {
    await ensureTeaSepoliaNetwork();

    const amountInput = document.getElementById("unstake-tea-amount").value;
    const unstakeButton = document.getElementById("unstake-tea");
    unstakeButton.disabled = true;

    const amountFloat = parseFloat(amountInput);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      throw new Error("Please enter a valid TEA amount greater than 0. 😊");
    }

    const amount = ethers.utils.parseEther(amountInput);
    const userStaked = await StakingOSSContract.getStake(userAddress);
    if (userStaked.lt(amount)) {
      throw new Error("You don't have enough staked TEA to unstake. 😔");
    }

    showPendingTransaction("Unstake TEA");

    try {
      await StakingOSSContract.estimateGas.unstake(amount, {
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await StakingOSSContract.unstake(amount, {
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();
    showMessage("TEA Unstaked Successfully 🎉", false, tx.hash);
    logAction("Unstake TEA", { amount: amount.toString(), txHash: tx.hash });
    await refreshStakingOSSInfo();
  } catch (error) {
    console.error("Error unstaking TEA:", error);
    let errorMessage = "Something went wrong while unstaking your TEA. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the TEA unstaking transaction. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("insufficient")) {
      errorMessage = error.message;
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("unstake-tea").disabled = false;
  }
}

document.getElementById("unstake-tea").addEventListener("click", unstakeTEA);

async function refreshStakingOSSInfo() {
  try {
    const userStaked = await StakingOSSContract.getStake(userAddress);
    document.getElementById("user-staked-tea").textContent = `Staked TEA Balance: ${ethers.utils.formatEther(userStaked)} TEA`;
  } catch (error) {
    console.error("Error refreshing staking OSS info:", error);
    let errorMessage = "Something went wrong while refreshing staking info. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the request to refresh staking info. Please try again if you'd like to proceed. 😊";
    }
    showMessage(errorMessage);
  }
}

async function refreshCheckerTEA() {
  const checkerResult = document.getElementById("checker-result");
  checkerResult.innerHTML = "";

  if (!userAddress) {
    checkerResult.textContent = "Please connect your wallet first. 😊";
    return;
  }

  const activities = [
    { name: "Deploy NFT", action: "Mint NFT" },
    { name: "Deploy Token", action: "Deploy Token" },
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

async function updateFaucetStatus() {
  const faucetStatus = document.getElementById("faucet-status");
  const claimButton = document.getElementById("claim-faucet");

  try {
    const nextClaimTime = await FaucetContract.getNextClaimTime(userAddress);
    const currentTime = Math.floor(Date.now() / 1000);

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
        faucetStatus.textContent = "Faucet has insufficient USDT. 😔";
        claimButton.disabled = true;
      } else {
        faucetStatus.textContent = "You can claim 1000 USDT now. 🎉";
        claimButton.disabled = false;
      }
    }
  } catch (error) {
    console.error("Error updating faucet status:", error);
    faucetStatus.textContent = "Error checking faucet status. 😔";
    claimButton.disabled = true;
  }
}

async function claimFaucet() {
  try {
    await ensureTeaSepoliaNetwork();

    const claimButton = document.getElementById("claim-faucet");
    claimButton.disabled = true;

    showPendingTransaction("Claim Faucet");

    try {
      await FaucetContract.estimateGas.claim({
        gasLimit: DEFAULT_GAS_LIMIT,
      });
    } catch (gasError) {
      console.error("Gas estimation failed:", gasError);
      throw new Error(`Gas estimation failed. Please try again or set a manual gas limit. 😔`);
    }

    const tx = await FaucetContract.claim({
      gasLimit: DEFAULT_GAS_LIMIT,
    });
    await tx.wait();

    showMessage("Successfully claimed 1000 USDT 🎉", false, tx.hash);
    logAction("Claim Faucet", { amount: "1000 USDT", txHash: tx.hash });
    await updateWalletInfo();
    await updateFaucetStatus();
  } catch (error) {
    console.error("Error claiming faucet:", error);
    let errorMessage = "Something went wrong while claiming the faucet. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the faucet claim. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
    document.getElementById("claim-faucet").disabled = false;
    await updateFaucetStatus();
  }
}

document.getElementById("faucet-btn").addEventListener("click", () => {
  if (!userAddress) {
    showMessage("Please connect your wallet first. 😊");
    return;
  }
  document.getElementById("faucet-modal").classList.remove("hidden");
});

document.getElementById("claim-faucet").addEventListener("click", claimFaucet);

document.getElementById("faucet-close").addEventListener("click", () => {
  document.getElementById("faucet-modal").classList.add("hidden");
});

async function deployToken() {
  const tokenName = document.getElementById("token-name").value;
  const tokenSymbol = document.getElementById("token-ticker").value;
  const tokenSupply = document.getElementById("token-supply").value;

  if (!tokenName || !tokenSymbol || !tokenSupply) {
    showMessage("Please fill in all token details. 😊");
    return;
  }

  try {
    console.log("Starting token deployment...");
    console.log("Token Name:", tokenName);
    console.log("Token Symbol:", tokenSymbol);
    console.log("Token Supply (raw):", tokenSupply);

    await ensureTeaSepoliaNetwork();
    console.log("Network check passed: Tea Sepolia");

    const supplyFloat = parseFloat(tokenSupply);
    if (isNaN(supplyFloat) || supplyFloat <= 0) {
      throw new Error("Please enter a valid token supply greater than 0. 😊");
    }

    const decimals = 18;
    const supplyInWei = ethers.utils.parseUnits(tokenSupply, decimals);
    console.log("Token Supply (in wei):", supplyInWei.toString());

    // Validasi SimpleTokenBytecode
    if (!SimpleTokenBytecode || !SimpleTokenBytecode.startsWith("0x")) {
      throw new Error("Invalid SimpleTokenBytecode. It must be a valid hex string starting with '0x'. 😔");
    }
    console.log("SimpleTokenBytecode (first 20 chars):", SimpleTokenBytecode.substring(0, 20));

    // Validasi SimpleTokenABI
    if (!Array.isArray(SimpleTokenABI) || SimpleTokenABI.length === 0) {
      throw new Error("Invalid SimpleTokenABI. It must be a non-empty array. 😔");
    }
    console.log("SimpleTokenABI length:", SimpleTokenABI.length);
    console.log("SimpleTokenABI sample (first element):", JSON.stringify(SimpleTokenABI[0]));

    // Validasi signer
    if (!signer) {
      throw new Error("Signer not initialized. Please connect your wallet. 😔");
    }
    const signerAddress = await signer.getAddress();
    console.log("Signer address:", signerAddress);

    showPendingTransaction("Deploy Token");

    console.log("Ethers.js version:", ethers.version);

    // Buat ContractFactory
    const factory = new ethers.ContractFactory(SimpleTokenABI, SimpleTokenBytecode, signer);
    console.log("Contract factory created:", factory);

    // Langsung deploy
    const contract = await factory.deploy(tokenName, tokenSymbol, supplyInWei, { gasLimit: 2000000 });
    console.log("Deployment transaction sent, waiting for confirmation...");

    await contract.deployed();
    console.log("Token deployed at address:", contract.address);

    showMessage(`Token deployed successfully at address: ${contract.address} 🎉`, false, contract.deployTransaction.hash);
    logAction("Deploy Token", { txHash: contract.deployTransaction.hash, address: contract.address });
    await refreshCheckerTEA();
  } catch (error) {
    console.error("Error deploying token:", error);
    let errorMessage = "Something went wrong while deploying your token. Please try again later. 😔";
    if (error.code === 'ACTION_REJECTED') {
      errorMessage = "Oops! You canceled the token deployment. Please try again if you'd like to proceed. 😊";
    } else if (error.message.includes("Please switch to Tea Sepolia")) {
      errorMessage = error.message;
    } else if (error.message.includes("gas")) {
      errorMessage = "Failed to deploy token due to gas issues. Try increasing the gas limit or check the contract. 😔";
    }
    showMessage(errorMessage);
  } finally {
    hidePendingTransaction();
  }
}

document.getElementById("deploy-token-btn")?.addEventListener("click", deployToken);
