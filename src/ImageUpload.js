import React,{useState} from 'react'
import {Button} from '@material-ui/core';
import {db,storage} from './Firebase';
import firebase from 'firebase';
import './ImageUpload.css';
function Imageupload({username}) {
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(0);
    const [caption,setCaption]=useState('');

    const handleChange=(e)=>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    const handleUpload=()=>{
        const uploadTask=storage.ref(`images/${image.name}`).put(image)
       
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
            // progress function ...
            const progress=Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress); 
            },
            (error)=>{
                // error function 
                console.log(error);
                alert(error.message);
            },
            // upload complete funtion...
            ()=>{
              storage
              .ref("images")
              .child(image.name)
              .getDownloadURL()  
              .then(url=>{
                // post image inside db 
                db.collection("posts").add({
                   timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                   caption:caption,
                   imageUrl:url,
                   username:username,
                });
                setProgress(0);
                setCaption("");
                setImage(null);
              });
            }
        );
    };
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" /> 
            <input className="imageupload__caption" type="text" placeholder="Enter a caption"
            value={caption} onChange={(e)=>setCaption(e.target.value)}/>
            <input className="imageupload__filechose" type="file" onChange={handleChange}/>
            <button className="imageupload__button" onClick={handleUpload}>
             Upload
            </button>
    
        </div>
    )
}

export default Imageupload
