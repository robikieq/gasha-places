import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

export class Select extends Component {
    constructor(props) {
        super(props)

        this.state = {
            date: ' ',
        }
    }

    handleChange = (event) => {
        console.log(event.target.value);

       this.setState({
            date: event.target.value
        });

        this.props.onChange(event);
    };

    render() {
        return (
            <div>
                <form className={useStyles.root} noValidate autoComplete="off">
                    <div>
                        <TextField
                            id="outlined-select-currency-native"
                            select
                            label="Select Date"
                            value={this.state.date}
                            onChange={this.handleChange}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Please select the date"
                            variant="outlined"
                        >
                            {this.props.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </div>
                </form>
            </div>
        )
    }
}

export default Select;