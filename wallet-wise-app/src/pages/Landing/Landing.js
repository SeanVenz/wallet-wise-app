import { Link } from 'react-router-dom';
import'./Landing.css';
import image1 from '../../images/lumpia.png';
import image2 from '../../images/adobo.png';
import image3 from '../../images/ginabot.png';
import image4 from '../../images/siomai.png';
import image5 from '../../images/chicken.png';

function Landing() {
  return (
    <div className='landing-bg'>
      <div className='landing-topBar'>
        <div className='landing-logo'></div>
        <div className='landing-buttons'>
          <Link to="/login"><button className='landing-bot'>Login</button></Link>
          <Link to="/signup"><button className='landing-bot'>Sign Up</button></Link>
        </div>
      </div>
      <div className='landing-midBar'>
        <div className='landing-bigpotato'></div>
        <div className='landing-words'>
          <div className='landing-wallet'>WALLET</div>
          <div className='landing-wise'>WISE</div>
        </div>
        <div className='landing-bigpotato'></div>
      </div>
      <div className='landing-botBar'>
        <div className='landing-option'><img src={image1} alt="Lumpia" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='landing-option'><img src={image2} alt="Adobo" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='landing-option'><img src={image3} alt="Ginabot" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='landing-option'><img src={image4} alt="Siomai" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='landing-option'><img src={image5} alt="Chicken" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
      </div>
      
    </div>

    
  );
}

export default Landing;
