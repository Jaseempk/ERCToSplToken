export const ERC20LockABI = [
    {
        "inputs": [
            {
                "internalType": "contract IERC20",
                "name": "_tokenToLock",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ELOCK__BridgeFailed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ELOCK__InsufficientTokenBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ELOCK__InvalidChain",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ELOCK__InvalidTokenAddress",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ELOCK__SenderMustBeCaller",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "destToken",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "chainId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ercAmount",
                "type": "uint256"
            }
        ],
        "name": "tokenBridgeDone",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
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
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "name": "bridgeDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "destToken",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "chainId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "ercAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destToken",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "chainId",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "ercAmount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ERC20Lock.Token",
                "name": "newTransfer",
                "type": "tuple"
            }
        ],
        "name": "bridgeToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "i_tokenToLock",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]