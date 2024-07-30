/* eslint-disable import/order */
'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import AddUserDrawer from './AddUserDrawer'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import DeleteDialog from './DeleteDialog'
import SubmitDialog from './SubmitDialog'
import dayjs from 'dayjs'
import { addDays, subDays } from 'date-fns'
import PickersRange from './PickersRange'
import { callAPI } from '@/utils/API/callAPI'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// Column Definitions
const columnHelper = createColumnHelper()

const UserListTable = () => {
  // States
  const [addUser, setAddUser] = useState(false)
  const [deleteUser, setDeleteUser] = useState(false)
  const [submitRecord, setSubmitRecord] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  const [globalFilter, setGlobalFilter] = useState('')
  const [rowId, setRowId] = useState(0)
  const [editData, setEditData] = useState(null)

  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isCreatedToday, setIsCreatedToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [isAllRowsSelected, setIsAllRowsSelected] = useState(false)
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)

  const handleOnChangeRange = dates => {
    const [start, end] = dates

    setStartDateRange(start)
    setEndDateRange(end)
  }

  useEffect(() => {
    if (data.length === selectedRows.length && data.length > 0) {
      setIsAllRowsSelected(true)
    } else {
      setIsAllRowsSelected(false)
    }
  }, [selectedRows, data])

  const handleSelectAll = (checked, table) => {
    setIsAllRowsSelected(checked)

    if (checked) {
      const allRowIds = table.getRowModel().rows.map(row => row.original.RecordId)

      setSelectedRows(allRowIds)
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (checked, rowId) => {
    setSelectedRows(prevSelectedRows => {
      if (checked) {
        return [...prevSelectedRows, rowId]
      } else {
        return prevSelectedRows.filter(id => id !== rowId)
      }
    })
  }

  const columns = useMemo(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <div className='flex items-center'>
      //       <Checkbox
      //         checked={isAllRowsSelected}
      //         indeterminate={selectedRows.length > 0 && selectedRows.length < table.getRowModel().rows.length}
      //         onChange={e => {
      //           const checked = e.target.checked

      //           handleSelectAll(checked, table)
      //           table.getToggleAllRowsSelectedHandler()(e)
      //         }}
      //       />
      //     </div>
      //   ),
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       <Checkbox
      //         value={row.original.RecordId}
      //         checked={selectedRows.includes(row.original.RecordId)}
      //         disabled={!row.getCanSelect()}
      //         onChange={e => {
      //           const checked = e.target.checked

      //           handleSelectRow(checked, row.original.RecordId)
      //           row.getToggleSelectedHandler()(e)
      //         }}
      //       />
      //     </div>
      //   )
      // },
      columnHelper.accessor('date', {
        header: 'Date',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography className='capitalize'>{row.original.date}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('revenue', {
        header: 'Revenue',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography className='capitalize'>
                ₹{!!row.original.revenue ? row.original.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('salaryDirect', {
        header: 'Salary Direct',
        cell: ({ row }) => (
          <Typography className='capitalize'>
            ₹{row.original.salaryDirect.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        )
      }),
      columnHelper.accessor('salaryIndirect', {
        header: 'Salary Indirect',
        cell: ({ row }) => (
          <Typography className='capitalize'>
            ₹{row.original.salaryIndirect.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Typography>
        )
      }),
      columnHelper.accessor('usExpenses', {
        header: 'US Expenses',
        cell: ({ row }) => (
          <Typography>₹{row.original.usExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Typography>
        )
      }),
      columnHelper.accessor('conversionRate', {
        header: 'Conversion Rate',
        cell: ({ row }) => <Typography className='capitalize'>₹{row.original.conversionRate}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <IconButton
              onClick={() => {
                setRowId(row.original.RecordId)
                setEditData(row.original)
                setAddUser(true)
              }}
            >
              <i className='tabler-pencil text-[22px] text-textSecondary' />
            </IconButton> */}
            <IconButton
              onClick={() => {
                setRowId(row.original.RecordId)
                setDeleteUser(true)
              }}
            >
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    [selectedRows, isAllRowsSelected, data]
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getList = async () => {
    setLoading(true)

    const params = {
      page: table.getState().pagination.pageIndex + 1,
      limit: table.getState().pagination.pageSize,
      startDate: !!startDateRange ? dayjs(startDateRange).format('MM/DD/YYYY') : null,
      endDate: !!endDateRange ? dayjs(endDateRange).format('MM/DD/YYYY') : null,
      submitted: true
    }

    const url = `${process.env.API}/consolidated-data/list`

    const successCallback = (ResponseData, error, ResponseStatus, Message) => {
      if (ResponseStatus === 'success' && error === false) {
        setData(ResponseData.records)
        setTotalCount(ResponseData.totalRecords)
        setIsCreatedToday(ResponseData.todaysRecords)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }

    callAPI(url, params, successCallback, 'POST')
  }

  useEffect(() => {
    getList()
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, startDateRange, endDateRange])

  return (
    <>
      <Card>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <PickersRange
              startDateRange={startDateRange}
              endDateRange={endDateRange}
              handleOnChangeRange={handleOnChangeRange}
            />

            {/* <Button
              variant='contained'
              disabled={selectedRows.length <= 0}
              color='success'
              onClick={() => setSubmitRecord(true)}
              className={`is-full sm:is-auto ${selectedRows.length <= 0 && 'cursor-not-allowed'}`}
            >
              Submit
            </Button> */}
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUser(true)}
              className='is-full sm:is-auto whitespace-nowrap !w-48 mt-4'
              disabled={isCreatedToday}
            >
              Add Record
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={totalCount}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <AddUserDrawer
        open={addUser}
        handleClose={() => {
          setAddUser(false)
          setRowId(0)
          setEditData(null)
        }}
        rowId={rowId}
        getList={getList}
        editData={editData}
      />

      <DeleteDialog
        open={deleteUser}
        handleClose={() => {
          setDeleteUser(false)
          setRowId(0)
        }}
        rowId={rowId}
        getList={getList}
      />

      <SubmitDialog
        open={submitRecord}
        handleClose={() => {
          setSubmitRecord(false)
          setSelectedRows([])
          setIsAllRowsSelected(false)
        }}
        checkboxId={selectedRows}
        setCheckboxId={setSelectedRows}
        getList={getList}
      />
    </>
  )
}

export default UserListTable
