import React from 'react';
import './App.css';
import 'antd/dist/antd.css'
import { Tabs, Form } from 'antd';
import SignIn from './Form/SignIn';
import SignUp from './Form/SignUp';

const { TabPane } = Tabs;

class TabNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1'
    }
  }

  changeTab = activeKey => {
    this.setState({
      activeTab: activeKey
    })
  };


  render() {
    return(
      <Tabs activeKey={this.state.activeTab} onChange={this.changeTab}>
        <TabPane tab="SIGN IN" key="1">
          <SignIn form={this.props.form} view={this.changeTab.bind(this, '2')}/>
        </TabPane>
        <TabPane tab="CREATE NEW ACCOUNT" key="2">
          <SignUp form={this.props.form} view={this.changeTab.bind(this, '1')}/>
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(TabNavigation);
