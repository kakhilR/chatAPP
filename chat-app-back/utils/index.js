// function to check number of requests sent per minute
export const  isOverLimit = async (client,userId) =>{
    let count;
    try{
        count = await client.INCR(userId)
    }catch(err){
        console.log(err)
    }
    console.log(`${userId} has value: ${count}`)
    if(count>3){
        return true;
    }

    client.expire(userId,10);
    return false;
}

