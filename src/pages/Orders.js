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
    const [edit, setEdit] = useState(false)

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
                delivered:doc.data().delivered,
                pickedUp: doc.data().pickedUp
            });
        })
        arrayBookings.sort((a, b) => {
          const dateA = new Date(a.bookingDates[0])
          const dateB = new Date(b.bookingDates[0])
          return dateA - dateB;
      });
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

    async function deleteOrder(id, name, inflatable){
      let response = window.confirm("Do you want to delete order: \n Name: " + name + "\n Product: " + inflatable)
      if(response){
        await deleteDoc(doc(db, "bookings", id));
      } 
      getBookings()
    }

  return (
    <div className='orders'>
        <Header action="edit" toggleEdit={()=>setEdit(!edit)}/>
        <Passcode />
        {bookings.map((booking, index) => (
          <div className='wrapper-row' style={{display: edit ? "grid":"block"}}>
            <div className='row' >
                <div id="date" onClick={()=>window.location.href = "/order/" + booking.id}>
                    <p id="day">{booking.bookingDates[0].split('/')[1]}</p>
                    <p id="month">{getMonth(booking.bookingDates[0].split('/')[0])}</p>
                    <p id="year">{booking.bookingDates[0].split('/')[2]}</p>
                </div>
                <div onClick={()=>window.location.href = "/order/" + booking.id}>
                    <p id="name"> {booking.name} {booking.lastName} </p>
                    <p id="inflatable"> {booking.inflatableName} </p>
                    <p id="address"> {booking.address.split(',')[0]},{booking.address.split(',')[1]} </p>
                    <div className='labels'>
                      <p id="delivered" style={{display: booking.delivered ? "block":"none"}}> Delivered </p>
                      <p id="pickedUp"  style={{display: booking.pickedUp ? "block":"none"}}> Picked Up</p>
                    </div>
                </div>
                <div>
                  <i className="bi bi-chevron-compact-right iconChev"></i>
                </div>              
            </div>
            <i className="bi bi-trash iconDelete" onClick={()=> deleteOrder(booking.id, booking.name + booking.lastName, booking.inflatableName)} style={{display: edit ? "block":"none"}}></i>
          </div>
        ))}
    </div>
  )
}

export default Orders