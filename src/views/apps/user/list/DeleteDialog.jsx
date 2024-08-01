// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { toast } from 'react-toastify'

import { callAPI } from '@/utils/API/callAPI'

const DeleteDialog = ({ open, handleClose, rowId, getList }) => {
  const handleDelete = () => {
    const params = {
      recordId: rowId
    }

    const url = `${process.env.API}/${process.env.SERVER === 'dev' ? 'consolidated-data/delete' : 'consolidateddatadelete'}`

    const successCallback = (ResponseData, error, ResponseStatus, Message) => {
      if (ResponseStatus === 'success' && error === false) {
        toast.success(Message)
        handleClose()
        getList()
      } else {
        handleClose()
      }
    }

    callAPI(url, params, successCallback, 'POST')
  }

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='tabler-alert-circle text-[88px] mbe-6 text-warning' />
        <Typography variant='h5'>Are you sure you want to delete this record?</Typography>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleDelete}>
          Yes
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
