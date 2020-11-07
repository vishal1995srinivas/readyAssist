import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { Table, Tag, Space } from 'antd';
import { withAlert } from 'react-alert';
import getUserData from '../helpers';
import updateUser from '../helpers/update';
import AddButton from './add';
import './index.css';
class TableComponent extends Component {
	state = {
		userData: [],
		isLoading: true,
		visible: false,
		username: '',
		firstname: '',
		lastname: '',
		key: '',
		updateLoading: false
	};
	async componentDidMount() {
		let userData = await getUserData();
		console.log(userData);
		let topUserData = userData.reverse();
		this.setState({ userData: topUserData, isLoading: false });
	}
	showModal = (record) => {
		console.log(record);
		let { key, username, firstname, lastname } = record;
		this.setState({
			visible: true,
			username,
			firstname,
			lastname,
			key
		});
	};
	editEntry = async (firstName, lastName, key) => {
		try {
			let bodyData = {
				id: key,
				firstName: firstName,
				lastName: lastName
			};

			let result = await updateUser(bodyData);

			if (result.status === 'success') {
				this.editNewEntry(key, firstName, lastName);
			} else {
				this.props.alert.error(`Error updating to database. Please try again`);
			}
			this.setState({ visible: false, updateLoading: false });
		} catch (error) {
			console.log(error);
			this.setState({ error: error, updateLoading: false });
		}
	};
	handleOk = (e) => {
		const { key, username, firstname, lastname } = this.state;
		console.log(key, username, firstname, lastname);
		this.setState({ updateLoading: true }, () => {
			this.editEntry(firstname, lastname, key);
		});
	};

	handleCancel = (e) => {
		this.setState({
			visible: false
		});
	};
	addNewEntry = (username, firstName, lastName, isActive) => {
		let newUser = {
			_id: Date.now(),
			username: username,
			firstName: firstName,
			lastName: lastName,
			isActive: isActive
		};
		let newUserData = [ ...this.state.userData ];
		newUserData.unshift(newUser);
		console.log(newUserData);
		this.props.alert.success('New entry added successfully');
		this.setState({ userData: newUserData });
	};
	editNewEntry = (id, firstName, lastName) => {
		let newUserData = [ ...this.state.userData ];
		newUserData.forEach((user, index) => {
			if (user._id === id) {
				user.firstName = firstName;
				user.lastName = lastName;
			}
		});
		console.log(newUserData);
		this.props.alert.success('Update operation successfull');
		this.setState({ userData: newUserData });
	};
	firstNameChange = (e) => {
		this.setState({ firstname: e.target.value });
	};
	lastNameChange = (e) => {
		this.setState({ lastname: e.target.value });
	};
	render() {
		const { userData, isLoading, updateLoading, username, firstname, lastname } = this.state;
		const { addNewEntry, firstNameChange, lastNameChange } = this;
		console.log(this.state);
		let newData = [];
		const columns = [
			{
				title: 'Sl No',
				dataIndex: 'slNo',
				key: 'slno',
				render: (text, record) => <a>{record.slNo}</a>
			},
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
				render: (text) => <a>{text}</a>
			},
			{
				title: 'First Name',
				dataIndex: 'firstname',
				key: 'firstname'
			},
			{
				title: 'Last Name',
				dataIndex: 'lastname',
				key: 'lastname'
			},
			{
				title: 'Active',
				key: 'active',
				dataIndex: 'active',
				render: (text, record) => (
					<div>{record.active ? <Tag color="green">active</Tag> : <Tag color="red">Not active</Tag>}</div>
				)
			},
			{
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<Space size="middle">
						<a
							onClick={() => {
								this.showModal(record);
								console.log(record);
							}}
						>
							Edit
						</a>
						<a>Delete</a>
					</Space>
				)
			}
		];
		if (userData.length > 1) {
			userData.map((user, index) => {
				let newUser = {
					key: user._id,
					slNo: index + 1,
					username: user.username,
					firstname: user.firstName,
					lastname: user.lastName,
					active: user.isActive
				};
				newData.push(newUser);
			});
		}
		return (
			<div>
				<div>
					<AddButton addNewEntry={addNewEntry} />
				</div>
				{isLoading ? <div>loading...</div> : <Table columns={columns} dataSource={newData} />}
				<Modal title="Edit User" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
					<form>
						<div className="formField">
							Username &nbsp;
							<input type="text" disabled value={username} />
						</div>
						<div>
							First Name &nbsp;
							<input type="text" value={firstname} onChange={this.firstNameChange} required />
						</div>
						<div>
							Last Name &nbsp;
							<input type="text" value={lastname} onChange={this.lastNameChange} />
						</div>
						{updateLoading && <div>Loading...</div>}
					</form>
				</Modal>
			</div>
		);
	}
}

export default withAlert()(TableComponent);
