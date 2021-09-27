
import { Avatar, Button, IconButton } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components'
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Chat } from './chat';


export const Sidebar = () => {

    const [user] = useAuthState(auth)

    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)

    const [chatsSnapshot] = useCollection(userChatRef)


    const createChat = () => {
        const input = prompt('Please enter an email address for the user you wish to connect');

        if (!input) return null

        if (EmailValidator.validate(input) &&
            !chatAlreadyExists(input) &&
            input !== user.email) {
            // we need to add into db in chats collection

            db.collection('chats').add({
                users: [user.email, input],
            })
        }
    }

    const chatAlreadyExists = (recipientEmailCheck) =>
        !!chatsSnapshot?.docs.find(chat =>
            chat.data().users.find(user =>
                user === recipientEmailCheck))

    return (
        <Container>
            <Header>
                {
                    user ?
                        <UserAvatar onClick={() => auth.signOut()} src={user?.photoURL} /> :

                        <UserAvatar onClick={() => auth.signOut()}>{user.email[0].toUpperCase()}</UserAvatar>

                }
                <IconsContainer>
                    <IconButton>
                        <ChatIcon></ChatIcon>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search" />
            </Search>
            <SidebarButton onClick={createChat} >Start a new chat</SidebarButton>

            {/* List of chats */}

            {
                chatsSnapshot?.docs.map((chat) => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))
            }
        </Container>
    )
}

const SidebarButton = styled(Button)`
width:100%;

&&&{
border-top: 1px solid #ffffff;
border-bottom: 1px solid #ffffff;
}

`;

const Container = styled.div`

flex: 0.45;
border-right: 1px solid whitesmoke;
height: 100vh;
min-width:300px;
max-width: 350px;
overflow-y: scroll;

::-webkit-scrollbar{
    display: none;
}

--ms-overflow-style:none; // IE and Edge
scrollbar-width:none; // firefox

`;

const Header = styled.div`
display:flex;
position:sticky;
top: 0;
background-color: white;
z-index: 1;
justify-content: space-between;
align-items: center;
padding: 15px;
border-bottom: 1px solid whitesmoke;

`;

const UserAvatar = styled(Avatar)`
cursor: pointer;

:hover{
    opacity: 0.8;
}
`;

const IconsContainer = styled.div``;

const Search = styled.div`
display: flex;
align-items: center;
padding: 20px;
border-radius: 2px;
`;
const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;