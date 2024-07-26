/* eslint-disable import/order */
// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/@core/components/mui/AppReactDatepicker'
import { useState } from 'react'

const initialData = {
  startDate: null,
  endDate: null
}

const FilterDialog = () => {
  const [formData, setFormData] = useState(initialData)

  return (
    <>
      <AppReactDatepicker
        fullWidth
        selected={
          formData.startDate && dayjs.isDayjs(formData.startDate) ? formData.startDate.toDate() : formData.startDate
        }
        id='basic-input'
        onChange={date => {
          if (!date) {
            setFormData({
              ...formData,
              startDate: new Date(dayjs(date).format('MM/DD/YYYY'))
            })
          }
        }}
        placeholderText='Start Date'
        customInput={<CustomTextField fullWidth />}
      />

      <AppReactDatepicker
        selected={formData.endDate && dayjs.isDayjs(formData.endDate) ? formData.endDate.toDate() : formData.endDate}
        id='basic-input'
        onChange={date => {
          setFormData({
            ...formData,
            endDate: new Date(dayjs(date).format('MM/DD/YYYY'))
          })
        }}
        placeholderText='End Date'
        customInput={<CustomTextField fullWidth />}
      />
    </>
  )
}

export default FilterDialog
