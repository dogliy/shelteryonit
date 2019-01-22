const mongoose      = require('mongoose')
const shelter       = require('../models/shelterSchema') // access the MODEL
const hospitality   = require('../models/hospitalitySchema')
const citizen       = require('../models/citizenSchema')
const connection    = require('../db')

// show all shelters
module.exports= {
    async showAllShelters(req,res,next){
            const result=await shelter.find({})
            if(result)
            {
                
                res.json(result)
            }
            else
            {

                    res.status(404).send("not found")
            }
    },
    //
    async showHospitalityByCityAndCapacity(req,res,next){
    
        const {city= null, capacity =null} =req.body
        
        const result = await hospitality.find({city,remain:{$lte:capacity}},(err,relevantHospitality)=>{
            if(err){
                console.log("could not find matching house")
            }
            console.log(relevantHospitality)
        });
        if(result)
        {
            console.log(result)
            res.json(result)
        } 
        else
            res.status(404).send('not found')
    },
// add shelter
    async addShelter(req,res,next){
        if(typeof req.body.lng=="undefined" || typeof req.body.lat=="undefined" || typeof req.body.id=="undefined")
        {
            res.json('you did not enter lng or lat or id');
        }
        else
        {
            console.log(req.body.id);
                const result=await citizen.find({id:req.body.id})

                if(result)
                {
                    if(result.length<=0)
                    {
                        res.json(`id not found`);
                    }
                    else
                    {
                        const shelterResult=await shelter.find({});

                        if(shelterResult)
                        {
                            var shelterCount=0;
                            var shelterNumber;
                            for(let i=0;i<shelterResult.length;i++)
                            {
                                shelterNUmber=parseInt(shelterResult[i].shelterId);
                                if(shelterNumber>shelterCount)
                                    shelterCount=shelterNUmber;


                            }
                            shelterCount=shelterCount+1;

                            let newShelter=new shelter({
                                shelterId:shelterCount,
                                citizenId:req.body.id,
                                lat:req.body.lat,
                                lng:req.body.lng,
                                picturesUrl:[]
                            });

                            newShelter.save((err)=>{
                                    if(err)
                                        res.json(`there was error with save new shelter: ${err}`);
                                    else
                                        res.json(`you add new shelter`);

                            }) 
                        }
                        else
                        {
                            res.json(`there was problem with find shelter`);
                        }
        
                    }
                }
                else
                {
                    res.json(`there was a problem find`);

                }
        }


    },
//find shelters around
    async findCloseShelters(req,res,next){
        const result=await shelter.find({})
       
        console.log(typeof req.query.lat);
        console.log(typeof req.query.lng);
        if(((typeof req.query.lat)=="undefined") || ((typeof req.query.lng)=="undefined"))
        {
            res.send(`you did not send all lat or lng`);


        }
        else if(result)
        {
         
            //console.log(req.qurey.lng);



            var htmlstr="";
            htmlstr=`<!DOCTYPE html>
            <html>
              <head>
                <title>Simple Map</title>
                <meta name="viewport" content="initial-scale=1.0">
                <meta charset="utf-8">
                <style>
                  /* Always set the map height explicitly to define the size of the div
                   * element that contains the map. */
                  #map {
                    height: 100%;
                  }
                  /* Optional: Makes the sample page fill the window. */
                  html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                  }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>`;
                htmlstr+=`
                  function initMap() {
                            var myLatLng = {lat: `;
                            
                htmlstr+=   req.query.lat ;

                htmlstr+=` , lng: `;
                
                htmlstr+=req.query.lng;

                htmlstr+=`};
                            var map = new google.maps.Map(document.getElementById('map'), {
                                zoom: 16,
                            center: myLatLng
                        });`;
                        htmlstr+=` var marker = new google.maps.Marker({   position: {lat: `;  
                        htmlstr+= req.query.lat ; 
                        htmlstr+=`, lng: ` ;
                        htmlstr+=req.query.lng;
                        htmlstr+=`}, map: map, title: 'me'});`;       
            
                for(let i=0;i<result.length;i++)
                {
                     htmlstr+=` var marker = new google.maps.Marker({   position: {lat: `;  
                     htmlstr+= result[i].lat ; 
                     htmlstr+=`, lng: ` ;
                     htmlstr+=result[i].lng;
                     htmlstr+=`}, map: map, title: 'shelter'});`;
                }

             htmlstr+=   ` }`;
             htmlstr+= `</script>
                <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAEk19blgki_kfh6LPgQVocoqRfTKYsMXs&callback=initMap"
                async defer></script>
              </body>
            </html>`;
            res.send(htmlstr);
      
        }
        else
        {
                res.status(404).send("not found");
        }

    },
// update hospitality (searching people and remain)
    async updateHospitality(req,res,next){

        if(typeof req.body.familyHeadId=="undefined" || typeof req.body.houseId=="undefined" )
        {
            res.json(`you did not enter family head id or house id`);
        }
        else
        {
            const hospitalityResult=await hospitality.find({houseId:req.body.houseId});

            if(hospitalityResult)
            {
                if(hospitalityResult.length<=0)
                {
                    res.json(`house id not found`);
                }
                else
                {
                    const citizenResult=await citizen.find({id:req.body.familyHeadId});

                    if(citizenResult)
                    {
                        if(citizenResult.length<=0)
                        {
                            res.json(`family head id not found`);
                        }
                        else
                        {
                            var numberOfPeople=0;
                            if(typeof req.body.peopleArray=="object")
                            {
                                numberOfPeople=req.body.peopleArray.length;

                            }
                            numberOfPeople=numberOfPeople+1;

                            if((hospitalityResult[0].remain-numberOfPeople)<0 )
                            {
                                    res.json(`too many people`);
                            }
                            else
                            {   
                                var newRemain=hospitalityResult[0].remain-numberOfPeople;
                                var newSearchingPeople=hospitalityResult[0].searchingPeople;
                                newSearchingPeople.push({id:citizenResult[0].id,name:citizenResult[0].name});

                                for(let i=0;i<req.body.peopleArray.length;i++)
                                newSearchingPeople.push(req.body.peopleArray[i]);


                                var conditions={houseId:req.body.houseId},
                                    update={$set:{remain:newRemain,searchingPeople:newSearchingPeople}},
                                    opts={multi:true};
                                
                                hospitality.update(conditions,update,opts,(err)=>{
                                    if(err)
                                    {
                                        res.json(`update error: ${err}`);
                                    }
                                    else
                                    {
                                        res.json(`you add people to hospitality`);
                                    }

                                });

                            }


                        }


                    }
                    else
                    {
                        res.json(`there was problem with citizen find`);
                                        }





                }


            }
            else
            {
                res.json(`there was problem with hospitality find`);
            }



        }


       

    },
    async addHospitality(req,res,next){

        if(typeof req.body.ownerID=="undefined" || typeof req.body.capacity=="undefined" || typeof req.body.city=="undefined" )
        {
            res.json(`you did not send id or capacity or city`);


        }
        else
        {
                const citizenResult=await citizen.find({id:req.body.ownerID});

                if(citizenResult)
                {
                    if(citizenResult.length<=0)
                    {
                        res.json(`id not found try again`);
                    }
                    else
                    {
                        const hospitalityResult=await hospitality.find({});

                        if(hospitalityResult)
                        {
                            
                            var hospitalityCount=0;
                            var hospitalityNumber=0;
                           

                            for(let i=0;i<hospitalityResult.length;i++)
                            {
                                hospitalityNumber= hospitalityResult[i].houseId;
                                console.log(hospitalityNumber);
                                if(hospitalityCount<hospitalityNumber)
                                    hospitalityCount=hospitalityNumber;

                            }
                            hospitalityCount=hospitalityCount+1;

                           var livingPepole=[];
                           livingPepole.push({id:req.body.ownerID,name:citizenResult[0].name});
                           
                           
                           if(typeof req.body.hostingPeople=="object")
                           {
                               
                                for(let i=0;i<req.body.hostingPeople.length;i++)
                                {
                                    livingPepole.push(req.body.hostingPeople[i]);    


                                }
                                   


                           }
                           var newHospitality=new hospitality({
                                ownerID:req.body.ownerID,
                                houseId:hospitalityCount,
                                capacity:req.body.capacity,
                                remain:req.body.capacity,
                                searchingPeople:[],
                                city:req.body.city,
                                pictureUrl:[],
                                hostingPeople:livingPepole
                           });

                           newHospitality.save((err)=>{
                                if(err)
                                {
                                    res.json(`there was a problem with save: ${err}`);
                                }
                                else
                                {
                                   res.json(`you add new Hospitality`) ;
                                }

                           })

                        }
                        else
                        {
                            res.json(`there was problem with hospitality find`);
                        }
                    }

                }
                else
                {
                    res.json(`there was problem with citizen find`);
                }

        }

    }

}