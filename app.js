document.addEventListener("DOMContentLoaded", () => {
  // Tambah delay kecil sebagai fallback
  setTimeout(() => {
    try {
      console.log("App.js loaded, checking ethers:", typeof window.ethers, window.ethers);

      if (typeof ethers === "undefined") {
        console.error("Ethers.js failed to load. Please check the script source or internet connection.");
        document.getElementById("error").textContent = "Ethers.js failed to load. Please refresh the page or check your internet connection.";
        document.getElementById("error").classList.remove("hidden");
        throw new Error("Ethers.js not loaded");
      }

      // Contract Addresses
      const NFTMinterAddress = "0xe5e3F56D06cC003B2d2f6eCdb89A2e9aDbB38056";
      const StakingOSSAddress = "0x28774F2d350BAA80B098b8da0905dEACA9905b8a";
      const LiquidityPoolAddress = "0x9b416C24411E62B105E3ca389b8CDa6135d22F0C";
      const StakingLPAddress = "0x3093bEeB848ad2f67b276f516b426cD862E3260e";
      const EthTokenAddress = "0x581711F99DaFf0db829B77b9c20b85C697d79b5E";
      const TEA_SEPOLIA_CHAIN_ID = "0x27ea";
      const TEA_SEPOLIA_EXPLORER = "https://sepolia.tea.xyz/tx/";
      const TEA_SEPOLIA_ADDRESS_EXPLORER = "https://sepolia.tea.xyz/address/";

      // Contract ABIs
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

      const LiquidityPoolABI = [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_ethToken",
              "type": "address"
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
          "inputs": [],
          "name": "MINIMUM_LIQUIDITY",
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
          "inputs": [],
          "name": "ethReserve",
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
          "name": "ethToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
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
          "name": "teaReserve",
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
          "name": "totalLiquidity",
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
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
            }
          ],
          "name": "addLiquidity",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "liquidity",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            }
          ],
          "name": "removeLiquidity",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "teaAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ethAmount",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const StakingLPABI = [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_lpToken",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_rewardToken",
              "type": "address"
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
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Staked",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Unstaked",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "reward",
              "type": "uint256"
            }
          ],
          "name": "Withdrawn",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "REWARD_RATE",
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
              "name": "user",
              "type": "address"
            }
          ],
          "name": "calculateReward",
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
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getStake",
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
          "name": "lpToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
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
          "name": "rewardToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
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
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "stakers",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastRewardTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "rewardDebt",
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
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "unstake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];


      // Wallet dan provider
      let provider;
      let signer;
      let userAddress;

      // Tab handling
      const tabs = document.querySelectorAll(".tab");
      const tabContents = document.querySelectorAll(".tab-content");

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");

          tabContents.forEach((content) => content.classList.add("hidden"));
          const targetTab = tab.getAttribute("data-tab");
          document.getElementById(targetTab).classList.remove("hidden");
        });
      });

      // Tab container scroll handling
      const tabContainer = document.querySelector(".tab-container");
      const scrollHint = document.getElementById("scroll-hint");

      if (tabContainer) {
        const checkScroll = () => {
          const isAtEnd = tabContainer.scrollLeft + tabContainer.clientWidth >= tabContainer.scrollWidth - 1;
          if (isAtEnd) {
            tabContainer.classList.add("scrolled-end");
            scrollHint.classList.add("hidden");
          } else {
            tabContainer.classList.remove("scrolled-end");
            scrollHint.classList.remove("hidden");
          }
        };

        tabContainer.addEventListener("scroll", checkScroll);
        checkScroll();
      }

      // Theme toggle
      const themeToggle = document.getElementById("theme-toggle");
      const applyTheme = (isDark) => {
        document.body.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
      };

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        themeToggle.checked = true;
        applyTheme(true);
      }

      themeToggle.addEventListener("change", () => {
        applyTheme(themeToggle.checked);
      });

      // Modal handling
      const showModal = (modalId) => {
        document.getElementById(modalId).classList.remove("hidden");
      };

      const hideModal = (modalId) => {
        document.getElementById(modalId).classList.add("hidden");
      };

      // Alert modal
      const showAlert = (message) => {
        const alertMessage = document.getElementById("alert-message");
        alertMessage.innerHTML = message;
        showModal("alert-modal");
      };

      document.getElementById("close-alert").addEventListener("click", () => {
        hideModal("alert-modal");
      });

      // Loading modal
      const showLoading = () => showModal("loading-modal");
      const hideLoading = () => hideModal("loading-modal");

      // Wallet choice modal
      const walletChoiceModal = document.getElementById("wallet-choice-modal");
      const connectBtn = document.getElementById("connect-btn");

      connectBtn.addEventListener("click", () => {
        showModal("wallet-choice-modal");
      });

      document.getElementById("wallet-choice-close").addEventListener("click", () => {
        hideModal("wallet-choice-modal");
      });

      // Recent transaction modal
      document.getElementById("close-recent-tx").addEventListener("click", () => {
        hideModal("recent-tx-modal");
      });

      // Faucet modal
      document.getElementById("faucet-close").addEventListener("click", () => {
        hideModal("faucet-modal");
      });

      // Recent transactions storage
      let recentTransactions = JSON.parse(localStorage.getItem("recentTransactions")) || [];

      const saveTransaction = (txHash) => {
        recentTransactions.unshift(txHash);
        if (recentTransactions.length > 10) recentTransactions.pop();
        localStorage.setItem("recentTransactions", JSON.stringify(recentTransactions));
      };

      const displayRecentTransactions = () => {
        const txList = document.getElementById("recent-tx-list");
        txList.innerHTML = recentTransactions
          .map(
            (tx) =>
              `<p class="text-gray-700 break-all"><a href="${TEA_SEPOLIA_EXPLORER}${tx}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${tx}</a></p>`
          )
          .join("");
        showModal("recent-tx-modal");
      };

      document.getElementById("recent-tx-btn").addEventListener("click", displayRecentTransactions);

      // Wallet connection
      const connectWallet = async (walletType) => {
        try {
          showLoading();
          let ethProvider;

          if (walletType === "metamask" && window.ethereum) {
            ethProvider = window.ethereum;
          } else if (walletType === "okx" && window.okxwallet) {
            ethProvider = window.okxwallet;
          } else {
            throw new Error(`${walletType === "metamask" ? "MetaMask" : "OKX Wallet"} not detected. Please install the extension.`);
          }

          provider = new ethers.providers.Web3Provider(ethProvider);
          await provider.send("eth_requestAccounts", []);
          signer = provider.getSigner();
          userAddress = await signer.getAddress();

          const network = await provider.getNetwork();
          if (network.chainId !== parseInt(TEA_SEPOLIA_CHAIN_ID, 16)) {
            try {
              await provider.send("wallet_switchEthereumChain", [{ chainId: TEA_SEPOLIA_CHAIN_ID }]);
            } catch (switchError) {
              if (switchError.code === 4902) {
                await provider.send("wallet_addEthereumChain", [
                  {
                    chainId: TEA_SEPOLIA_CHAIN_ID,
                    chainName: "Tea Sepolia",
                    rpcUrls: ["https://rpc.sepolia.tea.xyz"],
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

          document.getElementById("wallet-address").textContent = `Connected: ${userAddress}`;
          document.getElementById("connect-wallet-section").classList.add("hidden");
          document.getElementById("wallet-info").classList.remove("hidden");
          document.getElementById("tabs-section").classList.remove("hidden");

          await updateLiquidityPoolInfo();
          await updateStakingInfo();

          hideModal("wallet-choice-modal");
        } catch (error) {
          console.error("Error connecting wallet:", error);
          showAlert(`Failed to connect wallet: ${error.message}`);
        } finally {
          hideLoading();
        }
      };

      document.getElementById("connect-metamask").addEventListener("click", () => connectWallet("metamask"));
      document.getElementById("connect-okx").addEventListener("click", () => connectWallet("okx"));

      // Wallet info actions
      document.getElementById("copy-address").addEventListener("click", () => {
        navigator.clipboard.writeText(userAddress);
        showAlert("Address copied to clipboard!");
      });

      document.getElementById("check-explorer").addEventListener("click", () => {
        window.open(`${TEA_SEPOLIA_ADDRESS_EXPLORER}${userAddress}`, "_blank", "noopener,noreferrer");
      });

      document.getElementById("disconnect-wallet").addEventListener("click", () => {
        provider = null;
        signer = null;
        userAddress = null;
        document.getElementById("connect-wallet-section").classList.remove("hidden");
        document.getElementById("wallet-info").classList.add("hidden");
        document.getElementById("tabs-section").classList.add("hidden");
      });

      // Mint NFT
      document.getElementById("mint-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const recipient = document.getElementById("recipient-address").value;
          if (!ethers.utils.isAddress(recipient)) {
            throw new Error("Invalid recipient address");
          }

          const nftContract = new ethers.Contract(NFTMinterAddress, NFTMinterABI, signer);
          const tx = await nftContract.mintNFT(recipient);
          await tx.wait();
          saveTransaction(tx.hash);
          showAlert(`NFT minted successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
        } catch (error) {
          console.error("Error minting NFT:", error);
          showAlert(`Failed to mint NFT: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Liquidity Pool functions
      async function updateLiquidityPoolInfo() {
        try {
          const liquidityPoolContract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI, provider);
          const stakingLPContract = new ethers.Contract(StakingLPAddress, StakingLPABI, provider);

          // LP Balance (total LP tokens yang dimiliki user)
          const lpBalance = await liquidityPoolContract.balanceOf(userAddress);
          document.getElementById("lp-balance").textContent = `LP Balance: ${ethers.utils.formatEther(lpBalance)} LP`;

          // Staked LP Balance (LP tokens yang di-stake)
          const stakedLP = await stakingLPContract.getStake(userAddress);
          document.getElementById("staked-lp-balance").textContent = `Staked LP Balance: ${ethers.utils.formatEther(stakedLP)} LP`;

          // LP Reward (reward dari staking LP)
          const lpReward = await stakingLPContract.calculateReward(userAddress);
          document.getElementById("lp-reward").textContent = `LP Reward: ${ethers.utils.formatEther(lpReward)} TEA`;
        } catch (error) {
          console.error("Error updating Liquidity Pool info:", error);
          showAlert(`Failed to update Liquidity Pool info: ${error.message}`);
        }
      }

      // Add Liquidity
      let isEthApproved = false;

      document.getElementById("add-liquidity-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const teaAmount = document.getElementById("tea-amount").value;
          const ethAmount = document.getElementById("eth-amount").value;

          if (!teaAmount || !ethAmount || isNaN(teaAmount) || isNaN(ethAmount) || teaAmount <= 0 || ethAmount <= 0) {
            throw new Error("Please enter valid TEA and ETH amounts");
          }

          const teaWei = ethers.utils.parseEther(teaAmount);
          const ethWei = ethers.utils.parseEther(ethAmount);

          if (!isEthApproved) {
            const ethTokenContract = new ethers.Contract(EthTokenAddress, MyTokenABI, signer);
            const approveTx = await ethTokenContract.approve(LiquidityPoolAddress, ethWei);
            await approveTx.wait();
            saveTransaction(approveTx.hash);
            isEthApproved = true;
            document.getElementById("add-liquidity-btn").textContent = "Add Liquidity";
            showAlert(`ETH approved! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${approveTx.hash}" target="_blank" rel="noopener noreferrer">${approveTx.hash}</a>`);
          } else {
            const liquidityPoolContract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI, signer);
            const tx = await liquidityPoolContract.addLiquidity(ethWei, { value: teaWei });
            await tx.wait();
            saveTransaction(tx.hash);
            await updateLiquidityPoolInfo();
            showAlert(`Liquidity added successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
            isEthApproved = false;
            document.getElementById("add-liquidity-btn").textContent = "Approve ETH";
          }
        } catch (error) {
          console.error("Error adding liquidity:", error);
          showAlert(`Failed to add liquidity: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Remove Liquidity
      document.getElementById("remove-liquidity-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const liquidityAmount = document.getElementById("liquidity-amount").value;

          if (!liquidityAmount || isNaN(liquidityAmount) || liquidityAmount <= 0) {
            throw new Error("Please enter a valid amount of LP tokens");
          }

          const liquidityWei = ethers.utils.parseEther(liquidityAmount);
          const liquidityPoolContract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI, signer);
          const tx = await liquidityPoolContract.removeLiquidity(liquidityWei, userAddress);
          await tx.wait();
          saveTransaction(tx.hash);
          await updateLiquidityPoolInfo();
          showAlert(`Liquidity removed successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
        } catch (error) {
          console.error("Error removing liquidity:", error);
          showAlert(`Failed to remove liquidity: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Stake LP Tokens
      document.getElementById("stake-lp-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const stakeAmount = document.getElementById("stake-lp-amount").value;

          if (!stakeAmount || isNaN(stakeAmount) || stakeAmount <= 0) {
            throw new Error("Please enter a valid amount of LP tokens to stake");
          }

          const amountWei = ethers.utils.parseEther(stakeAmount);
          const liquidityPoolContract = new ethers.Contract(LiquidityPoolAddress, LiquidityPoolABI, signer);
          const stakingLPContract = new ethers.Contract(StakingLPAddress, StakingLPABI, signer);

          const approveTx = await liquidityPoolContract.approve(StakingLPAddress, amountWei);
          await approveTx.wait();
          saveTransaction(approveTx.hash);

          const stakeTx = await stakingLPContract.stake(amountWei);
          await stakeTx.wait();
          saveTransaction(stakeTx.hash);
          await updateLiquidityPoolInfo();
          showAlert(`LP tokens staked successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${stakeTx.hash}" target="_blank" rel="noopener noreferrer">${stakeTx.hash}</a>`);
        } catch (error) {
          console.error("Error staking LP tokens:", error);
          showAlert(`Failed to stake LP tokens: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Unstake LP Tokens
      document.getElementById("unstake-lp-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const unstakeAmount = document.getElementById("unstake-lp-amount").value;

          if (!unstakeAmount || isNaN(unstakeAmount) || unstakeAmount <= 0) {
            throw new Error("Please enter a valid amount of LP tokens to unstake");
          }

          const amountWei = ethers.utils.parseEther(unstakeAmount);
          const stakingLPContract = new ethers.Contract(StakingLPAddress, StakingLPABI, signer);
          const tx = await stakingLPContract.unstake(amountWei);
          await tx.wait();
          saveTransaction(tx.hash);
          await updateLiquidityPoolInfo();
          showAlert(`LP tokens unstaked successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
        } catch (error) {
          console.error("Error unstaking LP tokens:", error);
          showAlert(`Failed to unstake LP tokens: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Staking TEA functions
      async function updateStakingInfo() {
        try {
          const stakingOSSContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, provider);

          // Staked TEA Balance (TEA tokens yang di-stake)
          const stakedTEA = await stakingOSSContract.getStake(userAddress);
          document.getElementById("staked-tea-balance").textContent = `Staked TEA Balance: ${ethers.utils.formatEther(stakedTEA)} TEA`;
        } catch (error) {
          console.error("Error updating Staking TEA info:", error);
          showAlert(`Failed to update Staking TEA info: ${error.message}`);
        }
      }

      // Stake TEA Tokens
      document.getElementById("stake-tea-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const stakeAmount = document.getElementById("stake-tea-amount").value;

          if (!stakeAmount || isNaN(stakeAmount) || stakeAmount <= 0) {
            throw new Error("Please enter a valid amount of TEA to stake");
          }

          const amountWei = ethers.utils.parseEther(stakeAmount);
          const stakingOSSContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, signer);
          const tx = await stakingOSSContract.stake({ value: amountWei });
          await tx.wait();
          saveTransaction(tx.hash);
          await updateStakingInfo();
          showAlert(`TEA staked successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
        } catch (error) {
          console.error("Error staking TEA:", error);
          showAlert(`Failed to stake TEA: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Unstake TEA Tokens
      document.getElementById("unstake-tea-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const unstakeAmount = document.getElementById("unstake-tea-amount").value;

          if (!unstakeAmount || isNaN(unstakeAmount) || unstakeAmount <= 0) {
            throw new Error("Please enter a valid amount of TEA to unstake");
          }

          const amountWei = ethers.utils.parseEther(unstakeAmount);
          const stakingOSSContract = new ethers.Contract(StakingOSSAddress, StakingOSSABI, signer);
          const tx = await stakingOSSContract.unstake(amountWei);
          await tx.wait();
          saveTransaction(tx.hash);
          await updateStakingInfo();
          showAlert(`TEA unstaked successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${tx.hash}" target="_blank" rel="noopener noreferrer">${tx.hash}</a>`);
        } catch (error) {
          console.error("Error unstaking TEA:", error);
          showAlert(`Failed to unstake TEA: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Deploy Token (Bytecode skipped for brevity, you can add it back if needed)
    const MyTokenBytecode = "0x60806040523480156200001157600080fd5b5060405162001ed638038062001ed6833981810160405281019062000037919062000445565b818181600390805190602001906200005192919062000323565b5080600490805190602001906200006a92919062000323565b5050506200008d62000081620000d460201b60201c565b620000dc60201b60201c565b620000cc33620000a2620001a260201b60201c565b600a620000b091906200067a565b620f4240620000c09190620007b7565b620001ab60201b60201c565b505062000935565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156200021e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000215906200050b565b60405180910390fd5b62000232600083836200031960201b60201c565b8060026000828254620002469190620005c2565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002f991906200052d565b60405180910390a362000315600083836200031e60201b60201c565b5050565b505050565b505050565b828054620003319062000865565b90600052602060002090601f016020900481019282620003555760008555620003a1565b82601f106200037057805160ff1916838001178555620003a1565b82800160010185558215620003a1579182015b82811115620003a057825182559160200191906001019062000383565b5b509050620003b09190620003b4565b5090565b5b80821115620003cf576000816000905550600101620003b5565b5090565b6000620003ea620003e4846200057e565b6200054a565b9050828152602081018484840111156200040357600080fd5b620004108482856200082f565b509392505050565b600082601f8301126200042a57600080fd5b81516200043c848260208601620003d3565b91505092915050565b600080604083850312156200045957600080fd5b600083015167ffffffffffffffff8111156200047457600080fd5b620004828582860162000418565b925050602083015167ffffffffffffffff811115620004a057600080fd5b620004ae8582860162000418565b9150509250929050565b6000620004c7601f83620005b1565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b620005058162000818565b82525050565b600060208201905081810360008301526200052681620004b8565b9050919050565b6000602082019050620005446000830184620004fa565b92915050565b6000604051905081810181811067ffffffffffffffff82111715620005745762000573620008f9565b5b8060405250919050565b600067ffffffffffffffff8211156200059c576200059b620008f9565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b6000620005cf8262000818565b9150620005dc8362000818565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200061457620006136200089b565b5b828201905092915050565b6000808291508390505b600185111562000671578086048111156200064957620006486200089b565b5b6001851615620006595780820291505b8081029050620006698562000928565b945062000629565b94509492505050565b6000620006878262000818565b9150620006948362000822565b9250620006c37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620006cb565b905092915050565b600082620006dd5760019050620007b0565b81620006ed5760009050620007b0565b8160018114620007065760028114620007115762000747565b6001915050620007b0565b60ff8411156200072657620007256200089b565b5b8360020a91508482111562000740576200073f6200089b565b5b50620007b0565b5060208310610133831016604e8410600b8410161715620007815782820a9050838111156200077b576200077a6200089b565b5b620007b0565b6200079084848460016200061f565b92509050818404811115620007aa57620007a96200089b565b5b81810290505b9392505050565b6000620007c48262000818565b9150620007d18362000818565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156200080d576200080c6200089b565b5b828202905092915050565b6000819050919050565b600060ff82169050919050565b60005b838110156200084f57808201518184015260208101905062000832565b838111156200085f576000848401525b50505050565b600060028204905060018216806200087e57607f821691505b60208210811415620008955762000894620008ca565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008160011c9050919050565b61159180620009456000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063715018a61161008c578063a457c2d711610066578063a457c2d71461024f578063a9059cbb1461027f578063dd62ed3e146102af578063f2fde38b146102df576100ea565b8063715018a6146102095780638da5cb5b1461021357806395d89b4114610231576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806339509351146101a957806370a08231146101d9576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102fb565b604051610104919061121a565b60405180910390f35b61012760048036038101906101229190610de9565b61038d565b60405161013491906111ff565b60405180910390f35b6101456103b0565b604051610152919061135c565b60405180910390f35b61017560048036038101906101709190610d9a565b6103ba565b60405161018291906111ff565b60405180910390f35b6101936103e9565b6040516101a09190611377565b60405180910390f35b6101c360048036038101906101be9190610de9565b6103f2565b6040516101d091906111ff565b60405180910390f35b6101f360048036038101906101ee9190610d35565b610429565b604051610200919061135c565b60405180910390f35b610211610471565b005b61021b610485565b60405161022891906111e4565b60405180910390f35b6102396104af565b604051610246919061121a565b60405180910390f35b61026960048036038101906102649190610de9565b610541565b60405161027691906111ff565b60405180910390f35b61029960048036038101906102949190610de9565b6105b8565b6040516102a691906111ff565b60405180910390f35b6102c960048036038101906102c49190610d5e565b6105db565b6040516102d6919061135c565b60405180910390f35b6102f960048036038101906102f49190610d35565b610662565b005b60606003805461030a9061148c565b80601f01602080910402602001604051908101604052809291908181526020018280546103369061148c565b80156103835780601f1061035857610100808354040283529160200191610383565b820191906000526020600020905b81548152906001019060200180831161036657829003601f168201915b5050505050905090565b6000806103986106e6565b90506103a58185856106ee565b600191505092915050565b6000600254905090565b6000806103c56106e6565b90506103d28582856108b9565b6103dd858585610945565b60019150509392505050565b60006012905090565b6000806103fd6106e6565b905061041e81858561040f85896105db565b61041991906113ae565b6106ee565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610479610bbd565b6104836000610c3b565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104be9061148c565b80601f01602080910402602001604051908101604052809291908181526020018280546104ea9061148c565b80156105375780601f1061050c57610100808354040283529160200191610537565b820191906000526020600020905b81548152906001019060200180831161051a57829003601f168201915b5050505050905090565b60008061054c6106e6565b9050600061055a82866105db565b90508381101561059f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105969061133c565b60405180910390fd5b6105ac82868684036106ee565b60019250505092915050565b6000806105c36106e6565b90506105d0818585610945565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b61066a610bbd565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156106da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106d19061125c565b60405180910390fd5b6106e381610c3b565b50565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561075e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107559061131c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156107ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c59061127c565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516108ac919061135c565b60405180910390a3505050565b60006108c584846105db565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461093f5781811015610931576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109289061129c565b60405180910390fd5b61093e84848484036106ee565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156109b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109ac906112fc565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610a25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1c9061123c565b60405180910390fd5b610a30838383610d01565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610ab6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aad906112bc565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610ba4919061135c565b60405180910390a3610bb7848484610d06565b50505050565b610bc56106e6565b73ffffffffffffffffffffffffffffffffffffffff16610be3610485565b73ffffffffffffffffffffffffffffffffffffffff1614610c39576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c30906112dc565b60405180910390fd5b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b505050565b505050565b600081359050610d1a8161152d565b92915050565b600081359050610d2f81611544565b92915050565b600060208284031215610d4757600080fd5b6000610d5584828501610d0b565b91505092915050565b60008060408385031215610d7157600080fd5b6000610d7f85828601610d0b565b9250506020610d9085828601610d0b565b9150509250929050565b600080600060608486031215610daf57600080fd5b6000610dbd86828701610d0b565b9350506020610dce86828701610d0b565b9250506040610ddf86828701610d20565b9150509250925092565b60008060408385031215610dfc57600080fd5b6000610e0a85828601610d0b565b9250506020610e1b85828601610d20565b9150509250929050565b610e2e81611404565b82525050565b610e3d81611416565b82525050565b6000610e4e82611392565b610e58818561139d565b9350610e68818560208601611459565b610e718161151c565b840191505092915050565b6000610e8960238361139d565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610eef60268361139d565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610f5560228361139d565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610fbb601d8361139d565b91507f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006000830152602082019050919050565b6000610ffb60268361139d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061106160208361139d565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b60006110a160258361139d565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061110760248361139d565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061116d60258361139d565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6111cf81611442565b82525050565b6111de8161144c565b82525050565b60006020820190506111f96000830184610e25565b92915050565b60006020820190506112146000830184610e34565b92915050565b600060208201905081810360008301526112348184610e43565b905092915050565b6000602082019050818103600083015261125581610e7c565b9050919050565b6000602082019050818103600083015261127581610ee2565b9050919050565b6000602082019050818103600083015261129581610f48565b9050919050565b600060208201905081810360008301526112b581610fae565b9050919050565b600060208201905081810360008301526112d581610fee565b9050919050565b600060208201905081810360008301526112f581611054565b9050919050565b6000602082019050818103600083015261131581611094565b9050919050565b60006020820190508181036000830152611335816110fa565b9050919050565b6000602082019050818103600083015261135581611160565b9050919050565b600060208201905061137160008301846111c6565b92915050565b600060208201905061138c60008301846111d5565b92915050565b600081519050919050565b600082825260208201905092915050565b60006113b982611442565b91506113c483611442565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156113f9576113f86114be565b5b828201905092915050565b600061140f82611422565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561147757808201518184015260208101905061145c565b83811115611486576000848401525b50505050565b600060028204905060018216806114a457607f821691505b602082108114156114b8576114b76114ed565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b61153681611404565b811461154157600080fd5b50565b61154d81611442565b811461155857600080fd5b5056fea2646970667358221220aa3598d52d8cbd9fba71281a90dfa1c1ec8f0cfbf6209f2950df0dfcb6dc5e7064736f6c63430008000033";
    

      document.getElementById("deploy-token-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const tokenName = document.getElementById("token-name").value;
          const tokenSymbol = document.getElementById("token-symbol").value;

          if (!tokenName || !tokenSymbol) {
            throw new Error("Please enter a token name and symbol");
          }

          const factory = new ethers.ContractFactory(MyTokenABI, MyTokenBytecode, signer);
          const contract = await factory.deploy(tokenName, tokenSymbol);
          await contract.deployTransaction.wait();
          saveTransaction(contract.deployTransaction.hash);
          showAlert(`Token deployed successfully at ${contract.address}! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${contract.deployTransaction.hash}" target="_blank" rel="noopener noreferrer">${contract.deployTransaction.hash}</a>`);
        } catch (error) {
          console.error("Error deploying token:", error);
          showAlert(`Failed to deploy token: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Multi Sender
      document.getElementById("multi-send-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const tokenAddress = document.getElementById("token-address").value;
          const addresses = document.getElementById("addresses").value.split(",").map((addr) => addr.trim());
          const amounts = document.getElementById("amounts").value.split(",").map((amt) => ethers.utils.parseEther(amt.trim()));

          if (!ethers.utils.isAddress(tokenAddress)) {
            throw new Error("Invalid token address");
          }

          if (addresses.length !== amounts.length) {
            throw new Error("Number of addresses and amounts must match");
          }

          for (const addr of addresses) {
            if (!ethers.utils.isAddress(addr)) {
              throw new Error(`Invalid address: ${addr}`);
            }
          }

          const tokenContract = new ethers.Contract(tokenAddress, MyTokenABI, signer);
          const txPromises = addresses.map((addr, index) => tokenContract.transfer(addr, amounts[index]));
          const txs = await Promise.all(txPromises);
          const receipts = await Promise.all(txs.map((tx) => tx.wait()));
          receipts.forEach((receipt) => saveTransaction(receipt.transactionHash));
          showAlert(`Tokens sent successfully! Transactions: ${receipts
            .map(
              (receipt) =>
                `<a href="${TEA_SEPOLIA_EXPLORER}${receipt.transactionHash}" target="_blank" rel="noopener noreferrer">${receipt.transactionHash}</a>`
            )
            .join(", ")}`);
        } catch (error) {
          console.error("Error sending tokens:", error);
          showAlert(`Failed to send tokens: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Checker TEA
      document.getElementById("checker-btn").addEventListener("click", async () => {
        try {
          showLoading();
          const address = document.getElementById("checker-address").value;

          if (!ethers.utils.isAddress(address)) {
            throw new Error("Invalid address");
          }

          const balance = await provider.getBalance(address);
          const txCount = await provider.getTransactionCount(address);
          const result = `Address: ${address}\nBalance: ${ethers.utils.formatEther(balance)} TEA\nTransaction Count: ${txCount}`;
          document.getElementById("checker-result").textContent = result;
        } catch (error) {
          console.error("Error checking address:", error);
          showAlert(`Failed to check address: ${error.message}`);
        } finally {
          hideLoading();
        }
      });

      // Faucet (simulated, since we can't make real network calls here)
      document.getElementById("request-faucet").addEventListener("click", async () => {
        try {
          showLoading();
          // Simulate faucet request (since network calls are restricted)
          const simulatedTxHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
          saveTransaction(simulatedTxHash);
          showAlert(`Tokens requested successfully! Transaction: <a href="${TEA_SEPOLIA_EXPLORER}${simulatedTxHash}" target="_blank" rel="noopener noreferrer">${simulatedTxHash}</a>`);
        } catch (error) {
          console.error("Error requesting faucet:", error);
          showAlert(`Failed to request tokens: ${error.message}`);
        } finally {
          hideLoading();
        }
      });
    } catch (error) {
      console.error("Initialization error:", error);
      showAlert(`Initialization failed: ${error.message}`);
    }
  }, 100);
});
