// const chatSchema = require('../../../Models/chatSchema')
// const messageSchema = require('../../../Models/messageSchema')

// exports.addMessage = async(req,res) => {
//     console.log('add message controller');
//     const {chatId,senderId,text} = req.body

//     const message = new messageSchema({
//         chatId,
//         senderId,
//         text
//     })

//     try {
//         const result = await message.save()
//         res.status(200).json(result)
//     } catch (error) {
//         console.log('error in adding chat');
//         res.status(500).json(error)
//     }
// }

// exports.getMessage = async(req,res) =>{
//     console.log('get message controller');

//     const {chatId} = req.query

//     try {
//         const result = await messageSchema.find({chatId})
//         res.status(200).json(result)
//     } catch (error) {
//         console.log('error in getting messages');
//         res.status(500).json(error)
//     }
// }

