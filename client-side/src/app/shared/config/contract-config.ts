export const ContractConfig = {
  contract:
    {
      address: '0x22e1728b570b583cec5f2694ca5b67ab611409d1',
      abi: [
        {
          "constant": true,
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "car",
              "type": "uint256"
            }
          ],
          "name": "getCar",
          "outputs": [
            {
              "name": "vin",
              "type": "bytes32"
            },
            {
              "name": "metaIpfsHash",
              "type": "bytes"
            },
            {
              "name": "seller",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "addr",
              "type": "address"
            }
          ],
          "name": "getCustomer",
          "outputs": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "registrationDate",
              "type": "uint256"
            },
            {
              "name": "shippingAddress",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "orderId",
              "type": "uint256"
            }
          ],
          "name": "getOrder",
          "outputs": [
            {
              "name": "part",
              "type": "uint256"
            },
            {
              "name": "date",
              "type": "uint256"
            },
            {
              "name": "customer",
              "type": "address"
            },
            {
              "name": "seller",
              "type": "address"
            },
            {
              "name": "status",
              "type": "uint8"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "part",
              "type": "uint256"
            }
          ],
          "name": "getPartForSale",
          "outputs": [
            {
              "name": "partType",
              "type": "bytes32"
            },
            {
              "name": "car",
              "type": "uint256"
            },
            {
              "name": "price",
              "type": "uint256"
            },
            {
              "name": "daysForDelivery",
              "type": "uint8"
            },
            {
              "name": "metaIpfsHash",
              "type": "bytes"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "addr",
              "type": "address"
            }
          ],
          "name": "getSeller",
          "outputs": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "registrationDate",
              "type": "uint256"
            },
            {
              "name": "shippingAddress",
              "type": "string"
            },
            {
              "name": "sellerCars",
              "type": "uint256[]"
            },
            {
              "name": "sellerOrders",
              "type": "uint256[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "CarPartStore",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "order",
              "type": "uint256"
            }
          ],
          "name": "rejectPart",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "order",
              "type": "uint256"
            }
          ],
          "name": "sellerRequestPayment",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "vin",
              "type": "bytes32"
            },
            {
              "name": "metaIpfsHash",
              "type": "bytes"
            }
          ],
          "name": "registerCar",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "partType",
              "type": "bytes32"
            },
            {
              "name": "carId",
              "type": "uint256"
            },
            {
              "name": "price",
              "type": "uint256"
            },
            {
              "name": "daysForDelivery",
              "type": "uint8"
            },
            {
              "name": "metaIpfsHash",
              "type": "bytes"
            }
          ],
          "name": "addPart",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "part",
              "type": "uint256"
            }
          ],
          "name": "buyPart",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "new_owner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "orderId",
              "type": "uint256"
            }
          ],
          "name": "returnPart",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "order",
              "type": "uint256"
            }
          ],
          "name": "payToSeller",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "shippingAddress",
              "type": "string"
            }
          ],
          "name": "registerSeller",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "shippingAddress",
              "type": "string"
            }
          ],
          "name": "registerCustomer",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "payable": true,
          "stateMutability": "payable",
          "type": "fallback"
        }
      ]
    }
}
