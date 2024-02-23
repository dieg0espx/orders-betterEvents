import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc, deleteDo, setDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import {app} from '../Firebase';


function Order() {
    const db = getFirestore(app)
    const { id } = useParams();
    const [order, setOrder] = useState([])
    const [orderId, setOrderID] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showLoader, setShowLoader] = useState(true);
    const [sliderValue, setSliderValue] = useState(0);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    async function getBooking(id){
        const docRef = doc(db, "bookings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data())
          setOrderID(docSnap.id)
        } else {
          alert("Order Not Found  :(")
        }
    }
    useEffect(()=>{
        getBooking(id)
    },[id])

    useEffect(() => {
      if(isLoaded == true){
        setTimeout(() => {
          setShowLoader(false)
        }, 1000); // 1000 milliseconds = 1 second
      }
    }, [isLoaded]);
  
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };
  
    useEffect(() => {
      getLocation();
    }, []);

    const handleSliderChange = (event) => {
      const value = parseInt(event.target.value, 10);
      setSliderValue(value);
  
      if (value === 100) {
        // Call your function when the slider reaches 100
        handleSliderComplete();
      }
    };

    const getCurrentDate = () => {
      const currentDate = new Date();
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return currentDate.toLocaleDateString('en-US', dateOptions);
    };
    
    const getCurrentTime = () => {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      return `${hours}:${minutes}`; // E.g., "15:30:00"
    };

    const handleSliderComplete = () => {
      const userConfirmed = window.confirm(`ORDER COMPLETED !  \n ID: ${orderId} \n Delivered: ${getCurrentDate()} | ${getCurrentTime()} `)
      if (userConfirmed) {
        const cityRef = doc(db, 'bookings', orderId);
        setDoc(cityRef, { delivered: true }, { merge: true });
        window.location.href = '/'
      }

    };

    useEffect(() => {
      let timer;
      if (sliderValue > 0) {
        timer = setTimeout(() => {
          setSliderValue(0);
        }, 500);
      }
      return () => clearTimeout(timer);
    }, [sliderValue]);

  return (
    <div className='order'>
        <Header />   
        <div className='wrapper-loader' style={{display: showLoader ? "flex":"none"}}>
          <span className='loader'></span>
          <p id='legend'> Fetching Data</p>
        </div>
        
          <iframe onLoad={()=>setIsLoaded(true)} src={`https://ttfconstruction.com/MapsAPI/index.php?&from=${latitude},${longitude}&&to=${order.address}`} />
          <div className='details'>
              <p id="name"> {order.name} {order.lastName}</p>
              <p id="inflatable"> {order.inflatableName}</p>
              <p id="address"> {order.address} </p>
              <p id="address"> ID: {orderId} </p>
              <div className='action-btns'>
                <button className="btn-call" onClick={()=>window.location.href =`tel:${order.phone}`}> Call Now </button>  
                <button className="btn-call" onClick={()=>window.location.href = `sms:${order.phone}`}> Send Messge </button>
              </div>
            
              <div className='wrapper-slider'>
                <p> Mark as Delivered </p>
                <input className="slider" type="range" id="slider" name="slider" min="0" max="100" value={sliderValue} onChange={handleSliderChange}/>
              </div>
              
          </div>
    </div>
  )
}

export default Order