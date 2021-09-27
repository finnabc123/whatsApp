import React from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import { Sidebar } from '../../components/sidebar'
import { ChatScreen } from '../../components/chatScreen'
import { auth, db } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getRecipients } from '../../utils/gerRecipientEmail'

const Chat = ({ messages, chat }) => {

    const [user] = useAuthState(auth)

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipients(chat.users, user)}</title>
            </Head>
            <Sidebar />

            <ChatController>
                <ChatScreen chat={chat} messages={messages} />
            </ChatController>

        </Container>
    )
}


export default Chat


export async function getServerSideProps(context) {


    const ref = db.collection('chats').doc(context.query.id);

    // Prep the message on the server sidebar
    const messageRes = await ref.collection('messages')
        .orderBy('timestamp', 'asc')
        .get()

    const messages = messageRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }))

    // Prep the chat 

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    console.log(chat, messages);

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }





}



const Container = styled.div`
display: flex;
`;

const ChatController = styled.div`
flex: 1;
overflow: scroll;
height:100vh;
::-webkit-scrollbar {
    display: none;
}
--ms-overflow-style:none; // IE and Edge
scrollbar-width:none; // Firefox
`;