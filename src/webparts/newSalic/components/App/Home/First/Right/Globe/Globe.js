import React, { useState, useRef, useEffect, useContext, useCallback } from 'react'
import './Globe.css';
import { AppCtx } from '../../../../App';
import globeBG from './earth.png';
import Globe from 'react-globe.gl';
import Slider from 'infinite-react-carousel';

import GetSubsidiary from './GetSubsidiary'

import productWheat from '../../../../../../assets/icons/globe/Products/Wheat.png'
import productBarley from '../../../../../../assets/icons/globe/Products/Barley.png'
import productCorn from '../../../../../../assets/icons/globe/Products/Corn.png'
import productSoybean from '../../../../../../assets/icons/globe/Products/Soybean.png'
import productRice from '../../../../../../assets/icons/globe/Products/Rice.png'
import productSugar from '../../../../../../assets/icons/globe/Products/Sugar.png'
import productOil from '../../../../../../assets/icons/globe/Products/EdibleOil.png'
import productFodder from '../../../../../../assets/icons/globe/Products/Fodder.png'
import productRedMeat from '../../../../../../assets/icons/globe/Products/RedMeat.png'



function getWindowSize() {
  const {innerWidth, innerHeight} = typeof window !== "undefined" ? window : null;
  return {innerWidth, innerHeight};
}



