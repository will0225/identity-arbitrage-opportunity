import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Card, Modal, Button } from "react-bootstrap";
import './Arbitrage.css'
import { motion } from "framer-motion";
import img from './bot.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { FaSquareCheck } from "react-icons/fa6";

const Arbitrage = () => {
  const [loanAmount, setLoanAmount] = useState(100);
  const [exchangeA, setExchangeA] = useState("Pancake Swap");
  const [exchangeB, setExchangeB] = useState("Biswap");
  const [selectedToken, setSelectedToken] = useState("BNB"); // Default to BNB
  const [selectedOption, setSelectedOption] = useState("Seek Loan");
  const [isProcessing, setIsProcessing] = useState(true);
  const [price, setPrice] = useState(null);
  const [reducedPrice, setReducedPrice] = useState(null);
  const [increasedPrice, setIncreasedPrice] = useState(null);
  const [digitalAsset, setDigitalAsset] = useState();
  const [exFee, setExFee] = useState(loanAmount * 0.0007);
  const [sellDigit, setSellDigit] = useState(((100 - 0.07) * 0.001599).toFixed(6)); //unused
  const [exFeeB, setExFeeB] = useState(loanAmount / reducedPrice * 0.0010);
  const exchanges = [
    { name: "Pancake Swap", url: "https://pancakeswap.finance" },
    { name: "Biswap", url: "https://biswap.org" },
    { name: "Mdex", url: "https://mdex.com" },
    { name: "ApeSwap", url: "https://apeswap.finance" },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("https://backend.dsl.sg/tokens-coin");
      let assets = res.data;

      // Sort assets alphabetically by the `symbol` property
      assets.sort((a, b) => a.symbol.localeCompare(b.symbol));

      setDigitalAsset(assets);
      if (assets.length > 0) {
        setSelectedToken(assets[0].symbol); // Set the first token after sorting
        setPrice(assets[0].price.toFixed(6)); // Set the price for the first token
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const numericPrice = Number(price);
    if (!isNaN(numericPrice)) {
      const pre = Number((numericPrice - numericPrice * 0.02).toFixed(6));
      const post = Number((numericPrice + numericPrice * 0.02).toFixed(6));

      setReducedPrice(pre);
      setIncreasedPrice(post);
    } else {
      console.error("Price is not a valid number:", price);
    }
  }, [price]);

  const handleCheckboxChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleChange = (event) => {

    const value = (event.target.value)
    if (value === "") {
      setLoanAmount("");
      return;
    }
    else {
      if (value > 99) {
        const numericValue = Math.min(1000000, Number(value));
        setLoanAmount(numericValue);
      }
      else {

      }
    }

  };

  const [inputValue, setInputValue] = useState();
  const handleLoanInput = (e) => {
    const value = Number(e.target.value);
    if (e.target.value === '') {
      setInputValue('')
      return
    }
    // setInputValue(value);
    // setLoanAmount(100);

    if (/^\d*\.?\d*$/.test(value)) {
      setInputValue(value);
      setLoanAmount(100);
    }
  }

  const handleButtonClick = () => {

    setLoanAmount(inputValue);
    setInputValue(0)
  };

  const handleExchangeAChange = (event) => {
    setExchangeA(event.target.value);
    if (event.target.value === exchangeB) {
      setExchangeB("");
    }
  };

  const handleExchangeBChange = (event) => {
    setExchangeB(event.target.value);
    if (event.target.value === exchangeA) {
      setExchangeA("");
    }
  };

  const handleTokenChange = (event) => {
    const selectedSymbol = event.target.value;
    setSelectedToken(selectedSymbol);
    const selectedAsset = digitalAsset.find(
      (asset) => asset.symbol === selectedSymbol
    );
    if (selectedAsset) {
      setPrice(selectedAsset.price.toFixed(6));
    }
  };
  console.log(selectedToken, 'And+ ', price)

  const filteredExchangesA = exchanges.filter((exchange) => exchange.name !== exchangeB);
  const filteredExchangesB = exchanges.filter((exchange) => exchange.name !== exchangeA);


  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsVisible, setStepsVisible] = useState([]);

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
  };

  const handleClose = () => {
    setShow(false);
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

  let balanceA = (loanAmount - exFee)?.toFixed(6);
  let DAB = (balanceA / reducedPrice).toFixed(6);
  let balanceB = (DAB - exFeeB).toFixed(6);
  let UR = (balanceB * increasedPrice).toFixed(6);
  let TEF = (parseFloat(exFee) + parseFloat(exFeeB) * increasedPrice).toFixed(6);
  let TGF = 0.105022 + 0.105022;
  let LF;
  if (selectedOption === 'Own Funds') {
    LF = loanAmount;
  }
  else {
    LF = (loanAmount * 1.005).toFixed(6)
  }
  let BSF = (1.000000).toFixed(6);
  let TotalExpenses = (parseFloat(TEF) + parseFloat(TGF) + parseFloat(LF) + parseFloat(BSF)).toFixed(6);
  let profit = (UR - TotalExpenses).toFixed(6);


  useEffect(() => {


    let updateExFee;
    if (exchangeA === 'Pancake Swap') updateExFee = (loanAmount * 0.0007).toFixed(6)
    else if (exchangeA === 'Biswap') updateExFee = (loanAmount * 0.0010).toFixed(6)
    else if (exchangeA === 'Mdex') updateExFee = (loanAmount * 0.0030).toFixed(6)
    else if (exchangeA === 'ApeSwap') updateExFee = (loanAmount * 0.0020).toFixed(6)

    setExFee(updateExFee);

    const fee = (loanAmount - updateExFee).toFixed(6)
    const updateSellDigit = (fee / 625.13).toFixed(6);
    setSellDigit(updateSellDigit);
  }, [loanAmount, exchangeA, sellDigit])


  useEffect(() => {
    let updateExFeeB;
    if (exchangeB === 'Pancake Swap') updateExFeeB = (DAB * 0.0007).toFixed(6)
    else if (exchangeB === 'Biswap') updateExFeeB = (DAB * 0.0010).toFixed(6)
    else if (exchangeB === 'Mdex') updateExFeeB = (DAB * 0.0030).toFixed(6)
    else if (exchangeB === 'ApeSwap') updateExFeeB = (DAB * 0.0020).toFixed(6)
    console.log(sellDigit, 'From effect', updateExFeeB)
    setExFeeB(updateExFeeB);
  }, [loanAmount, exchangeB, DAB])


  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) =>
        prevIndex + 1 < stepsVisible.length ? prevIndex + 1 : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [stepsVisible]);


  useEffect(() => window.scroll(0,0) ,[])

  const navigate = useNavigate();
  return (
    <div style={{ background: 'linear-gradient(45deg, #2E292D, #414E55, #2A252D, #3360A2)' }}>

      <h2 className="arbitrage-heading d-flex flex-column flex-sm-row gap-2">
        <span>ARBITRAGE </span><span>BOT</span>
      </h2>
      <Container style={{ marginTop: "10px", paddingBottom: "10px" }}>
        <Card style={{ background: 'transparent', color: 'white' }} className="p-4 border-0">

          <div className="p-4 rounded mb-4" style={{ background: '#2B2C3B' }}>
            <p>
              Earn Smart with Your Own Funds or Borrowed Capital!
            </p>
            <p>
              Maximize your earnings through arbitrage trading, whether using your own funds or our loan options. Take advantage of risk-free opportunities with no collateral required!
            </p>

            <p>Experience the profit potential by using our arbitrage bot to buy digital assets with USDT on Exchange A and sell them for USDT on Exchange B. Start earning today!</p>
          </div>

          <div className="pl-4 py-4 rounded  mb-4" style={{ background: '#2D3A56', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
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

            <div >
              <div className="d-flex align-items-center gap-2">
                <p className="fw-bold fund-width" style={{ paddingTop: "10px", }}>
                  Enter Amt(USDT): </p>
                {
                  selectedOption === 'Seek Loan' ?
                    <select value={loanAmount} onChange={handleChange} style={{ padding: "4px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "4px", width: '180px' }} >

                      {[...Array(10).keys()].map((num) => {
                        let amount = (num + 1) * 100;
                        return (
                          <option key={amount} value={amount}>
                            {amount}
                          </option>
                        );
                      })}
                    </select>
                    :
                   
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      {/* Input field */}
                      <input
                        type="number"
                        value={inputValue}
                        defaultValue={100}
                        onChange={handleLoanInput}
                        onKeyDown={(e) => {
                          // Prevent decimal point input
                          if (e.key === "." || e.key === "e" || e.key === "-") {
                            e.preventDefault();
                          }
                        }}
                        placeholder="Enter amount"
                        min={100}
                        max={1000000}
                        step={100}
                        style={{
                          padding: "4px",
                          fontSize: "16px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "180px",
                        }}
                      />

                      {/* Button */}
                      <button
                        onClick={handleButtonClick}
                        disabled={inputValue < 100 || inputValue >= 1000000} // Disable button if inputValue is out of range
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "50%",
                          transform: "translateY(-50%)", // Center the button vertically
                          padding: "6px 12px",
                          fontSize: "16px",
                          backgroundColor: inputValue >= 100 && inputValue < 1000000 ? "#006666" : "gray", // Gray if disabled
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: inputValue >= 100 && inputValue < 1000000 ? "pointer" : "not-allowed", // Pointer cursor when active
                        }}
                      >
                        <FaCheckCircle />
                        {/* <FaSquareCheck /> */}
                      </button>
                    </div>
                }
              </div>
              <p className="mt-0 pt-0 ex-pad" style={{ fontSize: '12px', color: '#0DCAF0' }} >
                {selectedOption == 'Own Funds' &&
                  'Funds will be deducted from Wallet'}
              </p>
            </div>

            <div>
              {/* Exchange A */}
              <div className="d-flex align-items-center gap-2">
                <p className="fw-bold fund-width" style={{ paddingTop: "10px", }}>Select Exchange A:</p>
                <select
                  value={exchangeA}
                  onChange={handleExchangeAChange}
                  style={{
                    padding: "4px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: '180px'
                  }}
                >
                  {filteredExchangesA.map((exchange) => (
                    <option key={exchange.name} value={exchange.name}>
                      {exchange.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-0 pt-0 ex-pad" style={{ fontSize: '12px', color: '#0DCAF0' }} >
                {exchangeA == 'Pancake Swap' && 'Exchange Fees: 0.07%'}
                {exchangeA == 'Biswap' && 'Exchange Fees: 0.10%'}
                {exchangeA == 'Mdex' && 'Exchange Fees: 0.30%'}
                {exchangeA == 'ApeSwap' && 'Exchange Fees: 0.20%'}
              </p>

              {/* Exchange B */}
              <div className="d-flex align-items-center gap-2 mt-3">
                <p className="fw-bold fund-width" style={{ paddingTop: "10px", }}>Select Exchange B:</p>
                <select
                  value={exchangeB}
                  onChange={handleExchangeBChange}
                  style={{
                    padding: "4px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: '180px'
                  }}
                >
                  {filteredExchangesB.map((exchange) => (
                    <option key={exchange.name} value={exchange.name}>
                      {exchange.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-0 pt-0 ex-pad" style={{ fontSize: '12px', color: '#0DCAF0' }} >
                {exchangeB == 'Pancake Swap' && 'Exchange Fees: 0.07%'}
                {exchangeB == 'Biswap' && 'Exchange Fees: 0.10%'}
                {exchangeB == 'Mdex' && 'Exchange Fees: 0.30%'}
                {exchangeB == 'ApeSwap' && 'Exchange Fees: 0.20%'}
              </p>


              <div className="d-flex align-items-center gap-2 mt-3">
                <p className="fw-bold fund-width" style={{ paddingTop: "10px", }}>Digital Asset:</p>

                <select
                  value={selectedToken}
                  onChange={handleTokenChange}
                  style={{
                    padding: "4px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "180px",
                  }}
                >
                  {digitalAsset?.map((asset) => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>


          <div className="my-4">
            <p><strong>Note:</strong></p>
            <ol style={{ paddingLeft: "20px" }}>
              <li>Loan fees are charged at 0.5% of the loan amount per transaction.</li>
              <li>A service fee of USD 1.00 will apply to each loan request, payable in BNB.</li>
            </ol>

            {/* <p>{reducedPrice}</p>
            <p>{price}</p>
            <p>{increasedPrice}</p> */}
          </div>

          <div className="p-4 rounded mb-4" style={{ background: '#2B2C3B' }}>
            <Table className="overflow-x-auto" bordered responsive style={{ color: "black" }}>
              <thead>
                <tr>
                  <th style={{ width: "50%", background: '#2B2C3B' }}>
                    <p
                      className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"

                    ><span className="text-white">Exchange A:</span> <span className="text-info">{exchangeA}</span></p>
                  </th>
                  <th style={{background: '#2B2C3B' }}>
                    <p
                      className="d-flex flex-column flex-sm-row gap-1 align-items-start p-0 m-0"
                    ><span className="text-white">Exchange B:</span> <span className="text-info">{exchangeB}</span></p>
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="text-dark">
                  <td colSpan="2" style={{ textAlign: "center", verticalAlign: "middle", background: '#D3D3D3' }}>
                    Digital Asset to buy and sell: <span className="fw-bold">{selectedToken}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{background: '#2B2C3B', color: 'white' }}>Buy digital assets: {loanAmount} USDT</td>
                  <td style={{background: '#2B2C3B', color: 'white' }}>Sell Digital assets: {DAB} {selectedToken}</td>
                </tr>
                <tr>
                  <td style={{background: '#2B2C3B', color: 'white' }}>
                    <p className="d-flex flex-column flex-sm-row gap-1 py-0 my-0"> <span>Exchange A fees:</span> <span>
                      {exFee} USDT</span></p>
                  </td>
                  <td
                  style={{background: '#2B2C3B', color: 'white' }}
                  >Exchange B fees: {exFeeB} {selectedToken} ({(exFeeB * 656.386500).toFixed(6)} USDT)</td>
                </tr>
                <tr>
                  <td style={{background: '#2B2C3B', color: 'white' }}>
                    <p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>Balance:</span> <span>
                      {balanceA} USDT</span></p>
                  </td>
                  <td style={{background: '#2B2C3B', color: 'white' }}>
                    <p className="d-flex flex-column flex-sm-row gap-1 p-0 m-0"> <span>Balance:</span> <span>
                      {balanceB} {selectedToken}
                    </span></p>
                  </td>
                </tr>
                <tr>
                  <td style={{background: '#2B2C3B', color: 'white' }}>Digital asset bought: {DAB} {selectedToken}</td>
                  <td style={{background: '#2B2C3B', color: 'white' }}>
                    <p className="d-flex flex-column flex-sm-row gap-1 my-0 py-0 "><span>USDT received: </span>
                      <span>{UR} USDT</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{background: '#2B2C3B', color: 'white' }}>Exchange A gas fees (From wallet): 0.000160 {selectedToken} <span style={{ color: "yellow" }}>(0.105022 USDT)</span> </td>
                  <td style={{background: '#2B2C3B', color: 'white' }}>Exchange B gas fees (From wallet): 0.000160 {selectedToken} <span style={{ color: "yellow" }}>(0.105022 USDT)</span></td>
                </tr>
              </tbody>
            </Table>
          </div>


          <div className="p-4 rounded  mb-5" style={{ background: '#2D3A56' }}>
            <Table className="overflow-x-auto " bordered responsive style={{ color: "black" }}>
              <tbody className="text-white">
                <tr>
                  <td  className="fw-bold" style={{ width: "50%", background: '#2D3A56', color: 'white' }}>
                    Total Exchange Fees
                  </td>
                  <td className="text-right" style={{background: '#2D3A56', color: "yellow", textAlign: 'right' }}>
                    {TEF} USDT
                  </td>
                </tr>
                <tr>
                  <td style={{background: '#2D3A56', color: 'white'}} className="fw-bold">
                    Total Gas Fees (From wallet)
                  </td>
                  <td style={{ color: "yellow", background: '#2D3A56', textAlign: 'right' }}>
                    {TGF} USDT
                  </td>
                </tr>

                <tr>
                  <td style={{background: '#2D3A56', color: 'white'}} className="fw-bold">
                    {selectedOption == 'Own Funds' ? 'Capital' :
                      "Loan + Fees"}
                  </td>
                  <td style={{ color: "yellow", background: '#2D3A56', textAlign: 'right' }}>
                    {LF} USDT
                  </td>
                </tr>
                <tr>
                  <td style={{background: '#2D3A56', color: 'white'}} className="fw-bold">Bot Service Fees</td>
                  <td style={{ color: "yellow", background: '#2D3A56', textAlign: 'right' }}>{BSF} USDT</td>
                </tr>
                <tr>
                  <td style={{background: '#2D3A56', color: 'white'}} className="fw-bold">Total</td>
                  <td className="fw-bold" style={{ color: "yellow", background: '#2D3A56', textAlign: 'right' }}>
                    {TotalExpenses} USDT
                  </td>
                </tr>


                <tr className="bg-black text-white">
                  <td className="fw-bold bg-black text-white">
                    Estimated Profit:
                  </td>
                  <td className="bg-black text-white" style={{ textAlign: 'right' }}>
                    {profit} USDT
                  </td>
                </tr>

              </tbody>
            </Table>
          </div>


          <button style={{ background: 'red', color: 'white' }} onClick={handleShow} className="btn btn-md mx-auto btn-custom">
            Click here to make the profit.
          </button>
          <div>
            <br />
            <h6 className="text-info">
              Assumptions
            </h6>
            <ul style={{ fontSize: '' }}>
              <li>Loan fee: 0.50%</li>
              {/* <li>Buying Price of 1 BNB at {exchangeA}: 625.130000 USDT</li>
              <li>Selling Price of 1 BNB at {exchangeB}: 656.386500 USDT</li> */}
              <li>Gas Fees: 0.000160 BNB <span style={{}}>(0.105022 USDT)</span> </li>
              <li>Service Fees: 1.000000 USDT</li>
            </ul> <hr />
          </div>


          {/* <div >
            <h6>Arbitrage Bot</h6>
          <span >
            Imagine two DEXs, A and B: <br/>
          </span>
          <span>
            A large trade is detected in the mempool that will push the price of Token X up on DEX A.<br/>
          </span>
          <span>
            Before this trade is confirmed, you buy Token X on DEX B at the current lower price.<br/>
          </span>
          <span>
            After the trade on DEX A is confirmed and the price rises, you sell Token X back on DEX A for a profit.<br/>
          </span>
          <span>
            By carefully monitoring mempool transactions, you can capitalize on such opportunities, but success depends on speed, strategy, and execution.
          </span>
        </div> */}
          <div className="arbitrage-scenario">
            <h6 style={{ marginBottom: '20px' }} className="scenario-title mb-2 text-info">Arbitrage Bot Scenario</h6>
            <p className="mt-3 mb-0">Imagine two DEXs, A and B:</p>
            <ol>
              <li>A large trade is detected in the mempool that will push the price of Token X up on DEX A.</li>
              <li>Before this trade is confirmed, you buy Token X on DEX B at the current lower price.</li>
              <li>After the trade on DEX A is confirmed and the price rises, you sell Token X back on DEX A for a profit.</li>
              <li>
                By carefully monitoring mempool transactions, you can capitalize on such opportunities, but success depends on speed, strategy, and execution.
              </li>
            </ol>
          </div>

          <button style={{ background: '#00008B', color: 'white', border: 'none' }} onClick={() => {
            navigate('/secure/opportunities')
          }} className="btn btn-md mx-auto btn-custom my-4">
            Click here to secure the opportunities.
          </button>

          {/* <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {stepsVisible[0] === "Show Transaction Details"
                  ? "Arbitrage Bot"
                  : "Arbitrage Bot"}
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
              }}
            >
              {stepsVisible[0] === "Show Transaction Details" ? (
                <div style={{ width: '100%' }}>
                  <p
                    style={{ width: "200px", whiteSpace: "nowrap" }}
                    className="mx-auto my-4 fw-bold"
                  >
                    {selectedOption === "Own Funds" ? "Capital Amount: " : "Loan Amount: "}
                    {loanAmount} USDT
                  </p>
                  <p
                    style={{ width: "200px", whiteSpace: "nowrap" }}
                    className="mx-auto my-2 mb-4 fw-bold"
                  >
                    Profit: {profit} USDT
                  </p>

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
              )}
            </Modal.Body>
          </Modal> */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {stepsVisible[0] === "Show Transaction Details"
                  ? "Arbitrage Bot"
                  : "Arbitrage Bot"}
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


                    {/* Transaction Details Text */}
                    <p
                      style={{ width: "200px", whiteSpace: "nowrap" }}
                      className="mx-auto my-4 fw-bold"
                    >
                      {selectedOption === "Own Funds" ? "Capital Amount: " : "Loan Amount: "}
                      {loanAmount} USDT
                    </p>
                    <p
                      style={{ width: "200px", whiteSpace: "nowrap" }}
                      className="mx-auto my-2 mb-4 fw-bold"
                    >
                      Profit: {profit} USDT
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
                  {isProcessing && stepsVisible[currentStepIndex] == 'Signing in with Wallet' && (
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        border: "5px solid transparent",
                        borderTop: "5px solid #ff8c00", // Orange color for the spinner
                        animation: "spin 1s linear infinite", // Rotation animation
                        margin: "0 auto",
                        marginBottom: "20px", // Space between spinner and text
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


        </Card>
      </Container>
    </div>
  );
};

export default Arbitrage;