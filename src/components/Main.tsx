import React, { useState, useEffect } from 'react'
import RoutineList from './RoutineList';
import ResetTimeDisplay from './ResetTimeDisplay';
import { localGetItem } from '../functions/localStorageFunc';
import { localSetItem } from '../functions/localStorageFunc';
import styled from 'styled-components';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import AddRoutine from './AddRoutine';


const BtnWrapper = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 3rem;
  @media (max-width: 700px) {
    bottom: 3rem;
    right: 3rem;
  }
`


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



  // モーダル
  const [showAddRoutine, setShowAddRoutine] = useState<boolean>(false)
  const toggleShowAddWord = (): void => {
    setShowAddRoutine(!showAddRoutine) 
   }


  return (
    <div>
      <ResetTimeDisplay hourKey={resetHourKey} resetMilliKey={nextResetMilliKey} lastResetedMilliKey={lastResetedMilliKey} />
      <RoutineList reset={resetToggle} />
      <BtnWrapper>
        <Tooltip title={<h1>Add Routine</h1>} arrow>
          <Fab onClick={() => toggleShowAddWord()} color='default' aria-label="add">
            <AddIcon  fontSize='large' />
          </Fab>
        </Tooltip>
      </BtnWrapper>
      <AddRoutine show={showAddRoutine} func={toggleShowAddWord} setState={setShowAddRoutine} />
    </div>
  )
}

export default Main