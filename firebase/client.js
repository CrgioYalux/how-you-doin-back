require('dotenv').config()

// firebase init

!firebase.apps.length && firebase.initializeApp(process.env.FIREBASE_CONFIG)
const db = firebase.firestore()

const getStoredMessages = async (id) => {
    const req = db.collection('Chatrooms').doc(id);
    const doc = await req.get()
    const data = await doc.data()
    const { chat } = data
    return chat
}

const sendMessage = async (message, id) => {
    const chat = await getStoredMessages(id)
    chat.push(message)
    return db.collection('Chatrooms').doc(id).update({chat})
}

const checkIfDocExists = async (id) => {
  const collection = db.collection('Chatrooms').doc(id);
  const doc = await collection.get();
  return doc.exists
}

const createChatroom = (id) => {
  checkIfDocExists(id).then(
    exists => {
      if (!exists) {
        db.collection('Chatrooms').doc(id).set({
          chat: [],
        })
    }
    return checkIfDocExists(id)
    }
  )
}

module.exports = {
    createChatroom,
    checkIfDocExists,
    sendMessage,
    getStoredMessages
}