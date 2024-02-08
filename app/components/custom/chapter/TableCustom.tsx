import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import {Remove} from "@mui/icons-material";
import {BaseDeleteModal} from "@/app/components/base";
import axios from "axios";
import {BASE_API_URL_V2} from "@/app/auth/urls";
import {toast} from "react-toastify";
import {isFunction} from "lodash";
import {TextList} from "@/app/types/types";

export interface Rows {
  id: string;
  category: string;
  comment: string;
}

export interface Columns {
  id: string;
  label: string;
  minWidth?: number;
  align?: string;
}

type Props = {
    rows?: Array<TextList>
  columns?: Array<Columns>
    handleAdd?: (row: TextList) => void
}

function TableCustom({rows, columns, handleAdd}: Props) {


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDelete, setIsDelete] = React.useState(false)
  const [itemDelete, setItemDelete] = React.useState<any>({})

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteOneText = async (id) => {
    try {
      await axios.post(BASE_API_URL_V2 + `/texts/delete/${id}`)
      toast.success('テキストブロックを削除しました。')
      setIsDelete(false)
    } catch (e) {
      toast.error('テキストブロックが削除できませんでした。')
      setIsDelete(true)
    }
  }

  // @ts-ignore
  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer sx={{maxHeight: 500}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{
              "& th": {
                fontSize: "1.05rem",
                backgroundColor: '#F5F5F5',
              }
            }}>
              {columns.map((column: any) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  // style={{minWidth: column.minWidth}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.length > 0 && rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>

                    {columns.map((column: any, idx: number) => {
                      const value = row[column.id];
                      if (column.id === 'action') {
                        return (
                          <TableCell
                            className='flex items-center px-6'
                            key={column.id + idx}
                            align={column.align}
                          >
                            <IconButton
                              className={'bg-[#DAE7F6] rounded-full w-[40px] h-[40px] m-auto'}
                              onClick={() => isFunction(handleAdd) && handleAdd(row)}
                            >
                              <AddIcon className={'m-auto w-[20px]'}/>
                            </IconButton>
                            <IconButton
                              className={'bg-[#DAE7F6] rounded-full w-[40px] h-[40px] m-auto hover:bg-red-500'}
                              onClick={() => {
                                setIsDelete(true)
                                setItemDelete(row)
                              }}
                            >
                              <Remove className={'m-auto w-[20px]'}/>
                            </IconButton>
                          </TableCell>)
                      } else return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value) : value}
                        </TableCell>
                      );
                    })}

                  </TableRow>
                );
              })}
            {rows?.length == 0 && <TableRow>
              <TableCell className={`text-center`}
                         colSpan={columns.length}>データなし</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <BaseDeleteModal
        label={`${itemDelete?.category}のテキストブロックを削除うしますか？`}
        isOpen={isDelete}
        handleClose={() => setIsDelete(false)}
        handleDelete={() => handleDeleteOneText(itemDelete?.id)}
      />
      <TablePagination
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        page={page}
        onPageChange={handleChangePage}
        labelDisplayedRows={({from, to, count}) => `${from}-${to}件を表示（全${count}件）`}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TableCustom
