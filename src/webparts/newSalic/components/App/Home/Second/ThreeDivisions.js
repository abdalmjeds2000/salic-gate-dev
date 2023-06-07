import React from 'react';
import './ThreeDivisions.css';
import MediaCenter from './MediaCenter';
import CommunityNews from './CommunityNews';
import SocialMedia from './SocialMedia';








const ThreeDivisions = () => {
  return (
    <div className="three-divisions">
      <MediaCenter />
      <CommunityNews />
      <SocialMedia />
    </div>
  )
}

export default ThreeDivisions