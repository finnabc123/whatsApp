export const getRecipients = (users, userLoggedIn) => (
    users.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0]
)