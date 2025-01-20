import { useEffect, useState } from "react";
import {  Image } from "@shopify/polaris";
import "../../style.css";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const [Loading, setLoading] =useState(true)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // Trigger a fetch request on component mount (example simulation)
  const Loader = () => {
    <div className="loader-container">
      <div className="loader"></div>
    </div>;
  };

  return (
   
      <div style={{ maxWidth: "10px", margin: "100px" }}>
        {Loading && <Loader />}
        <Image style={{width:"100px", height:"100px"}}
          source="/badgeBoost.png" // Path to the image in the public directory
          alt="Badge Boost icon"
        />
       <p>hhh</p>
      
      </div>
   
  );
}