function SalicGlobe() {
  const globeEl = useRef();
  const ourCountry = ['Canada', 'Barzil', 'United Kingdom', 'Ukraine', 'Saudi Arabia', 'India', 'Australia'];
  const [rotation, setRotation] = useState(true);
  const [currentCountry, setCurrentCountry] = useState('Saudi Arabia');
  const { globe_data, isGlobeReady, setIsGlobeReady } = useContext(AppCtx)
  const [hover, setHover] = useState();
  const [subsidiary, setSubsidiary] = useState([]);
  

  // Get Subsidiary
  useEffect(() => {
    GetSubsidiary().then(res => setSubsidiary(res))
  }, [])


  // Get Window Size
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    function handleWindowResize() {setWindowSize(getWindowSize());}
    window.addEventListener('resize', handleWindowResize);
  }, []);

  // No Load in Mobile
  useEffect(() => {
    if(windowSize.innerWidth < 990) {
      setIsGlobeReady(true)
    } else {
      setIsGlobeReady(false)
    }
  }, [])

  // Globe Ref
  useEffect(() => {
    if(windowSize.innerWidth > 990) {
      globeEl.current?.controls().autoRotate = true;
      globeEl.current?.controls().enableZoom = false;
      globeEl.current?.controls().autoRotateSpeed = 1;
      globeEl.current?.pointOfView({ lat: 30, lng: 45, altitude: 1.7 }, 5000);
    }
  }, [rotation]);
  
  // Stop Rotation on Hover 
  const onHoverHandler = useCallback((polygon) => {
    if (polygon !== null) {
      setHover(polygon.properties.ISO_A3);
      // setRotation(false);
      globeEl.current?.controls().autoRotate = false;
    } else {
      setHover(null);
      // setRotation(true);
      globeEl.current?.controls().autoRotate = true;
    }
  }, []);



  // Return Card by hover on Country
  let cardDataByCountry = (country) => {
    const currentCountryData = subsidiary?.filter(c => c.Country === country)

    if(currentCountryData?.length > 1) {
      return <Slider autoplay={true}>
        {
          currentCountryData.map(card => {
            const companyLogo = card.AttachmentFiles.length == 0 ? null : `https://devsalic.sharepoint.com/${card.AttachmentFiles[0].ServerRelativeUrl}`
            const products = card.Products?.replace(' and',',').split(', ')
            const srcImg = products.map(p => {
              const src = p.includes("Wheat") ? productWheat 
                : p.includes("Barley") ? productBarley 
                : p.includes("Corn") ? productCorn 
                : p.includes("Sheep Meat") ? productRedMeat
                : p.includes("Grain") ? productFodder
                : p.includes("Redc Meat") ? productRedMeat
                : p.includes("Meat") ? productRedMeat
                : p.includes("Services for the crops Cereals") ? productWheat
                : p.includes("Potatoes") ? productWheat
                : p.includes("Soybean") ? productSoybean
                : p.includes("Sugar Beet") ? productSugar
                : p.includes("Oilseed") ? productOil
                : p.includes("Rice") ? productRice
                : productWheat
                
              return src
            })
            return (
              <div class='card-container'>
                <div className='header'>
                  {companyLogo ? <img className='logo' src={companyLogo} alt="Company Logo" /> : null}
                  <div className='title'>
                    <a><h3>{card.Title}</h3></a>
                    <p>{`${card.Country}, ${card.City ? card.City : '-'}`}</p>
                  </div>
                </div>
                <div className='description'>
                  <p>{card.Description}</p>
                </div>
                <div className='products-imgs'>
                  {
                    srcImg.map(imgSrc => {
                      return <img src={imgSrc} alt='' />
                    })
                  }
                  {/* {products.map(p => <p>{p}</p>)} */}
                </div>
              </div>
            )
          })
        }
      </Slider>
    } else if(currentCountryData?.length === 1) {
        const card = currentCountryData[0];
        const companyLogo = card.AttachmentFiles.length == 0 ? null : `https://devsalic.sharepoint.com/${card.AttachmentFiles[0].ServerRelativeUrl}`
        const products = card.Products?.replace(' and',',').split(', ')
        const srcImg = products.map(p => {
          const src = p.includes("Wheat") ? productWheat 
            : p.includes("Barley") ? productBarley 
            : p.includes("Corn") ? productCorn 
            : p.includes("Sheep Meat") ? productRedMeat
            : p.includes("Grain") ? productFodder
            : p.includes("Redc Meat") ? productRedMeat
            : p.includes("Meat") ? productRedMeat
            : p.includes("Services for the crops Cereals") ? productWheat
            : p.includes("Potatoes") ? productWheat
            : p.includes("Soybean") ? productSoybean
            : p.includes("Sugar Beet") ? productSugar
            : p.includes("Oilseed") ? productOil
            : p.includes("Rice") ? productRice
            : productWheat
            
          return src
        })
        return (
          <div class='card-container'>
            <div className='header'>
              {companyLogo ? <img className='logo' src={companyLogo} alt="Company Logo" /> : null}
              <div className='title'>
                <a><h3>{card.Title}</h3></a>
                <p>{`${card.Country}, ${card.City}`}</p>
              </div>
            </div>
            <div className='description'>
              <p>{card.Description}</p>
            </div>
            <div className='products-imgs'>
              {
                srcImg.map(imgSrc => {
                  return <img src={imgSrc} alt='' />
                })
              }
              {/* {products.map(p => <p>{p}</p>)} */}
            </div>
          </div>
        )
    }
  }



  return (
    windowSize.innerWidth > 990
    ? <div className='globe'>
        <Globe 
          ref={globeEl}
          backgroundColor='#ffffff00'
          width={windowSize.innerWidth >= 1900 ? 550 : windowSize.innerWidth >= 1750 ? 520 : windowSize.innerWidth >= 1500 ? 450 : windowSize.innerWidth >= 1400 ? 410 : windowSize.innerWidth >= 1300 ? 380 : windowSize.innerWidth >= 1150 ? 340 : windowSize.innerWidth >= 1000 ? 280 : 0}
          height={windowSize.innerWidth >= 1900 ? 550 : windowSize.innerWidth >= 1750 ? 520 : windowSize.innerWidth >= 1500 ? 450 : windowSize.innerWidth >= 1400 ? 410 : windowSize.innerWidth >= 1300 ? 380 : windowSize.innerWidth >= 1150 ? 340 : windowSize.innerWidth >= 1000 ? 280 : 0}
          hexPolygonsData={globe_data} 
          globeImageUrl={globeBG}
          hexPolygonAltitude={0.02}
          hexPolygonMargin={0.1}
          onGlobeReady={() => setIsGlobeReady(true)}
          // onHexPolygonClick={(polygon, event, { lat, lng, altitude }) => console.log((polygon, event, { lat, lng, altitude }))}
          hexPolygonLabel={({ properties: d }) => {
            if(ourCountry.includes(d.ADMIN)){
              setCurrentCountry(d.ADMIN)
              return `<p style='  
                                color: var(--main-color) !important; 
                                padding: 5px; 
                                border-radius: 5px;
                                background: rgba(255, 255, 255, 0.53);
                                border-radius: 3px;
                                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                                backdrop-filter: blur(4px);
                                -webkit-backdrop-filter: blur(4.3px);
                                border: 1px solid rgba(255, 255, 255, 1);'>
                        ${d.ADMIN}
                      </p>`
            }
            return null
          }}
          hexPolygonColor={({ properties: d }) => {
            return ourCountry.includes(d.ADMIN) ? '#fff' : 'rgba(255, 255, 255, 0.25)'
          }}
          atmosphereColor='#0C508C'
          onHexPolygonHover={onHoverHandler}
        />

        <div className="cards">
          {cardDataByCountry(currentCountry)}
        </div>
      </div>
    : null
  )
}

export default SalicGlobe