/* eslint-disable import/order */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import PasswordDialog from './PasswordDialog'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { callAPI } from '@/utils/API/callAPI'
import { toast } from 'react-toastify'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  const anchorRef = useRef(null)
  const router = useRouter()
  const { settings } = useSettings()
  const [open, setOpen] = useState(false)
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    setUserName(localStorage.getItem('username') || '')
  }, [])

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event, url) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    const params = {
      userId: Number(localStorage.getItem('userId'))
    }

    const url = `${process.env.API}/${process.env.SERVER === 'dev' ? 'auth/signout' : 'authsignout'}`

    const successCallback = (ResponseData, error, ResponseStatus, Message) => {
      if (ResponseStatus === 'success' && error === false) {
        toast.success(Message)
        localStorage.clear()
        router.push('/login')
      } else {
        router.push('/login')
      }
    }

    callAPI(url, params, successCallback, 'POST')
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt={userName.length > 0 ? userName : ''}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        >
          {userName.length > 0 ? userName.charAt(0) : ''}
        </Avatar>
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar alt={userName.length > 0 ? userName.charAt(0) : ''}>
                      {userName.length > 0 ? userName.charAt(0) : ''}
                    </Avatar>
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {userName}
                      </Typography>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 mt-2 items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='outlined'
                      color='warning'
                      size='small'
                      endIcon={<i className='tabler-lock' />}
                      onClick={() => setOpenPasswordDialog(true)}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Change Password
                    </Button>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      <PasswordDialog
        open={openPasswordDialog}
        handleClose={() => {
          setOpenPasswordDialog(false)
        }}
      />
    </>
  )
}

export default UserDropdown
