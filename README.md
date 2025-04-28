# CreamyHub

Welcome to **CreamyHub**, a decentralized application (dApp) built on the Tea Sepolia testnet. CreamyHub provides a suite of tools for interacting with the Tea Sepolia network, including NFT minting, liquidity pool management, multi-sending TEA tokens, staking, and more. This dApp is designed to be user-friendly with a clean UI and supports both light and dark modes.

## Features

CreamyHub offers the following features:

- **Wallet Integration**: Connect your wallet (MetaMask or OKX Wallet) to interact with the Tea Sepolia network.
- **NFT Minting**: Mint NFTs directly to your wallet on Tea Sepolia and view your NFT collection.
- **Liquidity Pool Management**:
  - Add liquidity to the TEA/USDT pool and receive LP tokens.
  - Remove liquidity and burn LP tokens.
  - Stake LP tokens to earn TEA rewards.
- **Multi Sender**: Send TEA tokens to multiple addresses in a single transaction.
- **Staking OSS**: Stake and unstake TEA tokens to earn rewards.
- **Checker TEA**: View your activities and transaction history on the Tea Sepolia network.
- **Token Deployment**: Deploy your own ERC-20 token on Tea Sepolia with custom name, ticker, and supply.
- **USDT Faucet**: Claim 1000 USDT every 24 hours to use for adding liquidity.
- **Recent Transactions**: View your recent transactions with links to the Tea Sepolia explorer.
- **Dark Mode**: Toggle between light and dark themes for a better user experience.
- **Responsive Design**: Fully responsive UI that works on both desktop and mobile devices.
- **Tea Leaf Animation**: A subtle falling tea leaf animation in the background for a calming effect.

## Smart Contracts

Below are the smart contracts used in CreamyHub, deployed on the Tea Sepolia testnet:

- **CreamyHub NFT Contract**: Used for minting and managing NFTs.
  - Address: `0xe5e3F56D06cC003B2d2f6eCdb89A2e9aDbB38056`
  - Functions:
    - `mint(address to)`: Mint an NFT to the specified address.
    - `balanceOf(address owner)`: Check the number of NFTs owned by an address.

- **TEA/USDT Liquidity Pool Contract**: Manages the TEA/USDT liquidity pool.
  - Address: `0x4FA264E6491b7ed420540f24021d89EedB340a76`
  - Functions:
    - `addLiquidity(uint256 teaAmount, uint256 usdtAmount)`: Add liquidity to the pool.
    - `removeLiquidity(uint256 lpAmount)`: Remove liquidity and burn LP tokens.

- **Staking Contract for LP Tokens**: Handles staking of LP tokens to earn TEA rewards.
  - Address: `0x6B67007e1C158caDAa4553A5B349051E3C6aEce9`
  - Functions:
    - `stake(uint256 amount)`: Stake LP tokens.
    - `unstake(uint256 amount)`: Unstake LP tokens.

- **TEA Staking Contract (OSS)**: Manages staking and unstaking of TEA tokens.
  - Address: `0x28774F2d350BAA80B098b8da0905dEACA9905b8a`
  - Functions:
    - `stake(uint256 amount)`: Stake TEA tokens.
    - `unstake(uint256 amount)`: Unstake TEA tokens.

- **Multi Sender Contract**: Facilitates sending TEA to multiple addresses in one transaction.
  - Address: `0x3202A3533fd45567a55Ce0ffC3A89e95b3c9A06E`
  - Functions:
    - `multiSend(address[] recipients, uint256[] amounts)`: Send TEA to multiple addresses.

- **Token Deployer Contract**: Deploys new ERC-20 tokens on Tea Sepolia.
  - Address: `0x0000000000000000000000000000000000000000`
  - Functions:
    - `deployToken(string name, string ticker, uint256 supply)`: Deploy a new ERC-20 token.

- **USDT Faucet Contract**: Provides 1000 USDT every 24 hours for liquidity purposes.
  - Address: `0x581711F99DaFf0db829B77b9c20b85C697d79b5E`
  - Functions:
    - `claim()`: Claim 1000 USDT (once every 24 hours).

**Note**: The contract addresses above are placeholders. Replace them with the actual addresses after deployment.

## Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, etc.) with MetaMask or OKX Wallet installed.
- Access to the Tea Sepolia testnet (add it to your wallet).

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/robynasuro/creamyhub.git
   cd creamyhub
