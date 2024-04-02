import React, { useEffect, useState } from 'react'
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from "firebase/firestore";
import {app} from '../Firebase';

function Passcode() {
    const db = getFirestore(app)
    const [tempCode, setTempCode] = useState([])
    const [code, setCode] = useState([])
    const [access, setAccess] = useState(false)
    

    useEffect(()=>{
        getCode()
    },[])

    async function getCode(){
        const docRef = doc(db, "config", "codeDeliveryApp");
        const docSnap = await getDoc(docRef);
        setCode(docSnap.data().code)
    }
    

    function handleCode(num) {
        let inCode = [...tempCode];
        inCode.push(num);
        setTempCode(inCode)

        if(tempCode.length >= 3){
            setTempCode([])
        }

        if(inCode.join('') == code) {
            console.log('CORRECT !');
            setAccess(true)
        }
    }
    
    
  return (
    <div className='wrapper-passcode' style={{display: access ? "none":"flex"}}>
        <div className='container'>
            <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png' />
            <div className='digits-container'>
                <i className={tempCode.length > 0 ? "bi bi-circle-fill icon-digit":"bi bi-circle icon-digit"}></i>
                <i className={tempCode.length > 1 ? "bi bi-circle-fill icon-digit":"bi bi-circle icon-digit"}></i>
                <i className={tempCode.length > 2 ? "bi bi-circle-fill icon-digit":"bi bi-circle icon-digit"}></i>
                <i className={tempCode.length > 3 ? "bi bi-circle-fill icon-digit":"bi bi-circle icon-digit"}></i>
            </div>
            <div className='numpad'>
                <button className='btn-num' onClick={()=>handleCode('1')}> 1 </button>
                <button className='btn-num' onClick={()=>handleCode('2')}> 2 </button>
                <button className='btn-num' onClick={()=>handleCode('3')}> 3 </button>
                <button className='btn-num' onClick={()=>handleCode('4')}> 4 </button>
                <button className='btn-num' onClick={()=>handleCode('5')}> 5 </button>
                <button className='btn-num' onClick={()=>handleCode('6')}> 6 </button>
                <button className='btn-num' onClick={()=>handleCode('7')}> 7 </button>
                <button className='btn-num' onClick={()=>handleCode('8')}> 8 </button>
                <button className='btn-num' onClick={()=>handleCode('9')}> 9 </button>
                <button className='btn-num' style={{visibility:"hidden"}}></button>
                <button className='btn-num' onClick={()=>handleCode('0')}> 0 </button>
                <button className='btn-num' style={{visibility:"hidden"}}></button>
            </div>
        </div>
    </div>
  )
}

export default Passcode