// import React from 'react'
import { useState } from 'react';
import { localSetItem } from '../functions/localStorageFunc';
import { localGetItem } from '../functions/localStorageFunc';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import styled from 'styled-components';

// リセット時間を更新したら
// ローカルストレージのtestResetHourを更新する

type Props = {
  hourKey: string,
  resetMilliKey: string,
  lastResetedMilliKey: string
}

const ButtonTypo = styled.span`
  color: white;
`

const ResetTimeDisplay = (props: Props) => {
  
  const [resetHour, setResetHour] = useState<string>("0")

  // const tmp = new Date(Number(localGetItem(props.resetMilliKey)))
  // const [nextReset, setNextReset] = useState<string>(
  //   String(tmp.getHours())
  // )

  // const tmp = new Date(Number(localGetItem(props.resetMilliKey)))
  const [nextReset, setNextReset] = useState<string>(
    localGetItem(props.hourKey)
  )

  const hourArr = [...Array(24)].map((_, i) => i)

  // const handleChange = (event: SelectChangeEvent) => {
  //   setResetHour(event.target.value as string)
  // }

  const changeResetTime = async () => {
    const res = window.confirm(`リセット時間を${resetHour}時に更新してもよろしいですか？`)
    if (res) {
      localSetItem(props.hourKey, resetHour)
      const tmpLastResetedMilliValue: string | any = localGetItem(props.lastResetedMilliKey)
      const tomorrowDate = new Date(Number(tmpLastResetedMilliValue) + 86400000)
      const tomorrowY = tomorrowDate.getFullYear()
      const tomorrowM = tomorrowDate.getMonth()
      const tomorrowD = tomorrowDate.getDate()
      const tmpTomorrow = new Date(tomorrowY, tomorrowM, tomorrowD, Number(resetHour))
      setNextReset(resetHour)
      localSetItem(props.resetMilliKey, String(tmpTomorrow.getTime()))
      alert("更新完了")
    } else {
      alert("更新中止")
    }
  }

  return (
    <div>
      <p>リセット:{`${nextReset}時00分`}</p>

      <Grid container justifyContent="center">
      <Grid item xs={4}>
        <FormControl fullWidth>
        <InputLabel id="hour">Hour</InputLabel>
        <Select
          labelId="hour"
          id="demo-simple-select"
          value={resetHour}
          label="hour"
          onChange={(event: SelectChangeEvent) => setResetHour(event.target.value as string)}
        >
          {
            hourArr.map((h, i) => {
              return (
                <MenuItem key={i} value={h}>{h}</MenuItem>
              )
            })
          }
        </Select>
        <Button sx={{marginTop: 1}} onClick={changeResetTime} style={{"background": "black"}}>
          <ButtonTypo>
            変更
          </ButtonTypo>
          
        </Button>
        </ FormControl>
        </Grid>
        </Grid>
      <hr />
      <p></p>
    </div>
  )
}

export default ResetTimeDisplay