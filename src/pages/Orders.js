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
    const [showDetails, setShowDetails] = useState(false)
    const [currentBooking, setCurrentBooking] = useState([])

    useEffect(()=>{
      getBookings()
  },[])


    async function getBookings(){
      let arrayBookings = [];
      const querySnapshot = await getDocs(collection(db, 'bookings-test'));
      querySnapshot.docs.map(async (doc) => {
        let booking = doc.data();
        arrayBookings.push({
          id: doc.id,
          address: booking.address,
          email: booking.email,
          lastName: capitalize(booking.lastName),
          name: capitalize(booking.name),
          phone: booking.phone,
          method: booking.method,
          paid: booking.paid,
          specificTime: booking.specificTime,
          approved:booking.approved, 
          floorType: booking.floorType,
          created: booking.created,
          damageWaiver: booking.balances.damageWaiver,
          deliveryAmount: booking.balances.deliveryAmount,
          deliveryFee: booking.balances.deliveryFee,
          deposit: booking.balances.deposit,
          insurance: booking.balances.insurance,
          rent: booking.balances.rent,
          tax: booking.balances.tax,
          delivered: booking.delivered,
          pickedUp: booking.pickedUp, 
          total: booking.balances.damageWaiver + booking.balances.deliveryAmount + booking.balances.deliveryFee + booking.balances.insurance + booking.balances.rent + booking.balances.tax - booking.balances.deposit,
          inflatables: booking.inflatables ? booking.inflatables.map((inflatable) => ({
            bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
            inflatableID: inflatable.inflatableID,
            inflatableName: inflatable.inflatableName,
            inflatableImage: inflatable.inflatableImage
          })) : [],
          extras: booking.extras ? booking.extras.map((inflatable) => ({
            bookedDates: inflatable.bookingDates ? [...inflatable.bookingDates] : [],
            inflatableID: inflatable.inflatableID,
            inflatableName: inflatable.inflatableName,
            inflatableImage: inflatable.inflatableImage
          })) : []
        })
      })
      console.log(arrayBookings);
      setBookings(arrayBookings)
    }


    function capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
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

    function getCurrentBooking(id) {
      setShowDetails(true);
      for (let booking of bookings) {
        if (booking.id === id) {
          setCurrentBooking(booking);
          break;
        }
      }
    }
    

  return (
    <div className='orders'>
        <Header action="edit" toggleEdit={()=>setEdit(!edit)}/>
        <Passcode />
        {bookings.map((booking, index) => (
          <div className='wrapper-row' style={{display: edit ? "grid":"block"}}>
            <div className='row' >
              <div  onClick={()=>getCurrentBooking(booking.id)}>
                <p> <b>{booking.name} {booking.lastName} </b></p>
                <p> {booking.address } </p>
                <div className='labels'>
                  <p id="delivered" style={{display: booking.delivered ? "block":"none"}}> Delivered </p>
                  <p id="pickedUp"  style={{display: booking.pickedUp ? "block":"none"}}> Picked Up</p>
                </div> 
              </div>
              <i className="bi bi-chevron-right"   onClick={()=>window.location.href = "/order/" + booking.id}></i>
            </div>
            <i className="bi bi-trash iconDelete" onClick={()=> deleteOrder(booking.id, booking.name + booking.lastName, booking.inflatableName)} style={{display: edit ? "block":"none"}}></i>
          </div>
        ))}
        <div className={showDetails ? 'booking-details slideUp' : 'booking-details slideDown'}>
          <div className='top-grid'>
            <h3> {currentBooking.name}  {currentBooking.lastName} </h3>
            <i className="bi bi-x-circle-fill iconClose" onClick={()=> setShowDetails(false)}></i>
          </div>


          <h2> Customer Information </h2>
          <p> <b> Full Name: </b>{currentBooking.name} {currentBooking.lastName} </p>
          <p> <b> Phone: </b> <span onClick={()=>window.location.href = "tel:" + currentBooking.phone} className='clickeable'>{currentBooking.phone}</span> </p>
          <p> <b> Email: </b> <span onClick={()=>window.location.href = "mailto:" + currentBooking.email} className='clickeable'> {currentBooking.email}</span> </p>
          <p> <b> Address: </b> <span onClick={()=>window.location.href = "https://www.google.com/maps/place/" + currentBooking.address} className='clickeable'>{currentBooking.address} </span></p>
              
          <h2> Booking Information: </h2>
          <p> <b> Booking ID: </b> {currentBooking.id} </p>
          <p> <b> Created: </b> {currentBooking.created} </p>
          <p> <b> Delivery Time: </b> {currentBooking.specificTime} </p>
          <p> <b> Time Frame: </b> 
            {currentBooking.deliveryAmount == 125 ? (
                ' Exact Time'
              ) : currentBooking.deliveryFee == 75 ? (
                ' 1 Hour Frame'
              ) : currentBooking.deliveryFee == 50 ? (
                ' 2 Hour Frame'
              ) : (
                ' No Restriction'
              )
            }
          </p>
          <p> <b> Floor Type: </b> {currentBooking.floorType} </p>
          
          <br></br>
          {currentBooking && currentBooking.inflatables ? (
            currentBooking.inflatables.map((inflatable, index) => (
              <div key={index} className="inflatable">
               <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                <div>
                  <p>{inflatable.inflatableName}</p>
                  <p>{inflatable.bookedDates.join(' > ')}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No inflatables booked.</p>
          )}
          {currentBooking && currentBooking.extras ? (
            currentBooking.extras.map((inflatable, index) => (
              <div key={index} className="inflatable">
               <img src={inflatable.inflatableImage} alt={inflatable.inflatableName} />
                <div>
                  <p>{inflatable.inflatableName}</p>
                  <p>{inflatable.bookedDates.join(' > ')}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No inflatables booked.</p>
          )}
        </div>

        <div className='overlay' style={{display: showDetails ? "block":"none"}} onClick={()=>setShowDetails(false)}></div>
    </div>
  )
}

export default Orders

