import React from "react";
import {Avatar, Button, Form, Icon, Input, Modal} from "antd";
import axios from 'axios';
import brcypt from 'bcryptjs';

class SignIn extends React.Component {

	handleSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(['user', 'pass'], (err, values) => {
			if (!err) {
				let { ipcRenderer } = window.require('electron');
				axios.post("https://dry-eyrie-39715.herokuapp.com/api/player/login", {user:values.user})
					.then(result => {
						brcypt.compare(values.pass, result.data.result.password, (err, res) => {
							if (res) {
								ipcRenderer.send('submitForm', ["successful", result.data.result.player_id]);
								Modal.success({
									title: 'Successful',
									content: 'Please wait while run Far Cry',
									onOk: this.props.form.resetFields()
								})
							} else {
								Modal.error({
									title: 'Error',
									content: "Wrong password",
								})
							}
						});
					})
					.catch(error => {
						Modal.error({
							title: 'Error',
							content: error.response.data.message,
						})
					})
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			wrapperCol: {
				xs: {span: 24},
			}
		};
		return(
			<div className={"form_signIn"}>
				<Avatar style={{textAlign: 'center'}} 
						size={200} 
						src="https://previews.123rf.com/images/nexusby/nexusby1703/nexusby170300243/74731429-crossed-powerful-pistols-two-handguns-on-white.jpg"
						/>
				<Form onSubmit={this.handleSubmit} {...formItemLayout}>
					<Form.Item>
						{getFieldDecorator('user', {
							rules:[
								{
									required: true,
									message: "Please input your username\n"
								},
							]
						})(
							<Input
								prefix={<Icon type="user" style={{color:'rgba(0, 0, 0, .25)'}}/>}
								placeholder="Username or  email"
							/>
						)}
					</Form.Item>

					<Form.Item>
						{getFieldDecorator('pass', {
							rules: [{required: true, message: 'Please input your password'}]
						})(
							<Input.Password
								prefix={<Icon type='lock' style={{color:'rgba(0, 0, 0, .25)'}}/>}
								placeholder="Password"
							/>
						)}
					</Form.Item>

					<Form.Item>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						<a href='#' className="login">Forgot Password ?</a>
						<Button style={{display: "block"}} type="primary" htmlType='submit'>Log In</Button>
					</Form.Item>
				</Form>
			</div>

		);
	}
}

export default SignIn;