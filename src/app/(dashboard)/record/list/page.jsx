// Component Imports
import UserList from '@views/apps/user/list'

const getData = async () => {
  // Vars
  const res = [
    {
      id: 1,
      date: '17/07/2024',
      conversionRate: 83.2,
      revenue: '8,00,00,000',
      salaryDirect: '2,00,00,000',
      salaryIndirect: '1,50,00,000',
      usExpenses: '2,49,00,000',
      expenseRatio: '43.00%'
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
