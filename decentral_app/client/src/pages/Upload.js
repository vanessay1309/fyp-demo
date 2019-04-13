 import React, { Component } from "react";
import cloudinary from "cloudinary-react";
import UploadButton from "../components/UploadButton";
import '../css/button.css';
import List from '../components/sourceList'
// var cloud =require('cloudinary');
class Upload extends Component {
  constructor(props){
    super(props);
    this.Upload = this.Upload.bind(this);
    this.state = { validated: false, uploaded:false, public_id:'',accessL:'', img_loc:'', img_data:'',img_name:'',  img_caption:''};

    this.handleImageAddressInput = this.handleImageAddressInput.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCaptionChange = this.handleCaptionChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

  }

  handleImageAddressInput(event){
    let reader = new FileReader();
    let file = event.target.files[0];
    let img_loc = event.target.value;
        let uploadPreset= "tt3uhkl0";
      event.preventDefault();

      if(img_loc){
        console.log("image loaded ");
        reader.onloadend = () =>{
          this.setState({img_data : reader.result, img_loc:img_loc});


          console.log("Submit Handler: image adress is : " + this.state.img_loc);
        }
          //--> put it on the backend --> non-widget upload
          // let  api_sign_request = function(params_to_sign,api_secret);
          //cloudinary upload
          // cloudinary.config({
          //   cloud_name:"fyp18003",
          //   api_key:674772198887786,
          //   api_secret:'vd6twqB4LH18bVUiIdzNe03XcoE'
          // });
          //   cloudinary.uploader.unsigned_upload( "{img_data}",uploadPreset,{cloud_name:"fyp18003"}
          //   , (error, result) => {
          //     console.log("file uploaded");
          //     console.log("result : ");
          //   });
          // }
            reader.readAsDataURL(file);

            console.log("image local : "+ img_loc);

        }
      else{
        console.log("image empty " );
        this.setState({img_data :'', img_loc :img_loc });
      }

      console.log("Submit Handler: image adress is : " + this.state.img_loc);
      // let  api_sign_request = function(params_to_sign,api_secret);
      //cloudinary upload
}
    //read the data file url

  handleNameChange(event){
    event.preventDefault();
    this.setState({img_name : event.target.value});
    console.log('Your caption is', event.target.value);
  }

  handleCaptionChange(event){

    event.preventDefault();

   this.setState({img_caption : event.target.value});
   console.log('Your caption is', event.target.value);
  }

  submitHandler(){
      console.log("Submit Handler");
  }

//upload function to cloud
  uploadToCloud(){
      let cloudName="fyp18003";
      let uploadPreset= "tt3uhkl0";
      // notification for entire upload process
      let isUploaded = false;
      let  accessL,public_id,signature;
      //determine the storage folder
      let folder = "sample";
      console.log("uploading to cloudinary, cloudName:"+ cloudName+" uploadPreset:"+uploadPreset);
      // let  api_sign_request = function(params_to_sign,api_secret);
      //cloudinary widget call
      let cloudStorage = window.cloudinary.createUploadWidget({
        cloudName:cloudName ,
        uploadPreset: uploadPreset,
        folder:folder,
        // use_filename:true,
        resourceType:"image",
        clientAllowedFormats: "jpg,png"
      }, (error, result) => {

        if (result.event === "success") {
          window.alert(result.info.secure_url);
          this.state.accessL = result.info.secure_url;
          this.state.public_id = result.info.public_id;
          signature = result.info.signature;
          console.log("201 Upload Success to Cloud: access :"+ this.state.accessL +"\n public_id: "+this.state.public_id +"\n signature: "+ signature);

          // fetching artwork data to backend
          console.log("Fetching :POST --> uploadArtwork route");
          let  uploadArtwork = "http://localhost:4000/artworks/uploadArtwork";
          fetch(uploadArtwork,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                author_id: "5ca5ec14a5ef65243d180a71",
                name: this.state.img_name,
                caption: this.state.img_caption,
                access: this.state.accessL
            })
          }).then(res =>{console.log("res: "+res)}).catch(err => {
            console.log(`400 Upload Artwork to Ethereum : Error when fetching: ${error}`);});
           // fetch source artwork

      }

      else{
        console.log("400 Error : could not perform uploading to cloudinary");
        return "err";
      }
      });
              console.log("widget open ");
        cloudStorage.open();
        console.log("widget close ");
        return;

      // --------------cloud image upload ends --------
        // cloudStorage.v2.uploader.upload("", function(error, result) {console.log(result, error); });


    }
    //upload the entire image process by calling backend uploadArtwork -> blockchain
  Upload(){
        console.log("Upload Section :");
        //
        try{
          this.uploadToCloud(() => console.log('uploadtoCloud done'));
        }
        catch(err){
          console.log("400 Error: could not perform uploading :"+err);
        };
//         console.log("Upload function - success!: "+this.state.public_id+"accessL"+
// this.state.accessL);
    }

    // <Form>1.Artwork name 2.caption 3.source work

    render() {

      //preview the loaded image
      let $imagePreview = null;
      if(this.state.img_loc){
        $imagePreview =(<img id="image_preview" src={this.state.img_data} alt="image preview" />);
      }else{
        $imagePreview=  (<img id="image_preview" value=" Your image preview Here" />);
      }
      return(
        <div className="UploadArtwork" >
            <h1 style={{ padding: '0 0 15px 0'}}>Upload Artwork</h1>


              <div className="artwork_info">
                <label for="name">
                Artwork Name:
                </label>
                <input id = "name" type="text" placeholder="type name of the artwork here.." value={this.state.img_name} onChange={this.handleNameChange} required/>

                <br/>
                <label for="caption">
                Caption:
                </label>
                <textarea id = "caption" type="text" cols="20" rows="5" placeholder="type caption here.." value={this.state.img_caption} onChange={this.handleCaptionChange} required/>
              </div>

              <br/>
              <input type='file' id="imgInput" accept=".jpg,.jpeg,.png"  onChange={ this.handleImageAddressInput} />
              <br/>
              {$imagePreview}
              <br/>
              
              <UploadButton  Upload={this.Upload.bind()}/>


            <List/>

        </div>
      );
    }
}
export default Upload;
