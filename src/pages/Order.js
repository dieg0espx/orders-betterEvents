import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import {app} from '../Firebase';
import { load } from 'cheerio';

function Order() {
    const db = getFirestore(app)
    const { id } = useParams();
    const [order, setOrder] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [showLoader, setShowLoader] = useState(true);

    async function getBooking(id){
        const docRef = doc(db, "bookings", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data())
        } else {
          alert("Order Not Found  :(")
        }
    }
    useEffect(()=>{
        getBooking(id)
    },[id])


    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
  
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

    

    useEffect(() => {
      if(isLoaded == true){
        setTimeout(() => {
          setShowLoader(false)
        }, 1000); // 1000 milliseconds = 1 second
      }
    }, [isLoaded]); // Empty dependency array ensures the effect runs only once
  

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
              <button onClick={()=>window.location.href `tel:${order.phone}`}> Call Now </button>
          </div>
    </div>
  )
}

export default Order