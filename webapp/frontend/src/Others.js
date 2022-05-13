import React from 'react';
import { Layout, Typography, Space, Menu, Breadcrumb, Select, DatePicker, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './App.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import Chart from 'react-google-charts';

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

function Others() {

  let navigate = useNavigate();

  return (
    <div className="Plot1">
      <Layout>
        <Header style={{padding:10, textAlign: 'center'}}>
          <Space direction="vertical">
            <Title level={3} style = {{color:'white'}}>CCC assignment Group 11</Title>
          </Space>  
        </Header>
      </Layout>
      <Layout>
        <Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0, width: '150%' }}>
              <Menu.Item key = 'Dashborad'>
                Dashboard
              </Menu.Item>
              <SubMenu
                title = {<span>Topic 4 Analysis</span>}>
                <Menu.ItemGroup>

                  <Menu.Item style={{ height: '50%'}}>
                    <Select
                      mode="multiple"
                      showArrow
                      style={{ width: '100%'}}
                      showSearch
                      placeholder="Select Cities"
                      optionFilterProp="children">
                      <Select value="Brisbane">Brisbane</Select>
                      <Select value="Canberra">Canberra</Select>
                      <Select value="Melbourne">Melbourne</Select>
                      <Select value="Syndey">Syndey</Select>
                    </Select>
                  </Menu.Item>

                  <Menu.Item style={{ height: '50%'}}>
                    <Select
                      mode='multiple'
                      showSearch
                      placeholder="Select Age Groups"
                      optionFilterProp="children"
                      style={{ width: '100%' }}
                    >
                      <Select value="<10">Less than 10</Select>
                      <Select value="10-15">10-15</Select>
                      <Select value="15-20">15-20</Select>
                      <Select value="20-25">20-25</Select>
                      <Select value="25-30">25-30</Select>
                      <Select value="35-40">35-40</Select>
                      <Select value="45-50">45-50</Select>
                      <Select value="55-60">55-60</Select>
                      <Select value="65-70">65-70</Select>
                      <Select value="75-80">75-80</Select>
                      <Select value="80+">80+</Select>
                    </Select>
                  </Menu.Item>

                  <Menu.Item>
                    <Space direction="vertical" size={12}>
                      <RangePicker />
                    </Space>
                  </Menu.Item>

                  <Button type="primary" style={{marginLeft: "115px"}}>Submit</Button>
            
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu title = {<span>Related Pages</span>}>
                <Menu.ItemGroup>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "35px"}} onClick={() => {navigate('/') }}>
                      -- Home Page --
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T1_GA') }}>
                      Topic 1 Graph Analysis
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "-10px"}} onClick={() => {navigate('/T2o') }}>
                      Topic 2 Unemployment Overview
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button type="link" style={{marginLeft: "10px"}} onClick={() => {navigate('/T2_GA') }}>
                      Topic 2 Graph Analysis
                    </Button>
                  </Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ padding: 90, minHeight: 500, marginTop: -105 }}>
            <Breadcrumb style={{ margin: '16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 450 }}>
                aaaaaa
              </div>  
            </Breadcrumb>  
          </Content> 
          <Footer style={{ textAlign: 'center' }}>CCC assignment2 group 11</Footer>
        </Layout>

      </Layout>  
    </div>
  )
}

export default Others