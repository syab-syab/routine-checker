import React, { useState } from 'react'
import { db } from '../models/db';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // margin: "0, 50",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
  show: boolean,
  func: () => void,
  setState: React.Dispatch<React.SetStateAction<boolean>>
}

const {routines} = db

const AddRoutine = (props: Props) => {
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
      props.setState(false)
    }
  }

  if (props.show) {
    return (
      <>
      <Button onClick={props.func}></Button>
      <Modal
        open={props.show}
        onClose={props.func}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField fullWidth id="filled-basic" sx={{fontSize: 15}} label="Content" variant="filled" onChange={(e) => setContent(e.target.value)} />
          <Button onClick={() => addRoutine()} sx={{marginTop: 1, fontSize: 15, color: 'white'}} style={{"background": "black"}}>
            追加
          </Button>
        </Box>
      </Modal>
    </>
    )
  } else {
    return null
  }

}

export default AddRoutine