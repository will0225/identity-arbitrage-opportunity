import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Modal, Table } from 'react-bootstrap';
import './Opportunities.css';
import axios from 'axios';
import { motion } from "framer-motion";
import CountDown from '../CountDown/CountDown';

// import CountDown from '../../Opportunities/CountDown';

const Oppertuinity = () => {
  const [selectedOption, setSelectedOption] = useState("Seek Loan");
  const services = [];
  let loan
  if(selectedOption == 'Seek Loan'){
    loan = Array.from({ length: (1000 / 1) }, (_, i) => (99 + i + 1) * 1);
  }
  else{
    loan = Array.from({ length: (1000000 / 1)-99 }, (_, i) => (99+ i + 1) * 1);
  }

  // console.log('loan ammount', loan);
  const [loanAmount, setLoanAmount] = useState(loan[[Math.floor(Math.random() * loan?.length)]]?.toFixed(6));
  const [selectedServices, setSelectedServices] = useState([]);
  const [exchangeA, setExchangeA] = useState("");
  const [exchangeB, setExchangeB] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [price, setPrice] = useState(null);
  const [reducedPrice, setReducedPrice] = useState(null);
  const [increasedPrice, setIncreasedPrice] = useState(null);
  const [exFee, setExFee] = useState((loanAmount * 0.0007).toFixed(6));
  const [exFeeB, setExFeeB] = useState(loanAmount / reducedPrice * 0.0010); 
  const [digitalAsset, setDigitalAsset] = useState();
  const [alertShow, setAlertShow] = useState(false);
  const [stepsVisible, setStepsVisible] = useState([]);
  const [show, setShow] = useState(false);
  const [isStartPopUp, setIsStartPopUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [estimateProfit, setEstimateProfit] = useState(null);
  const [estimatedFunds, setEstimatedFunds] = useState(null);
  const [DAB, setDAB] = useState(null);
  const [assetIndex, setAssetIndex] = useState(0);
  const fetchData = async () => {
    try {
  
    let data = JSON.stringify({
      "query": `
      subscription {
  EVM(network: bsc, mempool: true) {
    DEXTrades(
      orderBy: {ascending: Transaction_Time}
      limit: {count: 10, offset: 0}
      where: {Trade: {Buy: {}, Sell: {Currency: {SmartContract: {is: "0x55d398326f99059fF775485246999027B3197955"}}}}}
    ) {
      Trade {
        Dex {
          ProtocolFamily
          ProtocolName
          ProtocolVersion
          SmartContract
          Pair {
            Name
            SmartContract
            Symbol
          }
          OwnerAddress
        }
        Buy {
          Amount
          AmountInUSD
          Buyer
          Price
          PriceInUSD
          Seller
          URIs
          Currency {
            Name
            ProtocolName
            SmartContract
            Symbol
          }
        }
        Fees {
          Amount
          AmountInUSD
          Recipient
          Payer
          Currency {
            Name
            ProtocolName
            SmartContract
            Symbol
          }
        }
        Sender
        Sell {
          Amount
          AmountInUSD
          Buyer
          Price
          PriceInUSD
          Seller
          Currency {
            SmartContract
            ProtocolName
            Name
            Symbol
          }
        }
      }
      Fee {
        Burnt
        BurntInUSD
        EffectiveGasPrice
        EffectiveGasPriceInUSD
        GasRefund
        SenderFee
        SenderFeeInUSD
        PriorityFeePerGasInUSD
        PriorityFeePerGas
        MinerRewardInUSD
        MinerReward
      }
      Block {
        GasUsed
        GasLimit
        Hash
        BaseFee
        Date
        Time
      }
      Transaction {
        Gas
        GasPrice
        Value
        Time
        Hash
        Nonce
        GasFeeCapInUSD
        GasFeeCap
        Cost
        From
        CostInUSD
        GasPriceInUSD
      }
      TransactionStatus {
        Success
        FaultError
        EndError
      }
    }
  }
}

      `,
    });
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://streaming.bitquery.io/graphql',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer ory_at_gJfi3Gmo7Md90yQVvm9c82385nC_fEdI7JdtJMGaXlQ.7-WOzV2tG27WTDRB_GvXu3ulc1sxGJM3peKUrNbhm9k', 
          'X-API-KEY': 'BQYwznaCCPFALJ7NZ2HzlgZcvUxya0Yy	'
        },
        data : data
    };

     const res = await axios.request("/dummy.json");
     const assets = res.data.EVM.DEXTrades;
      setDigitalAsset(assets);
      if (assets.length > 0) {
        // setSelectedToken(assets[0].Trade.Buy.Currency.Symbol);
        // setPrice(assets[0].Trade.Buy.PriceInUSD.toFixed(6));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //********** */ this is previous one ************* 
  useEffect(() => {
    let interval;
    
    if (!isStartPopUp) {

      interval = setInterval(() => {
        if (digitalAsset.length > 0) {
          const filteredAssets = digitalAsset;

          if (filteredAssets.length > 0) { 
            const randomIndex = Math.floor(Math.random() * filteredAssets.length);
            
            const randomAsset = filteredAssets[randomIndex];
            setAnimate(true);
            setTimeout(() => {
              setAnimate(false);
            }, 2000);
            let firstIndex = randomIndex;
            let secondIndex;
            let secondToken;
           
            secondToken = filteredAssets.filter((asset) => 
            {
            if((asset.Trade.Buy.Currency.Symbol === randomAsset.Trade.Buy.Currency.Symbol)
            && (asset.Trade.Dex.ProtocolFamily != randomAsset.Trade.Dex.ProtocolFamily) 
            && (asset.Trade.Buy.PriceInUSD.toFixed(2) != randomAsset.Trade.Buy.PriceInUSD.toFixed(2)))
            {
              return asset;
            }
            });
            if(secondToken.length == 0) return;
            secondIndex = filteredAssets.indexOf(secondToken[0]);
            var NumberOffirstToken = randomAsset.Trade.Buy.AmountInUSD/randomAsset.Trade.Buy.PriceInUSD;
            // secondToken = secondToken.filter((token) => {
            //   var amountOfToken = token.Trade.Buy.AmountInUSD/token.Trade.Buy.PriceInUSD;
            //   if(Number.parseInt(Math.abs(amountOfToken - NumberOffirstToken)) > 0) return token;
            // })
            console.log(randomAsset)
            console.log(secondToken[0])
            
            var NumberOfSecondToken = secondToken[0].Trade.Buy.AmountInUSD/secondToken[0].Trade.Buy.PriceInUSD;
            var AmountOfDitalAsset = Number.parseInt(Math.abs(NumberOfSecondToken - NumberOffirstToken))
           
            if(AmountOfDitalAsset == 0) return
            setSelectedToken(randomAsset.Trade.Buy.Currency.Symbol);
      
            setPrice(randomAsset.Trade.Buy.PriceInUSD.toFixed(6));
            var reduced = 0;
            var increased = 0
            if(secondToken[0].Trade.Buy.PriceInUSD > filteredAssets[firstIndex].Trade.Buy.PriceInUSD)
            {
              setSelectedServices([filteredAssets[firstIndex].Trade.Dex.ProtocolFamily, secondToken[0].Trade.Dex.ProtocolFamily]);
              setReducedPrice(filteredAssets[firstIndex].Trade.Buy.PriceInUSD.toFixed(2));
              setIncreasedPrice(secondToken[0].Trade.Buy.PriceInUSD.toFixed(2));
              reduced = filteredAssets[firstIndex].Trade.Buy.PriceInUSD.toFixed(2);
              increased = secondToken[0].Trade.Buy.PriceInUSD.toFixed(2);
            }
            else {
              setSelectedServices([secondToken[0].Trade.Dex.ProtocolFamily, filteredAssets[firstIndex].Trade.Dex.ProtocolFamily]);
              setIncreasedPrice(filteredAssets[firstIndex].Trade.Buy.PriceInUSD.toFixed(2));
              setReducedPrice(secondToken[0].Trade.Buy.PriceInUSD.toFixed(2));
              reduced = secondToken[0].Trade.Buy.PriceInUSD.toFixed(2);
              increased = filteredAssets[firstIndex].Trade.Buy.PriceInUSD.toFixed(2);
            }

            setDAB(AmountOfDitalAsset);
            setEstimateProfit((AmountOfDitalAsset * (increased-reduced)).toFixed(2))
            setEstimatedFunds((AmountOfDitalAsset*reduced).toFixed(2));
            
          } else {
            console.log("No valid assets available after filtering out 'VVS'.");
          }
        }
        
        setAlertShow(true);
        
      }, 3000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isStartPopUp, digitalAsset, services]);

  useEffect(() => {
    window.scroll(0, 0)
  }, [])


  const handleTokenChange = (event) => {
    const selectedSymbol = event.target.value;
    setSelectedToken(selectedSymbol);

    const selectedAsset = digitalAsset.find(
      (asset) => asset.Trade.Buy.Currency.Symbol === selectedSymbol
    );
    if (selectedAsset) {
      setPrice(selectedAsset.Trade.Buy.PriceInUSD.toFixed(6));
    }
  };


  useEffect(() => {
    let updateExFee;
    if (selectedServices[0] === 'Pancake Swap') updateExFee = ((loanAmount) * 0.0007).toFixed(6)
    else if (selectedServices[0] === 'Biswap') updateExFee = ((loanAmount) * 0.0010).toFixed(6)
    else if (selectedServices[0] === 'Mdex') updateExFee = ((loanAmount) * 0.0030).toFixed(6)
    else if (selectedServices[0] === 'ApeSwap') updateExFee = ((loanAmount) * 0.0020).toFixed(6)

    setExFee(updateExFee);
  }, [loanAmount, selectedServices[0]])


  useEffect(() => {
    let updateExFeeB;
    if (selectedServices[1] === 'Pancake Swap') updateExFeeB = (DAB * 0.0007).toFixed(6)
    else if (selectedServices[1] === 'Biswap') updateExFeeB = (DAB * 0.0010).toFixed(6)
    else if (selectedServices[1] === 'Mdex') updateExFeeB = (DAB * 0.0030).toFixed(6)
    else if (selectedServices[1] === 'ApeSwap') updateExFeeB = (DAB * 0.0020).toFixed(6)
    setExFeeB(updateExFeeB);
  }, [loanAmount, selectedServices[1], DAB])

  // console.log('Calculation ===>>>', estimateProfit, 'Type ===>>', typeof (estimateProfit));


  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };


  // modal work here 

  const steps =
    selectedOption === "Own Funds"
      ? [
        "Signing in with Wallet",
        `Deducting ${loanAmount} USD worth of USDT and 1 USD worth of BNB from your wallet.`,
        `Buying from ${exchangeA}.`,
        `Selling at ${exchangeB}.`,
        "Capital and Profit Transferred to Wallet.",
        "Show Transaction Details",
      ]
      : [
        "Signing in with Wallet",
        `Seeking Loan from Liquidity Pool.`,
        "Deducting 1 USD worth of BNB from your wallet.",
        "Loan Approved.",
        `Buying from ${exchangeA}.`,
        `Selling at ${exchangeB}.`,
        "Paying Back Loans and Fees.",
        "Profit Transferred to Wallet.",
        "Show Transaction Details",
      ];

  const handleShow = () => {
    setShow(true);
    setStepsVisible([]);
    setCurrentStep(0);
    startStepDisplay();
    setIsStartPopUp(true);
  };

  const handleClose = () => {
    setShow(false);
    setIsStartPopUp(false);
  };

  const startStepDisplay = () => {
    steps.forEach((step, index) => {
      setTimeout(() => {
        setStepsVisible([step]);

        if (index === steps.length - 1) {

        }
      }, index * 4000);
    });
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) =>
        prevIndex + 1 < stepsVisible.length ? prevIndex + 1 : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [stepsVisible]);

  return (
    <section className=''>
      <>
        {/* <h2 className="oppertunities-heading">
          <span>SECURE OPPORTUNITIES</span>
        </h2> */}
      </>
      <div className=' mt-0 pt-0' >
        <div className=" mt-0 pt-0"> {/* Bootstrap container */}
          <div className="card  border-0" style={{ background: 'transparent', color: 'white' }}>

            <div className="pl-4 py-4 rounded  my-2" 
            style={{ 
              paddingLeft: '1.5rem', 
              paddingRight: '1.5rem' }}>
              <div>
                <div>
                  <div className="d-flex align-items-sm-start align-items-md-center align-items-lg-center justify-content-center gap-2 my-1 " style={{height: '40px'}}>
                    <div className="d-flex flex-column flex-sm-row align-items-center gap-2 ">
                      {/* <select
                        value={selectedToken}
                        onChange={handleTokenChange}
                        style={{
                          padding: "4px",
                          fontSize: "16px",
                          border: `2px solid ${animate ? "#ccc" : "#ccc"}`,
                          borderRadius: "4px",
                          width: "180px",
                          transition: "all 0.3s ease",
                        }}
                        disabled
                        className={animate ? "flash-animation" : ""}
                        
                      > */}
                        {/* {digitalAsset?.map((asset) => (
                          <option key={asset.Trade.Buy.Currency.Symbol} value={asset.Trade.Buy.Currency.Symbol}  className={animate ? "grow-option" : ""}>
                            {asset.Trade.Buy.Currency.Symbol}
                          </option>
                        ))} */}
                      {/* </select> */}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <CountDown
              price={estimateProfit}
              alertShow={alertShow}
              setAlertShow={setAlertShow}
              isStartPopUp = {isStartPopUp}
            />

            <div className="p-4 rounded mb-2" style={{ background: 'rgb(62 64 96)' }}>
              <Table className="overflow-x-auto" bordered responsive style={{ color: "black",  }}>
                <thead>
                  <tr style={{ background: '#D3D3D3' }} className='fw-bold text-dark'>
                    <th style={{ width: "50%", background: '#D3D3D3' }}>
                    <p
                      className="d-flex flex-column flex-sm-row gap-1 p-0 m-0 responsive-text"
                    >
                      <span className="">Name of Digital </span>
                      <span className="">Asset</span>
                      <span className="text-info"></span>
                    </p>
                    </th >
                    <th style={{ width: "50%", background: '#D3D3D3' }}>
                    <p
                      className="d-flex flex-column flex-sm-row gap-1 p-0 m-0 responsive-text"
                    >
                      <span className="">Amount of Digital </span>
                      <span className="">Asset</span>
                      <span className="text-info"></span>
                    </p>
                      {/* <p
                        className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"
                      ><span className=""> Asset</span> <span className="text-info"></span></p> */}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white bg-transparent ">

                  <tr style={{background: '#3E4060'}}>
                    <td style={{ color: '#90EE90', background: '#3E4060' }} >{selectedToken}</td>
                    <td style={{background: '#3E4060', color: 'white'}}>
                      <p className="d-flex flex-column flex-sm-row gap-1 mb-0 pb-0">
                        <span>{DAB} </span>
                        
                      </p>
                    </td>
                  </tr>
                  <tr style={{ background: '#D3D3D3' }} className='fw-bold text-dark'>
                    <td style={{ background: '#D3D3D3' }}>
                      <p className="d-flex flex-column flex-sm-row gap-1 mb-0 pb-0"> <span>Low Price at</span> <span style={{ color: '#4B0082' }} className=''>{selectedServices[0]}</span>

                      </p>
                      <p className="my-0 py-0" style={{ fontSize: '12px', color: '#335D9A' }} >
                        {selectedServices[0] == 'Pancake Swap' && 'Exchange Fees: 0.07%'}
                        {selectedServices[0] == 'Biswap' && 'Exchange Fees: 0.10%'}
                        {selectedServices[0] == 'Mdex' && 'Exchange Fees: 0.30%'}
                        {selectedServices[0] == 'ApeSwap' && 'Exchange Fees: 0.20%'}
                      </p>
                    </td>
                    <td style={{ background: '#D3D3D3' }}>
                      <p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>High Price at </span> <span style={{ color: '#4B0082' }} className=''>
                        {selectedServices[1]}</span></p>
                      <p className="my-0 py-0" style={{ fontSize: '12px', color: '#335D9A' }} >
                        {selectedServices[1] == 'Pancake Swap' && 'Exchange Fees: 0.07%'}
                        {selectedServices[1] == 'Biswap' && 'Exchange Fees: 0.10%'}
                        {selectedServices[1] == 'Mdex' && 'Exchange Fees: 0.30%'}
                        {selectedServices[1] == 'ApeSwap' && 'Exchange Fees: 0.20%'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{background: '#3E4060', color: 'white'}}>
                      <p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>
                       
                        {reducedPrice} USDT
                      </span> 
                          </p>
                    </td>
                    <td style={{background: '#3E4060', color: 'white'}}>
                      <p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>
                        {increasedPrice} USDT
                      </span> 
                        </p>
                    </td>
                  </tr>
                  <tr style={{ background: '#D3D3D3' }} className='fw-bold text-dark'>
                    <td style={{ background: '#D3D3D3' }}><p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>Estimated </span> <span>
                    Fund(USDT) </span></p>
                    </td>
                    <td style={{ background: '#D3D3D3' }} className="d-flex flex-column flex-sm-row gap-1 "><span>Estimated </span>
                      <span>Profit(USDT) </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{background: '#3E4060', color: 'white'}} >{estimatedFunds}
                    </td>
                    <td className='bg-info text-dark'>
                      {/* 2.857716 */}
                      {estimateProfit}
                    </td>
                  </tr>
                  <tr className="text-dark" style={{ display: estimateProfit > 0?"contents":"none"}}>
                    <td
                      colSpan="2"
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: "red",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => handleShow()}
                    >
                      {/* <br /> */}
                      <CountDown
                        price={estimateProfit}
                        alertShow={alertShow}
                        setAlertShow={setAlertShow}
                        isOthers={2}
                        isStartPopUp = {isStartPopUp}
                      />
                    </td>
                  </tr>

                </tbody>
              </Table>

              <div className="d-flex gap-5">
                <label className="d-flex items-center gap-2">
                  <input type="checkbox" value="Own Funds" checked={selectedOption === "Own Funds"} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-500" />
                  <span>Own Funds</span>
                </label>

                <label className="d-flex items-center gap-2">
                  <input type="checkbox" value="Seek Loan" checked={selectedOption === "Seek Loan"} onChange={handleCheckboxChange} className="h-5 w-5 text-blue-500" />
                  <span>Seek Loan</span>
                </label>
              </div>
            </div>

            {/* modal here  */}
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  {stepsVisible[0] === "Show Transaction Details"
                    ? "SECURE OPPORTUNITIES"
                    : "SECURE OPPORTUNITIES"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body
                style={{
                  background: "#114372",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "300px",
                  position: "relative",
                }}
              >
                {stepsVisible[0] === "Show Transaction Details" ? (
                  <div style={{ width: '100%' }}>
                    <motion.div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginBottom: "10px",
                      }}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 1 }}
                    >
                      {/* Processing ring above the text */}
                      <p
                        style={{  whiteSpace: "nowrap" }}
                        className="mx-auto my-2 fw-bold"
                      >
                        {selectedOption === "Own Funds" ? "Capital Amount: " : "Loan Amount: "}
                        {loanAmount} USDT
                      </p>
                      <p
                        style={{  whiteSpace: "nowrap" }}
                        className="mx-auto my-2 mb-4 fw-bold"
                      >
                        Profit: {estimateProfit} USDT
                      </p>
                    </motion.div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                      }}
                    >
                      <Button variant="danger" onClick={handleClose}>
                        Close
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {stepsVisible[currentStepIndex] == 'Signing in with Wallet' && (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          border: "5px solid transparent",
                          borderTop: "5px solid #ff8c00", 
                          animation: "spin 1s linear infinite", 
                          margin: "0 auto",
                          marginBottom: "20px",
                        }}
                      ></div>
                    )}
                    <motion.p
                      className="text-center fw-bold"
                      key={currentStepIndex}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 1 }}
                    >
                      {stepsVisible[currentStepIndex]}
                    </motion.p>
                  </div>
                )}
              </Modal.Body>
            </Modal>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Oppertuinity;
