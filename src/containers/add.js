import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { withAlert } from 'react-alert';
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
			} else {
				if (result.message === 'User already exists!!!') {
					this.props.alert.error(`User already exists. Please try with another username`);
				} else {
					this.props.alert.error(`Error Saving to  Database`);
				}
			}
			this.setState({ visible: false, loading: false, username: '', firstName: '', lastName: '' });
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
		const { loading, firstName, lastName, username } = this.state;
		return (
			<div>
				<Button type="primary" onClick={this.showModal}>
					Add User
				</Button>
				<Modal title="Add User" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
					<form>
						<div className="formField">
							Username &nbsp;
							<input type="text" value={username} onChange={this.usernameChange} required />
						</div>
						<div>
							First Name &nbsp;
							<input type="text" value={firstName} onChange={this.firstNameChange} required />
						</div>
						<div>
							Last Name &nbsp;
							<input type="text" value={lastName} onChange={this.lastNameChange} />
						</div>
						{loading && <div>Loading...</div>}
					</form>
				</Modal>
			</div>
		);
	}
}
export default withAlert()(AddButton);
