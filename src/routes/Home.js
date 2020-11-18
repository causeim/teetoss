import React, { useEffect, useState } from "react";
import Toss from "components/Toss";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import TossFactory from "components/TossFactory";

const Home = ({ userObj }) => {
  const [tosses, setTosses] = useState([]);

  useEffect(() => {
    dbService.collection("tosses").onSnapshot((snapshot) => {
      const tossArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTosses(tossArray);
    });
  }, []);

  return (
    <div className="container">
      <TossFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tosses.map((toss) => (
          <Toss
            key={toss.id}
            tossObj={toss}
            isOwner={toss.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
