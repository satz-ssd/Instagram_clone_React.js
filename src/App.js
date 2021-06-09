import React, {useState,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {db,auth} from './Firebase';
import {makeStyles} from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import { Button, Input} from '@material-ui/core';
import Imageupload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  let classes=useStyles();
  const [modalStyle] =useState(getModalStyle);

  let [posts,setPosts]=useState([]);
  let [openSignin,setOpenSignin]=useState(false);
  let [open,setOpen]=useState(false);
  let [username,setUsername]=useState('');
  let [email,setEmail]=useState('');
  let [password,setPassword]=useState('');
  let [user,setUser]=useState(null);
  
  // useEffect ->runs a code based on a specefic condition 
 useEffect(() => {
   let unsubscribe=auth.onAuthStateChanged((authUser)=>{
     if (authUser){
      //user logged in 
     setUser(authUser);
     console.log(authUser);
    }else{
      // user has logged out
      setUser(null)
    }
   })
   return ()=>{
    //  perform some cleanup action 
    unsubscribe();
   }
 }, [user,username])
 
 
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      }))))}
        
    // this is where code runs 
  ,[posts]);

  const signUp=(e)=>{ 
    e.preventDefault();

    // auth 
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
     return authUser.user.updateProfile({
        displayName:username
      })
    })
     .catch((error)=>alert(error.message))
     setUsername('');
     setEmail('');
     setPassword('');
     setOpen(false);
  }
  const signIn=(e)=>{ 
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))

    setOpenSignin(false);
  }
  return (
  <div className="app">

    <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
            src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="" className="app__headerImage"/>
          </center>
            <Input
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
            <Input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

            <Button type="submit" onClick={signUp}>Sign Up</Button>
         
        </form>
      </div>
    </Modal>

    <Modal
        open={openSignin}
        onClose={()=>setOpenSignin(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
            src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="" className="app__headerImage"/>
          </center>
            
            <Input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
            <Input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>

            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
      </div>
    </Modal>
     <div className="app__header">
      <img src="http://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt="" className="app__headerImage"/>
       {user ? (
        <Button onClick={()=>auth.signOut()}>Logout</Button>
        ):(
          <div className="app__loginContainer">
        <Button onClick={()=>setOpenSignin(true)}>Sign In</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
      )}
    </div>

    <div className="app_posts">
    {
      posts.map(({id,post})=>(
      <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
      
      ))
    }  
    </div>
    {/* <InstagramEmbed
      url='https://www.instagram.com/p/CIeKX-ArcCu/nFjDJ0rU/'
      // clientAccessToken='123|456'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
    /> */}
  
    {user?.displayName ? (
      <Imageupload username={user.displayName}/>
    ): (
      <h3>Sorry you need to login to upload</h3>
    )} 
  </div>
  );  
}
export default App;

// 3:03 