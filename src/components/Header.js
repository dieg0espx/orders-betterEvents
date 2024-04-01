import React from 'react'
import { useNavigate } from 'react-router-dom';



function Header(props) {
  const navigate = useNavigate();


  function goBack(){
    navigate(-1); // This will navigate back one step in the history stack
  }

  return (
    <div className='header' >
        <i className="bi bi-chevron-compact-left btn-back"  style={{display: props.backButton ? "block" : "none"}} onClick={()=> goBack()}></i>
        <img src='https://res.cloudinary.com/dxfi1vj6q/image/upload/v1705371522/BetterEvents-02_gqzykd_pellx5.png' />
        {/* <i className="bi bi-list iconMenu"></i> */}
    </div>
  )
}

export default Header