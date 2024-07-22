// Component Imports
import UserList from '@views/apps/user/list'

const getData = async () => {
  // Vars
  const res = [
    {
      id: 1,
      date: '17/07/2024',
      conversion: '83.2',
      role: 'editor',
      username: 'gslixby0',
      country: 'El Salvador',
      contact: '(479) 232-9151',
      email: 'gslixby0@abc.net.au',
      currentPlan: 'enterprise',
      status: 'inactive',
      avatar: '',
      avatarColor: 'primary',
      billing: 'Auto Debit'
    }
  ]

  return res
}

const UserListApp = async () => {
  // Vars
  const data = await getData()

  return <UserList userData={data} />
}

export default UserListApp
