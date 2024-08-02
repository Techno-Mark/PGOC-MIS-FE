'use client'

// MUI imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Third-party Imports
import ReactDatePickerComponent from 'react-datepicker'
import { addDays } from 'date-fns'

// Styles
import 'react-datepicker/dist/react-datepicker.css'

// Styled Components
const StyledReactDatePicker = styled(Box)(({ theme }) => {
  return {
    '& .react-datepicker-popper': {
      zIndex: 20,
      paddingTop: `${theme.spacing(0.5)} !important`
    },
    '& .react-datepicker-wrapper': {
      width: '100%'
    },
    '& .react-datepicker__triangle': {
      display: 'none'
    },
    '& .react-datepicker': {
      color: theme.palette.text.primary,
      borderRadius: theme.shape.borderRadius,
      fontFamily: theme.typography.fontFamily,
      backgroundColor: theme.palette.background.paper,
      boxShadow: 'var(--mui-customShadows-md)',
      border: 'none',
      '& .react-datepicker__header': {
        padding: 0,
        border: 'none',
        fontWeight: 'normal',
        backgroundColor: theme.palette.background.paper,
        '& .react-datepicker__current-month, &.react-datepicker-year-header': {
          textAlign: 'left'
        },
        '&:not(.react-datepicker-year-header)': {
          '& + .react-datepicker__month, & + .react-datepicker__year': {
            margin: theme.spacing(2),
            marginTop: theme.spacing(4.5)
          }
        },
        '&.react-datepicker-year-header': {
          '& + .react-datepicker__month, & + .react-datepicker__year': {
            margin: theme.spacing(2),
            marginTop: theme.spacing(0)
          }
        }
      },
      '& > .react-datepicker__navigation': {
        top: 13,
        borderRadius: '50%',
        backgroundColor: 'var(--mui-palette-action-selected)',
        '&.react-datepicker__navigation--previous': {
          width: 30,
          height: 30,
          border: 'none',
          top: 12,
          ...(theme.direction === 'ltr' ? { left: 'auto', right: '57px' } : { right: 15 }),
          backgroundImage: `${"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z' /%3E%3C/svg%3E\")".replace(
            'currentColor',
            theme.palette.mode === 'dark' ? 'rgb(231 227 252 / 0.7)' : 'rgb(46 38 61 / 0.7)'
          )}`,
          '& .react-datepicker__navigation-icon': {
            display: 'none'
          },
          '&:has(+ .react-datepicker__navigation--next--with-time)':
            theme.direction === 'ltr' ? { right: 177 } : { left: 177 }
        },
        '&.react-datepicker__navigation--next': {
          width: 30,
          height: 30,
          border: 'none',
          top: 12,
          ...(theme.direction === 'ltr' ? { right: 15 } : { left: 15 }),
          backgroundImage: `${"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='currentColor' d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' /%3E%3C/svg%3E\")".replace(
            'currentColor',
            theme.palette.mode === 'dark' ? 'rgb(231 227 252 / 0.7)' : 'rgb(46 38 61 / 0.7)'
          )}`,
          '& .react-datepicker__navigation-icon': {
            display: 'none'
          }
        },
        '&.react-datepicker__navigation--next--with-time': theme.direction === 'ltr' ? { right: 135 } : { left: 135 },
        '&:focus, &:active': {
          outline: 0
        }
      },
      '& .react-datepicker__current-month, & .react-datepicker-year-header': {
        ...theme.typography.subtitle1,
        lineHeight: 2,
        paddingBlockStart: theme.spacing(3),
        paddingBlockEnd: theme.spacing(4.5),
        paddingInline: theme.spacing(4),
        color: 'var(--mui-palette-text-primary)'
      },
      '& .react-datepicker__day-name': {
        margin: 0,
        width: '2.25rem',
        ...theme.typography.subtitle2,
        color: theme.palette.text.primary
      },
      '& .react-datepicker__day-names': {
        marginBottom: 0
      },
      '& .react-datepicker__day': {
        margin: 0,
        width: '2.25rem',
        borderRadius: '50%',
        lineHeight: '2.25rem',
        color: theme.palette.text.primary,
        fontSize: theme.typography.body1.fontSize,
        '&.react-datepicker__day--selected.react-datepicker__day--in-selecting-range.react-datepicker__day--selecting-range-start, &.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range, &.react-datepicker__day--range-start':
          {
            borderRadius: '18px 0px 0px 18px;',
            color: `${theme.palette.common.white} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`
          },
        '&.react-datepicker__day--range-end.react-datepicker__day--in-range': {
          borderRadius: '0px 18px 18px 0px',
          color: `${theme.palette.common.white} !important`,
          backgroundColor: `${theme.palette.primary.main} !important`
        },
        '&:focus, &:active': {
          outline: 0
        },
        '&.react-datepicker__day--outside-month, &.react-datepicker__day--disabled:not(.react-datepicker__day--selected)':
          {
            color: theme.palette.text.disabled,
            '&:hover': {
              backgroundColor: 'transparent'
            }
          },
        '&.react-datepicker__day--highlighted, &.react-datepicker__day--highlighted:hover': {
          color: theme.palette.success.main,
          backgroundColor: 'var(--mui-palette-success-lightOpacity)',
          '&.react-datepicker__day--selected': {
            backgroundColor: `${theme.palette.primary.main} !important`
          }
        }
      },
      '&:has(.react-datepicker__day--in-range)': {
        '& > .react-datepicker__navigation': {
          '&.react-datepicker__navigation--previous': {
            ...(theme.direction === 'ltr' ? { left: 15 } : { right: 15 })
          }
        },
        '& .react-datepicker__header': {
          '& .react-datepicker__current-month': {
            textAlign: 'center'
          }
        }
      },
      '& .react-datepicker__day--in-range, & .react-datepicker__day--in-selecting-range': {
        borderRadius: 0,
        color: `${theme.palette.primary.main} !important`,
        backgroundColor: 'var(--mui-palette-primary-lightOpacity) !important'
      },
      '& .react-datepicker__day--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__day--selected):not(:empty)': {
          color: theme.palette.primary.main,
          backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`,
          '&:hover': {
            backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.24)`
          },
          '&.react-datepicker__day--keyboard-selected': {
            backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`,
            '&:hover': {
              backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.16)`
            }
          }
        }
      },
      '& .react-datepicker__month-text--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__month-text--selected)': {
          lineHeight: '2.125rem',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.04)`
          }
        }
      },
      '& .react-datepicker__year-text--today': {
        fontWeight: 'normal',
        '&:not(.react-datepicker__year-text--selected)': {
          lineHeight: '2.125rem',
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: `rgb(${theme.vars.palette.primary.mainChannel} / 0.04)`
          }
        }
      },
      '& .react-datepicker__month-text--selected, & .react-datepicker__month-text--keyboard-selected': {
        lineHeight: '2.125rem',
        color: `${theme.palette.common.white} !important`,
        backgroundColor: `${theme.palette.primary.main} !important`,
        '&:hover': {
          backgroundColor: `${theme.palette.primary.dark} !important`
        }
      },
      '& .react-datepicker__year-text--selected, & .react-datepicker__year-text--keyboard-selected': {
        lineHeight: '2.125rem',
        color: `${theme.palette.common.white} !important`,
        backgroundColor: `${theme.palette.primary.main} !important`,
        '&:hover': {
          backgroundColor: `${theme.palette.primary.dark} !important`
        }
      }
    }
  }
})

// Main Component
const ReactDatePicker = props => {
  const { popperPlacement, popperModifiers, ...rest } = props

  return (
    <StyledReactDatePicker>
      <ReactDatePickerComponent
        {...rest}
        popperPlacement={popperPlacement}
        popperModifiers={popperModifiers}
        maxDate={new Date()}
      />
    </StyledReactDatePicker>
  )
}

export default ReactDatePicker
