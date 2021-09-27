import { Avatar, IconButton } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Message } from './message';
import firebase from 'firebase';
import { getRecipients } from '../utils/gerRecipientEmail';
import TimeAgo from 'timeago-react';

export const ChatScreen = ({ messages, chat }) => {

    const [user] = useAuthState(auth)

    const router = useRouter()

    const EndOfMessagesRef = useRef(null)

    const [input, setInput] = useState('')

    const [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    )

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        } else {
            if (messages) {
                return JSON.parse(messages).map(message => (
                    <Message key={message.id} user={message.user} message={message} />
                ))
            }
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        })


        setInput('')
        scrollToBottom()
    }

    const [recipientSnapshot] = useCollection(db.collection('users')
        .where('email', '==', getRecipients(chat.users, user)));

    const recipient = recipientSnapshot?.docs?.[0]?.data()

    const recipientEmail = getRecipients(chat.users, user)

    const scrollToBottom = () => {
        EndOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <Container>
            <Header>
                {
                    recipient ?
                        <Avatar src={recipient?.photoURL} /> :

                        <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>

                }
                <HeaderInformations>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot ? (
                            <p>Last Active: {' '} {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : 'Unavailable'}</p>
                        ) : (
                            <p>Loading last active...</p>
                        )
                    }
                </HeaderInformations>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon></AttachFileIcon>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* Show Message */}


                {showMessages()}

                <EndOfMessage ref={EndOfMessagesRef} />

            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden disabled={!input} onClick={(e) => sendMessage(e)} type="submit" >Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container >
    )
}


const Input = styled.input`
flex: 1;
position: sticky;
background-color:whitesmoke;
padding: 20px;
border: none;
outline: 0;
border-radius:10px;
margin-left: 15px;
margin-right: 15px;

`;

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color:white;
z-index:100;
`;

const Container = styled.div``;
const Header = styled.div`
position: sticky;
background-color:#ffffff;
z-index:100;
display: flex;
top: 0;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;


`;
const HeaderInformations = styled.div`
margin-left: 15px;

flex: 1;
>h3{
    margin-bottom: 0px;
    margin-top: 10px;
}

>p{
    font-size: 11px;
    color: gray;
    margin-top: 2px;
}
`;
const HeaderIcons = styled.div`
`;
const MessageContainer = styled.div`
padding: 30px;
background-color:#e5ded8;
min-height:90vh;
`;
const EndOfMessage = styled.div`
margin-bottom: 50px;
`;
