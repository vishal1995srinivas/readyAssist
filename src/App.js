import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import logo from './logo.svg';
import './App.css';
import TableComponent from './containers';

const options = {
	// you can also just use 'bottom center'
	position: positions.BOTTOM_CENTER,
	timeout: 4000,
	offset: '30px',
	transition: transitions.SCALE
};
function App() {
	return (
		<div className="App">
			<AlertProvider template={AlertTemplate} {...options}>
				<TableComponent />
			</AlertProvider>
		</div>
	);
}

export default App;
