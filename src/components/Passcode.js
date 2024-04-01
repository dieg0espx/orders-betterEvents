import React from 'react'

function Passcode() {
    
  return (
    <div className='wrapper-passcode'>
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png' />
        <div className='digits-container'>
            <i className="bi bi-circle icon-digit"></i>
            <i className="bi bi-circle icon-digit"></i>
            <i className="bi bi-circle icon-digit"></i>
            <i className="bi bi-circle icon-digit"></i>
        </div>
        <div className='numpad'>
            <button className='btn-num'> 1 </button>
            <button className='btn-num'> 2 </button>
            <button className='btn-num'> 3 </button>
            <button className='btn-num'> 4 </button>
            <button className='btn-num'> 5 </button>
            <button className='btn-num'> 6 </button>
            <button className='btn-num'> 7 </button>
            <button className='btn-num'> 8 </button>
            <button className='btn-num'> 9 </button>
            <button className='btn-num' style={{visibility:"hidden"}}></button>
            <button className='btn-num'> 0 </button>
            <button className='btn-num' style={{visibility:"hidden"}}></button>
        </div>
    </div>
  )
}

export default Passcode