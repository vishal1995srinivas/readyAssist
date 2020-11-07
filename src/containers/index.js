import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';
import getUserData from '../helpers';
import AddButton from './add';
import './index.css';
class TableComponent extends Component {
	state = {
		userData: [],
		isLoading: true
	};
	async componentDidMount() {
		let userData = await getUserData();
		console.log(userData);
		let topUserData = userData.reverse();
		this.setState({ userData: topUserData, isLoading: false });
	}
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
		this.setState({ userData: newUserData });
	};
	render() {
		const { userData, isLoading } = this.state;
		const { addNewEntry } = this;
		let newData = [];
		const columns = [
			{
				title: 'Sl No',
				dataIndex: 'sl No',
				key: 'sl no',
				render: (index) => <a>{index}</a>
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
						<a>Edit</a>
						<a>Update</a>
						<a>Delete</a>
					</Space>
				)
			}
		];
		if (userData.length > 1) {
			userData.map((user, index) => {
				let newUser = {
					key: user._id,
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
			</div>
		);
	}
}

export default TableComponent;
