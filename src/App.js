import logo from './logo.svg';
import './App.scss';
import StudentsCompletionView from './components/StudentsCompletionView';
import ReCAPTCHA from 'react-google-recaptcha';
import { useEffect, useState } from 'react';

function App() {
  useEffect(() => {
    
  }, []);

  return (
    <div className="App">
      
      <StudentsCompletionView />
      {/* <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" 
      onChange={() => console.log('verified')}/> */}
    </div>
  );
}

export default App;
