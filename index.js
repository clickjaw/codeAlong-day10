const cors = require('cors');
const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT = process.env.PORT|| 3006
app.use(cors())

const inMemoryDB = {} //global object for storing our data



app.get('/music', async(request,response)=>{

    const artist = request.query.artist
    const URL = `https://musicbrainz.org/ws/2/artist?query=${artist}&limit=1`;

    if (inMemoryDB[artist]!== undefined){ 
        console.log("getting info from DB", artist);
        response.status(200).send(inMemoryDB[artist]);
    }else{
        console.log("Do not have this. Fetching Data", artist)
        try {

            const res = await axios.get(URL);
            // console.log(res.data)
            const artistArr = res.data.artists.map(artist => new Artist(artist));   
            inMemoryDB[artist] = artistArr; //Madonna = [{name: Madonna, location: US}]
            //  console.log(artistArr)
             response.status(200).send(artistArr);
        } catch (error) {
            console.log(error)
        }finally{
            console.log(inMemoryDB)
        }
      }


 
    // } //if end

}) //.get end

//Artist model
class Artist{
    constructor(artist){
        this.name = artist.name;
        this.location = artist.country;
    }
}



app.listen(PORT, ()=> console.log(`You can do it. Port: ${PORT}`))