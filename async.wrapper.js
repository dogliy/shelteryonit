module.exports  = (fn)=>(req,res,next)=>{
    try{
        fn(req, res,next)
    }
    catch(err){
        console.error('some error occured',err)
        res.status(500).send(err.massage)
    }
}