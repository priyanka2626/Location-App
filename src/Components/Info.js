import React from 'react';
import  Dexie  from 'dexie';
import {useState,useEffect} from 'react';
import Pagination from './Paging'
import '../App.css';



const Info =()=>{
    //connection from DB
    const db =new Dexie("DexieDB");
    db.version(1).stores({
        locationEntry: "location,address,phoneNumber"
    })
    db.open().catch((err)=>{
        console.log(err.stack || err)
    })
       //set the state and property
    const [locationEntry, setLocationEntry] = useState("");  
    const [location, setlocation] = useState("");
    const [address, setaddress] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [Toggle, setToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [LocationPerPage] = useState(2);
    const [updateFlag,setupdateFlag]=useState("");
   
 
//Display Data
    const displayForm=(data)=>{
              //console.log(data)
        return (
            <div>                         
            <form onSubmit={getLocationInfo}  >
            <div class="form-row"></div>
           <div class="form-group ">
           <label class="col-sm-2 col-form-label">location</label>
           <div class="mx-sm-3 mb-2">
            <input type="text" name="title" class="form-control" defaultValue={data=="" ? "" : data.location.location}onChange={e => setlocation(e.target.value)} />
            </div>
           </div>
           <div className="control">
           <label>address</label>
            <textarea name="content" defaultValue={data=="" ? "" : data.location.address} onChange={e => setaddress(e.target.value)} /> 
           </div>
           <div className="control">
           <label>phonenumber</label>
            <textarea name="content" defaultValue={data=="" ? "" : data.location.phoneNumber} onChange={e => setphoneNumber(e.target.value)} />
           </div>
                      
             <input type="submit" value="Submit" />
             <input type="button" value="Cancel" onClick= {() => { setToggle(Toggle === false ? true : false)} }></input>
        </form>
        </div>
        )
    }

    //Update data
    const updatePost=(id)=>{
        setupdateFlag(id)
        setToggle(true)
        displayForm(id)
     }

     const checkUpdateAdd=()=>{
        setToggle(Toggle === false ? true : false)
        setupdateFlag("")
     }

     //delete data
    const deletePost = async(id) => {
        console.log(id);
        db.locationEntry.delete(id);
        let allLocation = await db.locationEntry.toArray();
        //set the posts
        setLocationEntry(allLocation);
    }

 
    //submit 
    const getLocationInfo = (e) => {
        e.preventDefault();
        if(location !== "" && address !== "" && phoneNumber!=="" ){
            let locationdetails = {
                location: location,
                address: address,
                phoneNumber:phoneNumber
                
            }
            if(updateFlag!="")
            {
                //console.log(updateFlag.location.location)
                db.locationEntry.delete(updateFlag.location.location);               
               db.locationEntry.add(locationdetails).then(async() => {
                //retrieve all posts inside the database
                let allLocation = await db.locationEntry.toArray();
                //set the posts
            setLocationEntry(allLocation);
            }).catch(function (e) {
                alert("Record already exists.")
              });
            }
            else{
            db.locationEntry.add(locationdetails).then(async() => {
                //retrieve all posts inside the database
                let allLocation = await db.locationEntry.toArray();
                //set the posts
                setLocationEntry(allLocation);
            }).catch(function (e) {
                alert("Record already exists.")
              });
            }
            { setToggle(Toggle === false ? true : false)} 
            
        }
    }
//get all posts from the database
    useEffect(() => {

        
        const getLocationEntry = async() => {
            let allLocation = await db.locationEntry.toArray();
           
            setLocationEntry(allLocation);
           
        }
        getLocationEntry();
  
    }, [])
    
    
    
    //Get current data for paging
    const indexofLastLocation=currentPage*LocationPerPage;
    const indexofFirstLocation=indexofLastLocation-LocationPerPage;
    const currentPageLocation=locationEntry.slice(indexofFirstLocation,indexofLastLocation)
    //console.log(currentPageLocation)

    //to change page number
    const Paginate=(Pagenumber)=>{ setCurrentPage(Pagenumber)}

    // check whether the data is present or not
    let LocationData; 
  
    if(locationEntry.length > 0) {
      
        LocationData = <div className="mid container "> 
                        <div className="row head txt">
                        <div className="col-sm">LOCATION</div>
                        <div className="col-sm">ADDRESS</div>
                        <div className="col-sm">PHONENUMBER</div>
                        </div>
                    {
                        currentPageLocation.map(location => {
                         
                             return <div className="row shadow p-1 mb-2 bg-white rounded" key={location.location}>
                                
                                            <div className="col-sm">{location.location}</div>
                                            <div className="col-sm">{location.address}</div>
                                            <div className="col-sm">{location.phoneNumber}</div>
                                            <span><img href ="" onClick={() => deletePost(location.location)} src="https://img.icons8.com/material/24/000000/delete-forever--v2.png"/></span>
                                            <span onClick= {() => updatePost({location})}><img src="https://img.icons8.com/material/24/000000/edit--v1.png"/></span>
                                            
                                        </div>       
                        })
                    }
                   </div>
    }else{
        LocationData = <div>
                     <p>No location is added.Please add location using below button</p>
                   </div>
    }
    
  
    return (
    <React.Fragment>        
        {Toggle ? displayForm(updateFlag) :  <div>{LocationData}</div>} 
        <input type="button" className="btn btn-danger " value="Add Location" type={ Toggle === false ? "show" : "hidden"} onClick= {() => checkUpdateAdd()} ></input>
      <Pagination LocationPerPage={LocationPerPage} TotalEntry={locationEntry.length} Paginate={Paginate}/>
    </React.Fragment>
  );
}

export default Info;
