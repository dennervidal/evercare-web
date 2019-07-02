import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red400, red300} from "material-ui/styles/colors";

const theme = getMuiTheme({
    palette: {
        primary1Color: red400,
        primary2Color: red300
    },
});

export default theme;