import { Link } from 'react-router-dom';
import'./Landing.css';
import image1 from '../../images/lumpia.png';
import image2 from '../../images/adobo.png';
import image3 from '../../images/ginabot.png';
import image4 from '../../images/siomai.png';
import image5 from '../../images/chicken.png';

function Landing() {
  return (
    <div className='bg'>
      <div className='topBar'>
        <div className='logo'></div>
        <Link to="/login"><button className='bot'>Login</button></Link>
        <Link to="/signup"><button className='bot'>Sign Up</button></Link>
      </div>
      <div className='midBar'>
        <div className='bigpotato'></div>
        <div className='words'>
          <div className='wallet'>WALLET</div>
          <div className='wise'>WISE</div>
        </div>
        <div className='bigpotato'></div>
      </div>
      <div className='botBar'>
        <div className='option'><img src={image1} alt="Lumpia" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='option'><img src={image2} alt="Adobo" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='option'><img src={image3} alt="Ginabot" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='option'><img src={image4} alt="Siomai" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
        <div className='option'><img src={image5} alt="Chicken" style={{ width: '100%', height: '100%', objectFit: 'cover'}}/></div>
      </div>
      
    </div>

    
  );
}

export default Landing;
