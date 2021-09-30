
import './App.css';
import { useState,useEffect } from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import  {Popup} from 'react-map-gl';
import {Room,Star}from '@material-ui/icons';
import axios from 'axios';
import { format} from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
function App() {
const myStorage = window.localStorage;
const [currentUser,setCurrentUser] = useState(myStorage.getItem('user'));

  const [pins,setPins] = useState([])
  const [title,setTitle] = useState(null)
  const [desc,setDesc] = useState(null)
  const [rating,setRating] = useState(0)
  
const [showRegister,setShowRegister] = useState(false);
const [showLogin,setShowLogin] = useState(false);

const [currentPlaceId,setCurrentPlaceId] = useState([])
const [newPlace,setNewPlace] = useState(null)
  const [viewport, setViewport] = useState({
    //width:window.innerWidth,
    // height: window.innerHeight,
    width :"100vw",
    height:"100vh",
    latitude:23.8103,
    longitude: 90.4125,
    zoom: 6
  });

console.log(pins)

useEffect(()=>{


  

  const getPins =async ()=>{

    try{
            const res = await axios.get("http://localhost:7000/api/pins")
            setPins(res.data)
    }catch (err){
      console.log(err)
    }
  };
       getPins()
},[])


const handleMarkerClick=(id,lat,long)=>{
  setCurrentPlaceId(id);
  setViewport({...viewport,latitude:lat,longitude:long});
}


const handleAddClick=(e) =>{
console.log(e)
 const [long,lat] =e.lngLat;
 setNewPlace({
   lat,
   long
 })

}


const  handleSubmit=async (e)=>{
              e.preventDefault();
              const newPin ={
                user : currentUser,
                title,
                desc,
                rating,
                lat : newPlace.lat,
                long : newPlace.long
              }

               try{

                const res = await axios.post ('http://localhost:7000/api/pins',newPin);
                    setPins([...pins,res.data]);
                    setNewPlace(null);
               } catch(err){
                 console.log(err)
               }

}
const handleLogOut =() =>{
  myStorage.removeItem("user");
  setCurrentUser(null);
}
  return (
    <div  className="App">
      
      <ReactMapGL 
      {...viewport}
      mapboxApiAccessToken ={"pk.eyJ1Ijoic291cmF2YXJlZmluIiwiYSI6ImNrdTQ5cGlldDM4b24zM3FuaTRzem1jODMifQ.jAHztWvvvKhO7rraH-Be4g"}
      onViewportChange={nextViewport => setViewport(nextViewport)}
     mapStyle="mapbox://styles/souravarefin/cku4fv8bs1l3k18o7vqf4okah"
     onDblClick ={handleAddClick}
     transitionDuration="200"
    > 
    {pins.map((p)=>(

  <> 
    <Marker 
    latitude={p.lat}
     longitude={p.long}
      offsetLeft={-viewport.zoom*3.5}
      offsetTop={-viewport.zoom*7}>
       
       <Room style={{fontSize:viewport.zoom*7, color:p.username===currentUser ?"tomato":"slateblue",cursor:"pointer"}}
        onClick ={()=>handleMarkerClick(p._id,p.lat,p.long)}
       
       />
      
      </Marker>
      {p._id===currentPlaceId && ( 
     <Popup
     latitude={p.lat}
     longitude={p.long}
     closeButton={true}
     closeOnClick={false}
    
     anchor="left" 

     onClose={() =>setCurrentPlaceId(null)}
     >
   
     <div className="card">

       <label>place</label>
       <h4 className="place"> {p.title}</h4>
       <label>Review</label>
       <p className="desc">{p.description}</p>
       <label>Rating</label>
       <div className="stars">
     { Array(p.rating).fill( <Star className="star"></Star>) }
      
       </div>
       <label>Information</label>
       <span className = 'username'>Created by <b>{p.username}</b></span>
       <span className = 'date'>{format(p.createdAt)}</span>
     </div>
   </Popup>  
    ) }
    {newPlace &&
    <Popup
     latitude={newPlace.lat}
     longitude={newPlace.long}
     closeButton={true}
     closeOnClick={false}
    
     anchor="left" 

     onClose={() =>setNewPlace(null)}
     >
      <div>
<form   onSubmit ={
  handleSubmit
}>
<label >Title</label>
<input placeholder="Enter a title"  
 onChange={(e)=>setTitle(e.target.value)}      />
<label >Review</label>
<textarea placeholder="say something about this place"
  onChange={(e)=>setDesc(e.target.value)}/>
<label>Rating</label>
 
<select  onChange={(e)=>setRating(e.target.value)}  >
  <option value = "1">1</option>
  <option value = "2">2</option>
  <option value = "3">3</option>
  <option value = "4">4</option>
  <option value = "5">5</option>
</select>
<button className='submitButton' type ="submit">Add Pin</button>


</form>


      </div>
     
       </Popup> }
   </>   
  
        ))}
 { currentUser? 
 <button className="button logout"onClick={handleLogOut} >Log Out</button>: 
 ( <>
 <div className="buttons"></div>
    <button className="button login" onClick={()=>setShowLogin(true)}>Log In</button>
    <button className="button register"  onClick={()=>setShowRegister(true)}>  Register</button>
    </>)}
    
    {/* <div className="buttons">
    </div>
    <button className="button login" >Log In</button>
    <button className="button register">  Register</button> */}
    {showRegister && <Register setShowRegister={setShowRegister}/>  }
    {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>  }
     
    </ReactMapGL>
   
    </div>
  );
}

export default App;
