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

  const MyTokenBytecode = "0x60806040523480156200001157600080fd5b5060405162001ed638038062001ed6833981810160405281019062000037919062000445565b818181600390805190602001906200005192919062000323565b5080600490805190602001906200006a92919062000323565b5050506200008d62000081620000d460201b60201c565b620000dc60201b60201c565b620000cc33620000a2620001a260201b60201c565b600a620000b091906200067a565b620f4240620000c09190620007b7565b620001ab60201b60201c565b505062000935565b600033905090565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156200021e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000215906200050b565b60405180910390fd5b62000232600083836200031960201b60201c565b8060026000828254620002469190620005c2565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002f991906200052d565b60405180910390a362000315600083836200031e60201b60201c565b5050565b505050565b505050565b828054620003319062000865565b90600052602060002090601f016020900481019282620003555760008555620003a1565b82601f106200037057805160ff1916838001178555620003a1565b82800160010185558215620003a1579182015b82811115620003a057825182559160200191906001019062000383565b5b509050620003b09190620003b4565b5090565b5b80821115620003cf576000816000905550600101620003b5565b5090565b6000620003ea620003e4846200057e565b6200054a565b9050828152602081018484840111156200040357600080fd5b620004108482856200082f565b509392505050565b600082601f8301126200042a57600080fd5b81516200043c848260208601620003d3565b91505092915050565b600080604083850312156200045957600080fd5b600083015167ffffffffffffffff8111156200047457600080fd5b620004828582860162000418565b925050602083015167ffffffffffffffff811115620004a057600080fd5b620004ae8582860162000418565b9150509250929050565b6000620004c7601f83620005b1565b91507f45524332303a206d696e7420746f20746865207a65726f2061646472657373006000830152602082019050919050565b620005058162000818565b82525050565b600060208201905081810360008301526200052681620004b8565b9050919050565b6000602082019050620005446000830184620004fa565b92915050565b6000604051905081810181811067ffffffffffffffff82111715620005745762000573620008f9565b5b8060405250919050565b600067ffffffffffffffff8211156200059c576200059b620008f9565b5b601f19601f8301169050602081019050919050565b600082825260208201905092915050565b6000620005cf8262000818565b9150620005dc8362000818565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200061457620006136200089b565b5b828201905092915050565b6000808291508390505b600185111562000671578086048111156200064957620006486200089b565b5b6001851615620006595780820291505b8081029050620006698562000928565b945062000629565b94509492505050565b6000620006878262000818565b9150620006948362000822565b9250620006c37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620006cb565b905092915050565b600082620006dd5760019050620007b0565b81620006ed5760009050620007b0565b8160018114620007065760028114620007115762000747565b6001915050620007b0565b60ff8411156200072657620007256200089b565b5b8360020a91508482111562000740576200073f6200089b565b5b50620007b0565b5060208310610133831016604e8410600b8410161715620007815782820a9050838111156200077b576200077a6200089b565b5b620007b0565b6200079084848460016200061f565b92509050818404811115620007aa57620007a96200089b565b5b81810290505b9392505050565b6000620007c48262000818565b9150620007d18362000818565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156200080d576200080c6200089b565b5b828202905092915050565b6000819050919050565b600060ff82169050919050565b60005b838110156200084f57808201518184015260208101905062000832565b838111156200085f576000848401525b50505050565b600060028204905060018216806200087e57607f821691505b60208210811415620008955762000894620008ca565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008160011c9050919050565b61159180620009456000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063715018a61161008c578063a457c2d711610066578063a457c2d71461024f578063a9059cbb1461027f578063dd62ed3e146102af578063f2fde38b146102df576100ea565b8063715018a6146102095780638da5cb5b1461021357806395d89b4114610231576100ea565b806323b872dd116100c857806323b872dd1461015b578063313ce5671461018b57806339509351146101a957806370a08231146101d9576100ea565b806306fdde03146100ef578063095ea7b31461010d57806318160ddd1461013d575b600080fd5b6100f76102fb565b604051610104919061121a565b60405180910390f35b61012760048036038101906101229190610de9565b61038d565b60405161013491906111ff565b60405180910390f35b6101456103b0565b604051610152919061135c565b60405180910390f35b61017560048036038101906101709190610d9a565b6103ba565b60405161018291906111ff565b60405180910390f35b6101936103e9565b6040516101a09190611377565b60405180910390f35b6101c360048036038101906101be9190610de9565b6103f2565b6040516101d091906111ff565b60405180910390f35b6101f360048036038101906101ee9190610d35565b610429565b604051610200919061135c565b60405180910390f35b610211610471565b005b61021b610485565b60405161022891906111e4565b60405180910390f35b6102396104af565b604051610246919061121a565b60405180910390f35b61026960048036038101906102649190610de9565b610541565b60405161027691906111ff565b60405180910390f35b61029960048036038101906102949190610de9565b6105b8565b6040516102a691906111ff565b60405180910390f35b6102c960048036038101906102c49190610d5e565b6105db565b6040516102d6919061135c565b60405180910390f35b6102f960048036038101906102f49190610d35565b610662565b005b60606003805461030a9061148c565b80601f01602080910402602001604051908101604052809291908181526020018280546103369061148c565b80156103835780601f1061035857610100808354040283529160200191610383565b820191906000526020600020905b81548152906001019060200180831161036657829003601f168201915b5050505050905090565b6000806103986106e6565b90506103a58185856106ee565b600191505092915050565b6000600254905090565b6000806103c56106e6565b90506103d28582856108b9565b6103dd858585610945565b60019150509392505050565b60006012905090565b6000806103fd6106e6565b905061041e81858561040f85896105db565b61041991906113ae565b6106ee565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b610479610bbd565b6104836000610c3b565b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6060600480546104be9061148c565b80601f01602080910402602001604051908101604052809291908181526020018280546104ea9061148c565b80156105375780601f1061050c57610100808354040283529160200191610537565b820191906000526020600020905b81548152906001019060200180831161051a57829003601f168201915b5050505050905090565b60008061054c6106e6565b9050600061055a82866105db565b90508381101561059f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105969061133c565b60405180910390fd5b6105ac82868684036106ee565b60019250505092915050565b6000806105c36106e6565b90506105d0818585610945565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b61066a610bbd565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156106da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106d19061125c565b60405180910390fd5b6106e381610c3b565b50565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561075e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107559061131c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156107ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107c59061127c565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516108ac919061135c565b60405180910390a3505050565b60006108c584846105db565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461093f5781811015610931576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109289061129c565b60405180910390fd5b61093e84848484036106ee565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156109b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109ac906112fc565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610a25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1c9061123c565b60405180910390fd5b610a30838383610d01565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610ab6576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aad906112bc565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610ba4919061135c565b60405180910390a3610bb7848484610d06565b50505050565b610bc56106e6565b73ffffffffffffffffffffffffffffffffffffffff16610be3610485565b73ffffffffffffffffffffffffffffffffffffffff1614610c39576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c30906112dc565b60405180910390fd5b565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b505050565b505050565b600081359050610d1a8161152d565b92915050565b600081359050610d2f81611544565b92915050565b600060208284031215610d4757600080fd5b6000610d5584828501610d0b565b91505092915050565b60008060408385031215610d7157600080fd5b6000610d7f85828601610d0b565b9250506020610d9085828601610d0b565b9150509250929050565b600080600060608486031215610daf57600080fd5b6000610dbd86828701610d0b565b9350506020610dce86828701610d0b565b9250506040610ddf86828701610d20565b9150509250925092565b60008060408385031215610dfc57600080fd5b6000610e0a85828601610d0b565b9250506020610e1b85828601610d20565b9150509250929050565b610e2e81611404565b82525050565b610e3d81611416565b82525050565b6000610e4e82611392565b610e58818561139d565b9350610e68818560208601611459565b610e718161151c565b840191505092915050565b6000610e8960238361139d565b91507f45524332303a207472616e7366657220746f20746865207a65726f206164647260008301527f65737300000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610eef60268361139d565b91507f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008301527f64647265737300000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610f5560228361139d565b91507f45524332303a20617070726f766520746f20746865207a65726f20616464726560008301527f73730000000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6000610fbb601d8361139d565b91507f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006000830152602082019050919050565b6000610ffb60268361139d565b91507f45524332303a207472616e7366657220616d6f756e742065786365656473206260008301527f616c616e636500000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061106160208361139d565b91507f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726000830152602082019050919050565b60006110a160258361139d565b91507f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008301527f64726573730000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061110760248361139d565b91507f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008301527f72657373000000000000000000000000000000000000000000000000000000006020830152604082019050919050565b600061116d60258361139d565b91507f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008301527f207a65726f0000000000000000000000000000000000000000000000000000006020830152604082019050919050565b6111cf81611442565b82525050565b6111de8161144c565b82525050565b60006020820190506111f96000830184610e25565b92915050565b60006020820190506112146000830184610e34565b92915050565b600060208201905081810360008301526112348184610e43565b905092915050565b6000602082019050818103600083015261125581610e7c565b9050919050565b6000602082019050818103600083015261127581610ee2565b9050919050565b6000602082019050818103600083015261129581610f48565b9050919050565b600060208201905081810360008301526112b581610fae565b9050919050565b600060208201905081810360008301526112d581610fee565b9050919050565b600060208201905081810360008301526112f581611054565b9050919050565b6000602082019050818103600083015261131581611094565b9050919050565b60006020820190508181036000830152611335816110fa565b9050919050565b6000602082019050818103600083015261135581611160565b9050919050565b600060208201905061137160008301846111c6565b92915050565b600060208201905061138c60008301846111d5565b92915050565b600081519050919050565b600082825260208201905092915050565b60006113b982611442565b91506113c483611442565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156113f9576113f86114be565b5b828201905092915050565b600061140f82611422565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561147757808201518184015260208101905061145c565b83811115611486576000848401525b50505050565b600060028204905060018216806114a457607f821691505b602082108114156114b8576114b76114ed565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b61153681611404565b811461154157600080fd5b50565b61154d81611442565b811461155857600080fd5b5056fea2646970667358221220aa3598d52d8cbd9fba71281a90dfa1c1ec8f0cfbf6209f2950df0dfcb6dc5e7064736f6c63430008000033";

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
