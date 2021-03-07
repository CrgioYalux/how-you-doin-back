require('dotenv').config()
const firebase = require('firebase/app')
require('firebase/firestore')
// firebase init

const firebaseConfig = {
    apiKey: "AIzaSyCx-WzyCo-VJbDSiJi2ThXaKLYs3przBaw",
    authDomain: "how-you-doin-f88fa.firebaseapp.com",
    projectId: "how-you-doin-f88fa",
    storageBucket: "how-you-doin-f88fa.appspot.com",
    messagingSenderId: "48326034041",
    appId: "1:48326034041:web:8c9ffeb1948c4cf84ccaa8",
    measurementId: "G-8TDH3N9LRZ"
}

!firebase.apps.length && firebase.initializeApp(firebaseConfig)
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