const db = require('./models')

const createUser = async () => {
    try{
        const newUser = await db.user.create({
            username: 'boop',
            email: 'be@doop',
            password: '44',
        })
    }catch (err){
        console.warn('🔥🔥', err)
    }
}

createUser()