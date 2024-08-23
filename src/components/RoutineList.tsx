import React, { useState } from 'react'
import { Routine } from '../models/Routine';
import { db } from '../models/db';
import { useLiveQuery } from 'dexie-react-hooks';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';
import { localGetItem, localSetItem } from '../functions/localStorageFunc';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';


// trueならチェックを全部外す(doneを0にする)
type Props = {
  reset: boolean
}

// レスポンシブでwidth: 10rem;
const ContentWrapper = styled.span`
  display: inline-block;
  width: 40rem;
  overflow: hidden;
  font-weight: bold;
  @media screen and (max-width: 840px) {
    width: 30rem;
  }
  @media screen and (max-width: 700px) {
    width: 20rem;
  }
  @media screen and (max-width: 515px) {
    width: 10rem;
  }
`

const RoutineList = (props: Props) => {

  const allRoutines: Array<Routine> | undefined = useLiveQuery(() => db.routines.toArray());

  const toggleStatus = async (index?: number, done?: number) => {
    switch (done) {
      case 0:
        await db.routines.update( index, {done: 1})
        break;
      case 1:
        await db.routines.update(index, {done: 0})
        break;
      default:
        break;
    }
  }

  // 苦肉の策
  const routinesAllNotDone = async (index: number | undefined) => {
    await db.routines.update(index, {done: 0})
  }

  if (props.reset) {
    allRoutines?.forEach(r => {
      routinesAllNotDone(r.id)
    })
  }

  const deleteRoutine = (id?: number): void => {
      const res = window.confirm('削除してもよろしいですか？')
      if (res) {
        db.routines.delete(id)
        alert("削除しました。")
      } else {
        alert("戻ります")
      }
  }

  // 一斉チェック
  const localAllCheckKey: string = "allCheck"
  const localAllcheckVal: number = Number(localGetItem(localAllCheckKey))
  const [allCheck, setAllCheck] = useState<boolean>(Boolean(localAllcheckVal))

  const allCheckRoutine = async (allCheck: boolean) => {
    if (!allCheck) {
      allRoutines?.forEach(r => {
        db.routines.update( r.id, {done: 1})
      })
      setAllCheck(true)
      localSetItem(localAllCheckKey, "1")
    } else {
      allRoutines?.forEach(r => {
        db.routines.update( r.id, {done: 0})
      })
      setAllCheck(false)
      localSetItem(localAllCheckKey, "0")
    }
  }

  // 一斉削除
  const allDeleteRoutine = async () => {
    const res = window.confirm("ルーティーンを全削除してもよろしいですか？")
    if (res) {
      allRoutines?.forEach(r => {
        db.routines.delete(r.id)
      })
      alert("削除しました")
    }
  }

  return (
    <div>
      {/* <p>
        {allCheck ? <span>true</span> : <span>false</span>}
      </p> */}
      <TableContainer>
        <Table>
          <TableHead style={{"backgroundColor": "black"}}>
            <TableRow style={{"color": "white"}}>
              <TableCell align="center">
                {/* チェックするとすべてdoneにする */}
                <Checkbox color="primary" style={{"color": "white"}} checked={allCheck ? true : false} onChange={() => allCheckRoutine(allCheck)} />
              </TableCell>
              <TableCell style={{"color": "white"}} align="center">Content</TableCell>
              <TableCell align="center">
                {/* クリックすると全削除 */}
                <IconButton onClick={allDeleteRoutine}>
                  <DeleteIcon style={{"color": "white"}} />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              allRoutines?.map(r => {
                return (
                  <TableRow  key={r.id} style={{"background": r.done ? "#cdcdcd" : "transparent" }}>
                    <TableCell align="center">
                      <Checkbox color="default" checked={r.done ? true : false} onChange={() => toggleStatus(r.id, r.done)} />
                    </TableCell>
                    <TableCell align="center">
                    <Tooltip title={r.content}>
                      <ContentWrapper>
                        {r.content}
                      </ContentWrapper>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => deleteRoutine(r.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      {/* <p>
        <button onClick={allCheckRoutine}>All Done</button>
        <br />
        <button onClick={allDeleteRoutine}>All Delete</button>
      </p> */}
    </div>
  )
}

export default RoutineList