import React from "react";
import {Button, Form, Input, Modal} from "antd";
import axios from 'axios';
import brcypt from 'bcryptjs';

class SignUp extends React.Component {

	handleSubmit = event => {
		event.preventDefault();
		this.props.form.validateFields(['username', 'password', 'email'], (err, values) => {
			if (err) {
				console.log(err);
				return
			}
			let { ipcRenderer } = window.require('electron');
			brcypt.genSalt(10, (error, salt) => {
				brcypt.hash(values['password'], salt, (error, hash) => {
					values['password'] = hash;
					axios.post("https://dry-eyrie-39715.herokuapp.com/api/player", values)
						.then(result => {
							ipcRenderer.send('submitForm', ["register", result.data.respond.player_id]);
							this.props.form.resetFields();
							Modal.success({
								title: 'Congratulation',
								content: `You have successfully registered, please access your mail to activate your account`,
								onOk: this.props.view()
							})
						})
						.catch(err => {
							Modal.error({
								title: "Something was wrong",
								content: err
							})
						});
				})
			});
		});
	};

	validateToNextPassword = (rule, value, callback) => {
		const {form} = this.props;
		if (!value) {
			form.validateFields(['confirm'], {force:true})
		}
		callback();
	};

	compareToFirstPassword = (rule, value, callback) => {
		const {form} = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords must is same');
		} else {
			callback();
		}
	};

	validateUserName = (rule, value, callback) => {
		axios.get(`https://dry-eyrie-39715.herokuapp.com/api/player/?name=${value}`)
			.then(result => {
				callback();
			})
			.catch(error => {
				callback("This user name was be used");
			});
	};

	validateEmail = (rule, value, callback) => {
		axios.get(`https://dry-eyrie-39715.herokuapp.com/api/player/?email=${value}`)
			.then(result => {
				callback();
			})
			.catch(error => {
				callback("This email was be used");
			});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: {span: 6},
			},
			wrapperCol: {
				xs: {span: 16},}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 6,
				}
			}
		};
		return(
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
				<Form.Item label={"Username"}>
					{getFieldDecorator('username', {
						rules: [
							{
								required: true,
								message: "Please input your username",
							},
							{
								validator: this.validateUserName,
							}
						]
					})(<Input/>)}
				</Form.Item>

				<Form.Item label={"Password"} hasFeedback>
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: "Please input your password"
							},
							{
								pattern:"^(?=(.*[\\d]){1,}).{8,35}$",
								message:"Your password must be of at least 8 characters and contain 1 digit\n"
							},
							{
								pattern:"^(?=.*?[A-Z])(?=(.*[a-z]){1,})",
								message:"Your password must be of at least 1 uppercase letter, 1 lowercase letter\n"
							},
							{
								pattern:"^(?=(.*[\\W]){1,})(?!.*\\s)",
								message:"Your password must be of at least 1 non-word character but no whitespace\n"
							},
							{
								validator: this.validateToNextPassword,
							},
						]
					})(<Input.Password/>)}
				</Form.Item>

				<Form.Item label={"Confirm Password"} hasFeedback>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: 'Please confirm your password'
							},
							{
								validator: this.compareToFirstPassword,
							}
						]
					})(<Input.Password/>)}
				</Form.Item>

				<Form.Item label={"E-mail"}>
					{getFieldDecorator('email', {
						rules: [
							{
								type: 'email',
								message: 'The Input not valid Email'
							},
							{
								required: true,
								message: "Please Input your email"
							},
							{
								validator: this.validateEmail,
							}
						]
					})(<Input/>)}
				</Form.Item>

				<Form.Item {...tailFormItemLayout}>
					<Button type={"primary"} htmlType={"submit"}>
						Resister
					</Button>
				</Form.Item>
			</Form>
		);
	}
}

export default SignUp;