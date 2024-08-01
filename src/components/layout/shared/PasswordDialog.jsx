/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CustomTextField from '@/@core/components/mui/TextField'
import { IconButton, InputAdornment } from '@mui/material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { callAPI } from '@/utils/API/callAPI'

const PasswordDialog = ({ open, handleClose }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const validatePassword = password => {
    // Password validation regex
    const minLength = /.{8,}/
    const maxLength = /.{1,20}/
    const upperCase = /[A-Z]/
    const lowerCase = /[a-z]/
    const number = /[0-9]/
    const specialChar = /[!@#$%^&*()_+{}\[\]:;"'<>,.?~`]/

    if (password.trim().length <= 0) return 'Password is required'
    if (!minLength.test(password)) return 'Password must be at least 8 characters long'
    if (!maxLength.test(password)) return 'Password must be less than 20 characters long'
    if (!upperCase.test(password)) return 'Password must contain at least one uppercase letter'
    if (!lowerCase.test(password)) return 'Password must contain at least one lowercase letter'
    if (!number.test(password)) return 'Password must contain at least one number'
    if (!specialChar.test(password)) return 'Password must contain at least one special character'

    return ''
  }

  const handlePasswordChange = () => {
    let isValid = true
    const passwordValidationError = validatePassword(password)
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      isValid = false
    } else {
      setPasswordError('')
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('Confirm password is required')
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      isValid = false
    } else {
      setConfirmPasswordError('')
    }

    if (isValid) {
      const params = {
        newPassword: password,
        confirmPassword: confirmPassword
      }

      const url = `${process.env.API}/${process.env.SERVER === 'dev' ? 'auth/reset-password' : 'authresetpassword'}`

      const successCallback = (ResponseData, error, ResponseStatus, Message) => {
        if (ResponseStatus === 'success' && error === false) {
          toast.success(Message)
          handleReset()
        } else {
          handleReset()
        }
      }

      callAPI(url, params, successCallback, 'POST')
    }
  }

  const handleReset = () => {
    setPassword('')
    setConfirmPassword('')
    setPasswordError('')
    setConfirmPasswordError('')
    setIsPasswordShown(false)
    setIsConfirmPasswordShown(false)
    handleClose()
  }

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={handleReset}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='flex flex-col items-start justify-center text-start gap-1'>
          <Typography variant='h4'>Change Password 🔒</Typography>
        </div>
        <form
          noValidate
          autoComplete='off'
          onSubmit={e => {
            e.preventDefault()
            handlePasswordChange()
          }}
          className='flex flex-col w-full mt-4 gap-6'
        >
          <CustomTextField
            autoFocus
            fullWidth
            label='New Password'
            placeholder='············'
            type={isPasswordShown ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={e => e.preventDefault()}
                    tabIndex={-1}
                  >
                    <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              ),
              autoComplete: 'new-password'
            }}
          />
          <CustomTextField
            fullWidth
            label='Confirm Password'
            placeholder='············'
            type={isConfirmPasswordShown ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value)
              setConfirmPasswordError('')
            }}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={e => e.preventDefault()}
                    tabIndex={-1}
                  >
                    <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              ),
              autoComplete: 'new-password'
            }}
          />
        </form>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' type='submit' onClick={handlePasswordChange}>
          Set New Password
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleReset}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PasswordDialog
