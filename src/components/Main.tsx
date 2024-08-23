import React, { useState, useEffect } from 'react'
import { db } from '../models/db';
import RoutineList from './RoutineList';
import ResetTimeDisplay from './ResetTimeDisplay';
import { localGetItem } from '../functions/localStorageFunc';
import { localSetItem } from '../functions/localStorageFunc';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import styled from 'styled-components';

const ButtonTypo = styled.span`
  color: white;
`

const {routines} = db

const Main = () => {
  // 開いた時点でのミリ秒を取得する(currentMilli)
  const currentMilli = Date.now()

  // 次回のリセット時間のミリ秒がローカルに存在するか確認する(nextResetMilli)
  const nextResetMilliKey: string = "nextResetMilli"
  const nextResetMilliValue: string | any = localGetItem(nextResetMilliKey)

  // 最後に更新した時間がローカルに記録されているかどうかを確認(lastResetedMilli)
  const lastResetedMilliKey: string = "lastResetedMilli"
  const lastResetedMilliValue: string | any = localGetItem(lastResetedMilliKey)

  // リセットする時(Hour)がローカルに記録されているかどうか確認()
  const resetHourKey: string = "resetHour"
  const resetHourValue: string | any = localGetItem(resetHourKey)

  // 無いor現在のミリ秒がそれより大きかったらチェックのリセットを外す
  // 更新後にリセット時のミリ秒をローカルストレージに記録する(lastResetedMilli)
  // lastResetMilliから次の日の年・月・日を取得して
  // 次回のリセット時間(settingResetMilli)を更新

  // 取得する=>開いたときのミリ秒(currentMilli)
  // 記録する=>リセット時のミリ秒(lastResetedMillie)

  // List.tsxに渡す(falseならそのまま、trueならチェックをすべて外す)
  const [resetToggle, setResetToggle] = useState<boolean>(false)

    // とりあえず1秒ごとにカウントするよう動かしてみた
    const [current, setCurrent] = useState<number>(Date.now())
    useEffect(() => {
      // セットアップ処理
      const count = setInterval(() => {
        setCurrent(Date.now())
        // ここに処理
        if (!(lastResetedMilliValue) || !(nextResetMilliValue) || currentMilli > Number(nextResetMilliValue)) {
          setResetToggle(true)
          // 更新時のミリ秒を取得
          const tmpCurrentDateMilli = Date.now()
          // 最新リセット時間を更新
          localSetItem(lastResetedMilliKey, String(tmpCurrentDateMilli))
          // リセット時(hour)を取得(ローカルになければデフォルトは0で記録)
          const resetHour: string = resetHourValue ? resetHourValue : 0
          // settingResetMilliを更新
          const tmpTomorrow = new Date(tmpCurrentDateMilli+86400000)
          const tmpTomorrowY = tmpTomorrow.getFullYear()
          const tmpTomorrowM = tmpTomorrow.getMonth()
          const tmpTomorrowD = tmpTomorrow.getDate()
          
          const tmpTomorrowDate = new Date(tmpTomorrowY, tmpTomorrowM, tmpTomorrowD, Number(resetHour))
          console.log(tmpTomorrowDate)
          localSetItem(nextResetMilliKey, String(tmpTomorrowDate.getTime()))
    
          // ローカルにリセット時(Hour)が無いなら0を記録する
          if (!resetHourValue) {
            localSetItem(resetHourKey, "0")
          }
      } else {
        setResetToggle(false)
      }
        // ここに処理
      }, 1000)
  
      // クリーンアップ処理
      // return無しだと挙動がおかしくなるから必要
      return () => clearInterval(count)
    }, [current, currentMilli, lastResetedMilliValue, nextResetMilliValue, resetHourValue])


  const [content, setContent] = useState<string>("")


  const addRoutine = async () => {
    if (content.length <= 0) {
      alert("入力してください")
    } else {
      await routines.add({
        content: content,
        done: 0
      })
      setContent("")
    }
  }

  return (
    <div>
      <ResetTimeDisplay hourKey={resetHourKey} resetMilliKey={nextResetMilliKey} lastResetedMilliKey={lastResetedMilliKey} />
      <RoutineList reset={resetToggle} />
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <TextField fullWidth id="filled-basic" label="Content" variant="filled" onChange={(e) => setContent(e.target.value)} />
          <Button onClick={() => addRoutine()} sx={{marginTop: 1}} style={{"background": "black"}}>
            <ButtonTypo>
              追加
            </ButtonTypo>
          </Button>
          <hr />
        </Grid>
      </Grid>
    </div>
  )
}

export default Main