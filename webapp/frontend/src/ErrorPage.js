import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

function ErrorPage() {
  let navigate = useNavigate();
  return (
    <div>
        <Result
        status="404"
        title="404"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => {navigate('/') }}>Back Home</Button>}/>
    </div>
  )
}

export default ErrorPage