import { Avatar } from '@material-ui/core';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { getRecipients } from '../utils/gerRecipientEmail';
import { useRouter } from 'next/router';

export const Chat = ({ id, users }) => {

    const router = useRouter()

    const [user] = useAuthState(auth)

    const [recipientSnapshot] = useCollection(db.collection('users')
        .where('email', '==', getRecipients(users, user)));

    const recipient = recipientSnapshot?.docs?.[0]?.data()

    const recipientEmail = getRecipients(users, user)

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat} >
            {
                recipient ?
                    <UserAvatar src={recipient?.photoURL} /> :

                    <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>

            }
            <p>{recipientEmail}</p>
        </Container>
    )
}

const Container = styled.div`
display: flex;
align-items: center;
padding: 15px;
cursor: pointer;
word-break: break-word;

:hover{
    background-color: #e9eaeb;
}
`;

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right:15px;
`;