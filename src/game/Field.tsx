import React from 'react';
import { IGame, IPlayer } from '../utils/contracts';
import '../styles/field.scss'
import FieldCell from './FieldCell';


interface IFieldProps {
  game: IGame
  player: IPlayer
  handleCellClick(rowParam: number, colParam: number): (...args: any[]) => void
	handleCellContext(rowParam: number, colParam: number): (...args: any[]) => void
}

const Field = (props: IFieldProps) => {
  const field = props.game?.mineField?.field;
  if (!field) return null;

  console.log(props.game.mineField)
  const { maxRows, maxCols } = props.game.mineField;
  return <div>
    <div className='fieldContainer'>
      <div style={{
        width: `${30 * maxCols + 40}px`,
        height: `${30 * maxRows + 40}px`,
        border: '1px solid silver',
        padding: 20,
        background: 'white',
        borderRadius: '4px',
        boxShadow: '4px 4px 4px darkgrey',
        marginTop: '30px'
      }}>
        {(Array.from(Array(props.game.mineField.maxRows).keys()))
          .map((row: any, rIndex: number) => (
            <div key={`r_${rIndex}`} className='fieldContainer'>
              {Array.from(Array(props.game.mineField.maxCols).keys()).map((col, colIndex) => (
                <div key={`c_${colIndex}`}
                  style={{
                    width: 30,
                    height: 30,
                    border: '1px solid whitesmoke',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}><FieldCell
                    col={colIndex}
                    key={`${rIndex}-${colIndex}`}
                    onClick={props.handleCellClick}
                    onContext={props.handleCellContext}
                    field={props.game.mineField}
                    row={rIndex}
                    opponent={props.player.id === '0' ? props.game.players[1] : props.game.players[0]} /></div>
              ))}
            </div>
          ))}
      </div>
      {/* <div>
        {(Array.from(Array(props.game.mineField.maxRows).keys()))
          .map((row: any, rIndex: number) => (
            <div>
              {Array.from(Array(props.game.mineField.maxCols).keys()).map((col, colIndex) => (
                <div key={`c_${colIndex}`}>{colIndex}</div>
              ))}
            </div>
          ))}
      </div> */}
    </div>

    {/* <div className={classes.root}>
      <Grid container spacing={0} alignItems="center" justify="center">
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
        <Grid container item xs={8} spacing={0}>
          <FormRow />
        </Grid>
      </Grid>
    </div> */}
  </div>
}

export default Field;

