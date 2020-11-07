import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { Switch } from 'antd';
import createUser from '../helpers/addData';
class AddButton extends Component {
	state = { visible: false, error: '', loading: false, username: '', firstName: '', lastName: '', isActive: true };

	showModal = () => {
		this.setState({
			visible: true
		});
	};
	addEntry = async () => {
		const { addNewEntry } = this.props;
		const { username, isActive, firstName, lastName } = this.state;
		try {
			let bodyData = {
				username: username,
				firstName: firstName,
				lastName: lastName
			};
			let result = await createUser(bodyData);
			console.log(result);
			if (result.status === 'success') {
				addNewEntry(username, firstName, lastName, isActive);
			}
			this.setState({ visible: false, loading: false });
		} catch (error) {
			console.log(error);
			this.setState({ error: error, loading: false });
		}
	};
	handleOk = async (e) => {
		this.setState({ loading: true }, this.addEntry);
	};

	handleCancel = (e) => {
		this.setState({
			visible: false
		});
	};
	usernameChange = (e) => {
		this.setState({ username: e.target.value });
	};
	firstNameChange = (e) => {
		this.setState({ firstName: e.target.value });
	};
	lastNameChange = (e) => {
		this.setState({ lastName: e.target.value });
	};
	onChangeSwitch = (checked) => {
		this.setState({ isActive: checked });
	};
	render() {
		console.log(this.state);
		const { loading } = this.state;
		return (
			<div>
				<Button type="primary" onClick={this.showModal}>
					Add User
				</Button>
				<Modal title="Add User" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
					<form>
						<div className="formField">
							Username &nbsp;
							<input type="text" onChange={this.usernameChange} required />
						</div>
						<div>
							First Name &nbsp;
							<input type="text" onChange={this.firstNameChange} required />
						</div>
						<div>
							Last Name &nbsp;
							<input type="text" onChange={this.lastNameChange} />
						</div>
						{loading && <div>Loading...</div>}
					</form>
				</Modal>
			</div>
		);
	}
}
export default AddButton;
