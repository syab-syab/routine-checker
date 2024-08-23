// import React from 'react'
import { useState } from 'react';
import { localSetItem } from '../functions/localStorageFunc';
import { localGetItem } from '../functions/localStorageFunc';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

// リセット時間を更新したら
// ローカルストレージのtestResetHourを更新する

type Props = {
  hourKey: string,
  resetMilliKey: string,
  lastResetedMilliKey: string
}


const ResetTimeDisplay = (props: Props) => {
  
  const [resetHour, setResetHour] = useState<string>("0")

  const tmp: string | any = localGetItem(props.hourKey)
  const [nextReset, setNextReset] = useState<string>(
    tmp ? tmp : "0"
  )

  const hourArr = [...Array(24)].map((_, i) => i)

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
      <h2>リセット:{`${nextReset}時00分`}</h2>

      <Grid container justifyContent="center">
      <Grid item xs={4}>
        <FormControl fullWidth>
        <InputLabel id="hour" sx={{fontSize: 20}}>Hour</InputLabel>
        <Select
          sx={{fontSize: 20}}
          labelId="hour"
          id="demo-simple-select"
          value={resetHour}
          label="hour"
          onChange={(event: SelectChangeEvent) => setResetHour(event.target.value as string)}
        >
          {
            hourArr.map((h, i) => {
              return (
                <MenuItem key={i} value={h} sx={{fontSize: 20}}>{h}</MenuItem>
              )
            })
          }
        </Select>
        <Button sx={{marginTop: 1, fontSize: 15, color: 'white'}} onClick={changeResetTime} style={{"background": "black"}}>
          変更          
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