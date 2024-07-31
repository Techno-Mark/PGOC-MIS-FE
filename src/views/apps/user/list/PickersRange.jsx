// React Imports
import { forwardRef } from 'react'

import { format } from 'date-fns'

import Close from '@/@menu/svg/Close'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/@core/components/mui/AppReactDatepicker'

const PickersRange = ({ startDateRange, endDateRange, handleOnChangeRange }) => {
  const CustomInput = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = start !== null ? `${format(start, 'yyyy-MM-dd')}` : null
    const endDate = end !== null ? ` - ${format(end, 'yyyy-MM-dd')}` : null

    const value = `${startDate !== null ? startDate : ''}${endDate !== null ? endDate : ''}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  return (
    <div className='flex items-center justify-center'>
      <AppReactDatepicker
        selectsRange
        monthsShown={2}
        endDate={endDateRange}
        selected={startDateRange}
        startDate={startDateRange}
        shouldCloseOnSelect={false}
        id='date-range-picker-months'
        onChange={handleOnChangeRange}
        customInput={<CustomInput end={endDateRange} start={startDateRange} label='From Date - To Date' />}
      />
      {(startDateRange || endDateRange) && (
        <span onClick={() => handleOnChangeRange([null, null])} className='!pt-8'>
          <Close />
        </span>
      )}
    </div>
  )
}

export default PickersRange
