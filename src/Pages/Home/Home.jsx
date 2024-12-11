import React, { useEffect, useState } from "react";

import "./Home.css";
// import "../SecureWeb.css";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import Oppertuinity from "../../Components/Oppertuinity/Oppertuinity";
import { IoMenu } from "react-icons/io5";
import QuickNode from '@quicknode/sdk';

// import Oppertuinity from "./Oppertuinity";

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const keyFeatures = [
    {
      title: "Use Own Funds or Loan Options",
      description: "Trade using your own capital or seamlessly access funds through instant loans.",
    },
    {
      title: "Lightning-Fast Arbitrage",
      description: "Execute trades within milliseconds for optimal profit opportunities.",
    },
    {
      title: "Intuitive Platform",
      description: "Built to accommodate traders of all experience levels.",
    },
    {
      title: "Real-Time Market Insights",
      description: "Leverage automated analysis to stay ahead of market trends.",
    },
  ];

 

  return (
    <section className="secure-body-background">
      <div className="secure-heading">
        <span>
          SECURE ARBITRAGE{" "}
          {/* <i
            className="ms-3 fas fa-bars"
            onClick={() => setIsDrawerOpen(true)}
            style={{ cursor: "pointer", color: 'red' }}
          ></i> */}
          <IoMenu
          className=""
          onClick={() => setIsDrawerOpen(true)}
          style={{ cursor: "pointer", fontSize: '40px' }}
          />
        </span>
      </div>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="container py-5">
        <div className="text-center">
          <h5 className="fw-bold mb-0 pb-0">
            Maximize Your Crypto Profits with Automated Arbitrage Using Own Funds or Loans.
          </h5>
          <p style={{ fontSize: "12px", marginTop: "10px", paddingTop: "0px" }}>
            Effortlessly execute high-speed, risk-free trades on decentralized exchanges using either your own funds or borrowed capital.
          </p>
        </div>

        <div className="mt-5">
          <p>Key Features:</p>
          <div>
            <ul>
              {keyFeatures?.map((item, i) => (
                <li key={i}>
                  <span>{item?.title}: </span>
                  <span>{item?.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Oppertuinity />

        <div className="mt-4 d-flex justify-content-center">
          <button
            onClick={() => {
              navigate("/arbitrage");
            }}
            style={{ background: "#800080", color: "white" }}
            className="btn"
          >
            Auto Bot
          </button>
        </div>
      </main>
    </section>
  );
};

export default Home;
