import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { doc } from "firebase/firestore";
import {app} from '../Firebase';
import Passcode from '../components/Passcode';

function Orders() {
    const db = getFirestore(app)
    const [bookings, setBookings] = useState([])

    async function getBookings(){
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        let arrayBookings = [];
      
        querySnapshot.docs.map(async (doc) => {
            arrayBookings.push({
                id: doc.id,
                address: doc.data().address,
                bookingDates: doc.data().bookingDates,
                email: doc.data().email,
                inflatableID: doc.data().inflatableID,
                lastName: doc.data().lastName,
                name: doc.data().name,
                phone: doc.data().phone,
                postalCode: doc.data().postalCode,
                inflatableImage: doc.data().inflatableImage,
                inflatableName: doc.data().inflatableName, 
                deposit: doc.data().balances.deposit,
                insurance: doc.data().balances.insurance,
                paid: doc.data().balances.paid,
                rent: doc.data().balances.rent,
                method:doc.data().method,
                delivered:doc.data().delivered
            });
        })
        setBookings(arrayBookings)
    }

    useEffect(()=>{
        getBookings()
    },[])

    function getMonth(number){
        const months = [
            "January", "February", "March", "April", 
            "May", "June", "July", "August", 
            "September", "October", "November", "December"
          ];
      
          if (number >= 1 && number <= 12) {
            return months[number - 1];
          } else {
            return "Invalid Month";
          }
    }

  return (
    <div className='orders'>
        <Header />
        <Passcode />
        {bookings.map((booking, index) => (
            <div className='row' onClick={()=>window.location.href = "/order/" + booking.id}>
                <div id="date">
                    <p id="day">{booking.bookingDates[0].split('/')[1]}</p>
                    <p id="month">{getMonth(booking.bookingDates[0].split('/')[0])}</p>
                    <p id="year">{booking.bookingDates[0].split('/')[2]}</p>
                </div>
                <div>
                    <p id="name"> {booking.name} {booking.lastName} </p>
                    <p id="inflatable"> {booking.inflatableName} </p>
                    <p id="address"> {booking.address.split(',')[0]},{booking.address.split(',')[1]} </p>
                </div>
                <div>
                  <i className="bi bi-check-circle-fill iconCheck" style={{display: booking.delivered ? "block":"none"}}></i>
                  <i className="bi bi-chevron-compact-right iconChev"></i>
                </div>
          </div>
        ))}
    </div>
  )
}

export default Orders