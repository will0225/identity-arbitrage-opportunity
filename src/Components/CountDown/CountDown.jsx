import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import '../Oppertuinity/Oppertunities.css'
import '../Oppertuinity/Opportunities.css'

let hasToastBeenShown = false; // Flag to track if the toast has been shown

const CountDown = ({ price, alertShow, setAlertShow, isOthers, isStartPopUp }) => {
    const [countdown, setCountdown] = useState(3);
    const [currentPrice, setCurrentPrice] = useState(price);

   
    useEffect(() => {
        let countdownInterval;
      
        if (!isStartPopUp) {
          countdownInterval = setInterval(() => {
            setCountdown((prev) => (prev > 1 ? prev - 1 : 3)); 
            if (countdown === 2) {
              setCurrentPrice(price);
            }
            if (countdown === 1 && !hasToastBeenShown && price > 0) {
              toast.dismiss();
      
              toast(<div>
                You just missed the chance to earn{" "}
                <span style={{ color: "yellow", }}>
                  {currentPrice} USDT.
                </span> Better luck next time!
              </div>, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "custom-toast",
                onClose: () => setAlertShow(false),
              });
      
              // Set the flag to true to ensure the toast is not shown again
              hasToastBeenShown = true;
            }
          }, 1000);
        }
      
        // Cleanup function to clear the interval and reset the toast flag
        return () => {
          clearInterval(countdownInterval);
          hasToastBeenShown = false; // Reset for the next interval
        };
      }, [isStartPopUp, countdown, price, currentPrice]);
      
      
    return (
        <div>
            {
                // isOthers === 1 && price > 0  ? 
                // <span className='text-center'>
                //     <span style={{ color: 'yellow', fontWeight: 'bold' }}>{countdown} {countdown === 1? 'second': 'seconds'}</span>
                // </span> 
                // : 
                price  > 0 ? (isOthers === 2 ? 
                    <p className='text-center justify-content-center d-flex flex-column flex-sm-row gap-1 my-0 py-2'>
                        Secure the Opportunity Now! <span style={{ color: 'yellow', fontWeight: 'bold' }}>{countdown} {countdown === 1? 'second': 'seconds'}</span> 
                    </p>
                    : 
                    <p className='text-center'>
                        You’re about to miss out on earning <span className='text-decoration-underline fw-bold'>{price}</span> USDT
                        in the next <span style={{ color: 'yellow', fontWeight: 'bold' }}>{countdown} {countdown === 1? 'second': 'seconds'}</span> .
                    </p>
                ):null
            }

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default CountDown;