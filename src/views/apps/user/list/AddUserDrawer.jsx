// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Component Imports
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { callAPI } from '@/utils/API/callAPI'

// Vars
const initialData = {
  revenue: '',
  salaryDirect: '',
  salaryIndirect: '',
  usExpenses: '',
  expenseRatio: ''
}

const AddUserDrawer = ({ open, handleClose, rowId, getList, editData }) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (rowId > 0 && open) {
      setFormData({
        revenue: editData.revenue || '',
        salaryDirect: editData.salaryDirect || '',
        salaryIndirect: editData.salaryIndirect || '',
        usExpenses: editData.usExpenses || '',
        expenseRatio: editData.conversionRate || ''
      })
    } else {
      setFormData(initialData)
    }
  }, [rowId, editData])

  const validate = () => {
    const newErrors = {}
    const numberRegex = /^\d*\.?\d+$/

    if (!formData.revenue || formData.revenue <= 0) {
      newErrors.revenue = 'Revenue is required'
    }

    if (!formData.salaryDirect || formData.salaryDirect <= 0) {
      newErrors.salaryDirect = 'Salary Direct is required'
    }

    if (!formData.salaryIndirect || formData.salaryIndirect <= 0) {
      newErrors.salaryIndirect = 'Salary Indirect is required'
    }

    if (!formData.usExpenses || formData.usExpenses <= 0) {
      newErrors.usExpenses = 'US Expenses is required'
    }

    if (!formData.expenseRatio || formData.expenseRatio <= 0) {
      newErrors.expenseRatio = 'Conversion Ratio is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formatData = input => {
      let numStr = input.replace(/,/g, '')

      if (numStr.length > 10) {
        numStr = numStr.replace(/,/g, '')
      }

      return Number(numStr)
    }

    const formatConversionRate = rate => {
      let formattedRate = rate.toString()

      if (formattedRate.endsWith('.') && !formattedRate.includes('.')) {
        formattedRate = formattedRate.slice(0, -1)
      }

      if (formattedRate.includes('.') && !formattedRate.split('.')[1]) {
        formattedRate = formattedRate.slice(0, -1)
      }

      return formattedRate
    }

    if (validate()) {
      const params = {
        recordId: rowId,
        revenue: formData.revenue.toString().includes(',')
          ? formatData(formData.revenue.replace(',', ''))
          : Number(formData.revenue),
        salaryDirect: formData.salaryDirect.toString().includes(',')
          ? formatData(formData.salaryDirect.replace(',', ''))
          : Number(formData.salaryDirect),
        salaryIndirect: formData.salaryIndirect.toString().includes(',')
          ? formatData(formData.salaryIndirect.replace(',', ''))
          : Number(formData.salaryIndirect),
        usExpenses: formData.usExpenses.toString().includes(',')
          ? formatData(formData.usExpenses.replace(',', ''))
          : Number(formData.usExpenses),
        conversionRate: formatConversionRate(formData.expenseRatio)
      }

      const url = `${process.env.API}/consolidated-data/save`

      const successCallback = (ResponseData, error, ResponseStatus, Message) => {
        if (ResponseStatus === 'success' && error === false) {
          toast.success(Message)
          handleReset()
          getList()
        } else {
          handleReset()
        }
      }

      callAPI(url, params, successCallback, 'POST')
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
    setErrors({})
  }

  const handleKeyPress = e => {
    const charCode = e.charCode
    const char = String.fromCharCode(charCode)

    if (!/[0-9.]/.test(char)) {
      e.preventDefault()
    }
  }

  const handleNumberChange = (e, fieldName) => {
    let value = e.target.value

    if (value.length > 15) {
      value = value.slice(0, 15)
    }

    setFormData({ ...formData, [fieldName]: value })
    setErrors({ ...errors, [fieldName]: '' })
  }

  const handleDecimalChange = e => {
    let value = e.target.value

    if (value.length > 15) {
      value = value.slice(0, 15)
    }

    const numberRegex = /^\d*\.?\d{0,2}$/

    if (!numberRegex.test(value)) {
      return
    }

    setFormData({ ...formData, expenseRatio: value })
    setErrors({ ...errors, expenseRatio: '' })
  }

  const formatCommaSeparatedString = input => {
    let numStr = input.replace(/,/g, '')

    numStr = numStr.replace(/^0+/, '')

    if (numStr === '') {
      return '0'
    }

    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between plb-5 pli-6'>
        <Typography variant='h5'>Add New Record</Typography>
        <IconButton onClick={handleReset}>
          <i className='tabler-x text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
          <CustomTextField
            label='Revenue (₹)'
            fullWidth
            placeholder='Please Enter Revenue (₹)'
            value={formatCommaSeparatedString(formData.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            onChange={e => handleNumberChange(e, 'revenue')}
            onKeyPress={handleKeyPress}
            error={!!errors.revenue}
            helperText={errors.revenue}
          />
          <CustomTextField
            label='Salary Direct (₹)'
            fullWidth
            placeholder='Please Enter Salary Direct (₹)'
            value={formatCommaSeparatedString(formData.salaryDirect.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            onChange={e => handleNumberChange(e, 'salaryDirect')}
            onKeyPress={handleKeyPress}
            error={!!errors.salaryDirect}
            helperText={errors.salaryDirect}
          />
          <CustomTextField
            label='Salary Indirect (₹)'
            fullWidth
            placeholder='Please Enter Salary Indirect (₹)'
            value={formatCommaSeparatedString(formData.salaryIndirect.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            onChange={e => handleNumberChange(e, 'salaryIndirect')}
            onKeyPress={handleKeyPress}
            error={!!errors.salaryIndirect}
            helperText={errors.salaryIndirect}
          />
          <CustomTextField
            label='US Expenses ($)'
            fullWidth
            placeholder='Please Enter US Expenses ($)'
            value={formatCommaSeparatedString(formData.usExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            onChange={e => handleNumberChange(e, 'usExpenses')}
            onKeyPress={handleKeyPress}
            error={!!errors.usExpenses}
            helperText={errors.usExpenses}
          />
          <CustomTextField
            label='Conversion Rate for 1 USD'
            fullWidth
            placeholder='Please Enter Conversion Rate'
            value={formData.expenseRatio}
            onChange={handleDecimalChange}
            onKeyPress={handleKeyPress}
            error={!!errors.expenseRatio}
            helperText={errors.expenseRatio}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddUserDrawer
